"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-provider";
import { LogOut, Briefcase, User } from "lucide-react";
import Image from "next/image";

export function DashboardHeader() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">LinkedIn Job Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          {user &&
            (user?.user_metadata?.avatar_url ? (
              <Image
                src={user?.user_metadata?.avatar_url}
                alt={`${user?.user_metadata?.name} user avatar`}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="size-8" />
            ))}

          <span className="text-sm text-muted-foreground">
            Welcome,{" "}
            {user?.user_metadata?.name || user?.user_metadata?.full_name}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={logout}
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
