import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobDashboard } from "@/components/job-dashboard";
import { Footer } from "@/components/footer";

export default async function HomePage() {
  // Here we can't use hooks (server-side) so we do it like this
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <JobDashboard />
      </div>
      <Footer />
    </div>
  );
}
