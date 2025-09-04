
import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="border-t bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 flex flex-col md:flex-row justify-center md:justify-end items-center w-full"
      style={{ minHeight: "40px" }}
    >
      <div className="flex items-center gap-2">
        <Link
          target="_blank"
          href="https://github.com/marcosportales"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="size-6" />
          <span className="font-medium text-base">by marcosportales</span>
        </Link>
      </div>
      <span className="text-xs text-muted-foreground mt-2 md:mt-0 md:ml-4">&copy; {new Date().getFullYear()} LinkedIn Job Tracker. All rights reserved.</span>
    </footer>
  );
}
