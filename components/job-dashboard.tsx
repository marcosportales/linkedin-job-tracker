"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardContent } from "@/components/dashboard-content";
import { JobApplicationForm } from "@/components/job-application-form";

interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  application_date: string;
  job_link: string;
  status: "applied" | "interview" | "rejected" | "offer";
  user_id: string;
}

interface JobApplicationDisplay {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  link: string;
  status: "applied" | "interview" | "rejected" | "offer";
}

export function JobDashboard() {
  const { user } = useAuth();
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplicationDisplay | null>(null);
  const [applications, setApplications] = useState<JobApplicationDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const convertToDisplay = (app: JobApplication): JobApplicationDisplay => ({
    id: app.id,
    jobTitle: app.job_title,
    company: app.company_name,
    date: app.application_date,
    link: app.job_link,
    status: app.status,
  });

  const convertToDatabase = (
    app: Omit<JobApplicationDisplay, "id">,
  ): Omit<JobApplication, "id" | "user_id"> => ({
    job_title: app.jobTitle,
    company_name: app.company,
    application_date: app.date,
    job_link: app.link,
    status: app.status,
  });

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(data.map(convertToDisplay));
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load job applications.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleAddApplication = async (
    applicationData: Omit<JobApplicationDisplay, "id">,
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          ...convertToDatabase(applicationData),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setApplications((prev) => [convertToDisplay(data), ...prev]);
      setShowForm(false);
      toast.success("Application added", {
        description: "Your job application has been successfully added.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add job application.",
      });
    }
  };

  const handleEditApplication = async (
    applicationData: Omit<JobApplicationDisplay, "id">,
  ) => {
    if (!editingApplication || !user) return;

    try {
      const { data, error } = await supabase
        .from("job_applications")
        .update(convertToDatabase(applicationData))
        .eq("id", editingApplication.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingApplication.id ? convertToDisplay(data) : app,
        ),
      );
      setEditingApplication(null);
      setShowForm(false);
      toast.success("Application updated", {
        description: "Your job application has been successfully updated.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update job application.",
      });
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setApplications((prev) => prev.filter((app) => app.id !== id));
      toast.success("Application deleted", {
        description: "Your job application has been removed.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete job application.",
      });
    }
  };

  const openAddForm = () => {
    setEditingApplication(null);
    setShowForm(true);
  };

  const openEditForm = (application: JobApplicationDisplay) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingApplication(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-background">
      <DashboardHeader />

      <DashboardContent
        applications={applications}
        onEdit={openEditForm}
        onDelete={handleDeleteApplication}
        onAddNew={openAddForm}
      />

      {showForm && (
        <JobApplicationForm
          application={editingApplication}
          onSubmit={
            editingApplication ? handleEditApplication : handleAddApplication
          }
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
