import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopHeader } from "@/components/layout/admin-top-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "master") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AdminTopHeader fullName={profile.full_name} email={user.email ?? null} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
