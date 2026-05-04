"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";

interface FishSpeciesData {
  name: string;
  localName: string;
  scientificName?: string;
  category?: string;
  family?: string;
  habitat?: string;
  length?: number;
  trophicLevel?: number;
  status?: string;
}

export async function parseFishTextAndImport(formData: FormData): Promise<{ success: boolean; data?: FishSpeciesData[]; error?: string; count?: number }> {
  try {
    const text = formData.get("textData") as string;
    if (!text) throw new Error("No text provided");

    if (!text.trim()) {
      throw new Error("Please provide text data to parse.");
    }

    // Send text to OpenRouter AI
    const parseResult = await parseTextWithOpenRouter(text);

    if (!parseResult.success || !parseResult.data) {
      return { success: false, error: parseResult.error || "Failed to parse PDF" };
    }

    // Import the parsed data
    const importResult = await createManyFishSpecies(parseResult.data);

    if (!importResult.success) {
      return { success: false, error: importResult.error || "Failed to import species" };
    }

    revalidatePath("/fish-directory");
    return { success: true, data: parseResult.data, count: importResult.count };
  } catch (error: unknown) {
    console.error("Error parsing PDF:", error);
    const message = error instanceof Error ? error.message : "Failed to parse PDF";
    return { success: false, error: message };
  }
}

async function parseTextWithOpenRouter(text: string): Promise<{ success: boolean; data?: FishSpeciesData[]; error?: string }> {
  try {
    const prompt = `You are a JSON-only parser. Parse the following fish species text from Tayabas Bay, Philippines into a JSON array.

Text to parse:
${text}

REQUIRED OUTPUT FORMAT - Return ONLY a valid JSON array, no markdown, no explanation, no code blocks:
[{"scientificName": "string", "localName": "string", "family": "string", "habitat": "string", "length": number, "trophicLevel": number, "status": "string"}]

Rules:
- Each fish species becomes one object in the array
- "length" and "trophicLevel" must be numbers, not strings
- Default "status" to "native" if missing
- Map any column variations (e.g. "Species Name" → "scientificName", "Species" → "localName") appropriately
- Return ONLY the JSON array, nothing else`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks or bare JSON)
    const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/) || content.match(/(\[[\s\S]*?\])\s*$/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : null;
    if (!jsonString) {
      throw new Error("No valid JSON found in AI response");
    }

    let fishData: FishSpeciesData[];
    try {
      fishData = JSON.parse(jsonString) as FishSpeciesData[];
    } catch {
      throw new Error("Failed to parse JSON from AI response");
    }

    // Transform the data
    const transformed = fishData.map((fish) => ({
      name: fish.localName || fish.scientificName || "Unknown",
      localName: fish.localName || fish.scientificName || "Unknown",
      scientificName: fish.scientificName,
      family: fish.family,
      habitat: fish.habitat,
      length: fish.length,
      trophicLevel: fish.trophicLevel,
      status: fish.status || "native",
    }));

    return { success: true, data: transformed };
  } catch (error: unknown) {
    console.error("Error parsing with AI:", error);
    const message = error instanceof Error ? error.message : "Failed to parse with AI";
    return { success: false, error: message };
  }
}

export async function parseFishDataWithAI(text: string): Promise<{ success: boolean; data?: FishSpeciesData[]; error?: string }> {
  return parseTextWithOpenRouter(text);
}

export async function getFishSpecies(page = 1, pageSize = 50) {
  try {
    const skip = (page - 1) * pageSize;
    const [species, total] = await Promise.all([
      prisma.fishSpecies.findMany({
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.fishSpecies.count(),
    ]);

    return { data: species, total, page, pageSize };
  } catch (error) {
    console.error("Error fetching fish species:", error);
    return { data: [], total: 0, page, pageSize };
  }
}

export async function createFishSpecies(data: {
  name: string;
  localName?: string;
  scientificName?: string;
  category?: string;
  family?: string;
  habitat?: string;
  length?: number;
  trophicLevel?: number;
  status?: string;
}) {
  try {
    const fish = await prisma.fishSpecies.create({
      data: {
        name: data.name,
        localName: data.localName || data.name,
        scientificName: data.scientificName,
        category: data.category,
        family: data.family,
        habitat: data.habitat,
        length: data.length,
        trophicLevel: data.trophicLevel,
        status: data.status,
      },
    });

    revalidatePath("/fish-directory");
    return { success: true, data: fish };
  } catch (error: unknown) {
    console.error("Error creating fish species:", error);
    const message = error instanceof Error ? error.message : "Failed to create fish species";
    return { success: false, error: message };
  }
}

export async function createManyFishSpecies(species: Array<{
  name: string;
  localName?: string;
  scientificName?: string;
  category?: string;
  family?: string;
  habitat?: string;
  length?: number;
  trophicLevel?: number;
  status?: string;
}>) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const created = [];
      for (const s of species) {
        const exists = await tx.fishSpecies.findFirst({
          where: {
            OR: [
              { name: s.name },
              { scientificName: s.scientificName },
            ].filter(Boolean) as any[],
          },
        });

        if (!exists) {
          const fish = await tx.fishSpecies.create({
            data: {
              name: s.name,
              localName: s.localName || s.name,
              scientificName: s.scientificName,
              category: s.category,
              family: s.family,
              habitat: s.habitat,
              length: s.length,
              trophicLevel: s.trophicLevel,
              status: s.status || "native",
            },
          });
          created.push(fish);
        }
      }
      return created;
    });

    revalidatePath("/fish-directory");
    return { success: true, data: result, count: result.length };
  } catch (error: unknown) {
    console.error("Error creating multiple fish species:", error);
    const message = error instanceof Error ? error.message : "Failed to import fish species";
    return { success: false, error: message };
  }
}

export async function deleteFishSpecies(id: string) {
  try {
    await prisma.fishSpecies.delete({
      where: { id },
    });

    revalidatePath("/fish-directory");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting fish species:", error);
    const message = error instanceof Error ? error.message : "Failed to delete fish species";
    return { success: false, error: message };
  }
}
