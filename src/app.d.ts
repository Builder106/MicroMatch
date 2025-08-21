/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace App {
  interface Locals {
    session?: {
      user?: { id?: string | null; email?: string | null } | null;
    } | null;
    userRole?: 'anonymous' | 'user' | 'ngo' | 'volunteer';
    appwrite?: {
      endpoint: string;
      projectId: string;
    };
  }
  interface PageData {
    userRole?: 'anonymous' | 'user' | 'ngo' | 'volunteer';
  }
  // interface Platform {}
}