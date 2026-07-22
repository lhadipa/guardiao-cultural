import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <TopHeader
        fullName={profile?.full_name ?? null}
        email={user.email ?? null}
        role={profile?.role ?? "tecnico"}
      />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
