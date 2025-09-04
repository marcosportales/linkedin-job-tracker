"use client"

import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard-stats"
import { ApplicationsList } from "@/components/applications-list"
import { Plus } from "lucide-react"

interface JobApplication {
  id: string
  jobTitle: string
  company: string
  date: string
  link: string
  status: "applied" | "interview" | "rejected" | "offer"
}

interface DashboardContentProps {
  applications: JobApplication[]
  onEdit: (application: JobApplication) => void
  onDelete: (id: string) => void
  onAddNew: () => void
}

export function DashboardContent({ applications, onEdit, onDelete, onAddNew }: DashboardContentProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="flex flex-col max-md:items-center">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <p className="text-muted-foreground">Track your LinkedIn job applications</p>
        </div>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <DashboardStats applications={applications} />

      <ApplicationsList applications={applications} onEdit={onEdit} onDelete={onDelete} onAddNew={onAddNew} />
    </main>
  )
}
