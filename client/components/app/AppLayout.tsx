"use client";

/**
 * Client component that provides the layout styling for the application.
 * @param children - The content to be rendered within the layout.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-dvh w-dvw overflow-hidden">{children}</div>
  );
}
