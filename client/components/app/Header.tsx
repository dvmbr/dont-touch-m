"use client";

type HeaderProps = {
  title?: string;
};

/**
 * Client component that renders a visually hidden header for accessibility purposes.
 * @param [title="Don't Touch M"] - The text to display within the header.
 */
export default function Header({ title = "Don't Touch M" }: HeaderProps) {
  return (
    <header className="sr-only">
      <h1 className="text-9xl font-bold">{title}</h1>
    </header>
  );
}
