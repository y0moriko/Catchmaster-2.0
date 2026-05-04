import { Sidebar } from "@/components/Sidebar";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-secondary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Municipality of Agdangan, Quezon
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{session.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{(session.user as { role?: string })?.role || "Staff"}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User className="w-6 h-6" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
