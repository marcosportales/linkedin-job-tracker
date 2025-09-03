"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const auth_callback_url =
        `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/api/auth/callback` ||
        `${window.location.origin}/api/auth/callback`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: auth_callback_url,
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error("Registration failed", {
          description: error.message,
        });
      } else {
        toast.success("Account created!", {
          description: "Please check your email to confirm your account.",
        });
        router.push("/auth");
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Full Name</Label>
        <Input
          id="register-name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
