"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ApplicationCard } from "@/components/application-card"
import { Briefcase, Plus } from "lucide-react"

interface JobApplication {
  id: string
  jobTitle: string
  company: string
  date: string
  link: string
  status: "applied" | "interview" | "rejected" | "offer"
}

interface ApplicationsListProps {
  applications: JobApplication[]
  onEdit: (application: JobApplication) => void
  onDelete: (id: string) => void
  onAddNew: () => void
}

export function ApplicationsList({ applications, onEdit, onDelete, onAddNew }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No applications yet</CardTitle>
          <CardDescription className="mb-4">Start tracking your LinkedIn job applications</CardDescription>
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Application
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
