"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Mail } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SocialLoginButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithProvider } = useAuth();
  const router = useRouter();

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);

    try {
      const { error } = await loginWithProvider(provider);

      console.log(error);

      if (!error) {
        toast.success("Welcome!", {
          description: `Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
        });
        router.push("/");
      } else {
        toast.error("Sign in failed", {
          description: `Failed to sign in with ${provider}. Please try again.`,
        });
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
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("github")}
        disabled={isLoading}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
