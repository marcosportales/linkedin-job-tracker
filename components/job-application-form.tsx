"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface JobApplication {
  id: string
  jobTitle: string
  company: string
  date: string
  link: string
  status: "applied" | "interview" | "rejected" | "offer"
}

interface JobApplicationFormProps {
  application?: JobApplication | null
  onSubmit: (data: Omit<JobApplication, "id">) => void
  onCancel: () => void
}

export function JobApplicationForm({ application, onSubmit, onCancel }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    date: "",
    link: "",
    status: "applied" as const,
  })

  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        company: application.company,
        date: application.date,
        link: application.link,
        status: application.status,
      })
    }
  }, [application])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Job Application" : "Add Job Application"}</DialogTitle>
          <DialogDescription>
            {application
              ? "Update the details of your job application."
              : "Add a new job application to track your progress."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="e.g. Tech Corp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Application Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">LinkedIn Job Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              placeholder="https://linkedin.com/jobs/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{application ? "Update Application" : "Add Application"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
