// @ts-nocheck
// Tests for /api/catches endpoint

describe("/api/catches", () => {
  it("should return 401 when not authenticated", async () => {
    const { GET } = await import("@/app/api/catches/route");
    const response = await GET({} as Request);
    expect(response.status).toBe(401);
  });

  it("should create a catch record", async () => {
    const { POST } = await import("@/app/api/catches/route");
    const response = await POST({
      json: async () => ({
        fishermanId: "f1",
        location: "Poblacion",
        details: [{ fishId: "s1", quantity: 10, weight: 50 }],
      }),
    } as Request);
    expect(response.status).toBe(201);
  });
});
