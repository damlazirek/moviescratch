import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";

export function AppShell() {
  return (
    <div className="grain flex min-h-dvh flex-col bg-ink">
      <Navigation />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-line/80 px-5 py-6 sm:px-8">
        <p className="font-ui mx-auto max-w-6xl text-center text-xs tracking-wide text-muted">
          Stop choosing. Start watching.
        </p>
      </footer>
    </div>
  );
}
