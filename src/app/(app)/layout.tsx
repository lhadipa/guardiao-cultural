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
    .select("full_name, role, museums(color_hex)")
    .eq("id", user.id)
    .single();

  const museum = profile?.museums as unknown as { color_hex: string } | null;
  const primaryColor = museum?.color_hex ?? "#92400e";

  return (
    <div
      className="flex min-h-screen flex-col bg-muted/40"
      style={{ "--primary": primaryColor } as React.CSSProperties}
    >
      <TopHeader
        fullName={profile?.full_name ?? null}
        email={user.email ?? null}
        role={profile?.role ?? "user"}
      />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
