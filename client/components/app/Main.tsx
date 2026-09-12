"use client";

/**
 * Client component that renders the main content area of the application.
 * @param children - The content to be rendered within the main area.
 */
export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-0 flex-1 bg-sf p-4 flex flex-col">
      <div className="relative min-h-0 flex-1 bg-bg rounded-lg">{children}</div>
    </main>
  );
}
