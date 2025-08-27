"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobApplication {
  id: string
  jobTitle: string
  company: string
  date: string
  link: string
  status: "applied" | "interview" | "rejected" | "offer"
}

interface DashboardStatsProps {
  applications: JobApplication[]
}

export function DashboardStats({ applications }: DashboardStatsProps) {
  const totalApplications = applications.length
  const interviews = applications.filter((app) => app.status === "interview").length
  const offers = applications.filter((app) => app.status === "offer").length
  const responseRate =
    totalApplications > 0
      ? Math.round((applications.filter((app) => app.status !== "applied").length / totalApplications) * 100)
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviews}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{offers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseRate}%</div>
        </CardContent>
      </Card>
    </div>
  )
}
