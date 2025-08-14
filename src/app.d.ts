/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace App {
  interface Locals {
    session?: {
      user?: { email?: string | null } | null;
    } | null;
  }
  // interface PageData {}
  // interface Platform {}
}