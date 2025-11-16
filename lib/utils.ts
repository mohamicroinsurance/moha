import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(name: string): string {
  const map: Record<string, string> = {
    Home: "/",
    Support: "/support",
    Products: "/products",
    ClaimNew: "/claims/new-claim",
    Whistleblowing: "/whistleblowing",
  };

  if (map[name]) return map[name];

  const kebab = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `/${kebab}`;
}

