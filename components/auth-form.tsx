"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, loginWithProvider } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await login(email, password);

    if (!error) {
      toast.success("Welcome back!", {
        description: "You've been successfully logged in.",
      });
    } else {
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const success = await register(email, password, name);

    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to LinkedIn Job Tracker.",
      });
    } else {
      toast({
        title: "Registration failed",
        description: "User already exists or an error occurred.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    const success = await loginWithProvider(provider);

    if (success) {
      toast({
        title: "Welcome!",
        description: `Successfully logged in with ${provider}.`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            LinkedIn Job Tracker
          </CardTitle>
          <CardDescription>
            Track your job applications efficiently
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <LoginForm onSubmit={handleEmailLogin} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <RegisterForm
                onSubmit={handleEmailRegister}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <SocialLoginButtons
            onSocialLogin={handleSocialLogin}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
