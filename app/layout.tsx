import type { Metadata } from "next";
import "./globals.css";
import Header from "@/client/components/app/Header";
import Main from "@/client/components/app/Main";
import AppLayout from "@/client/components/app/AppLayout";
import Nav from "@/client/components/app/Nav";

export const metadata: Metadata = {
  title: "dontTouchM",
  description: "Don't touch M.",
};

/**
 * Server component that defines the document structure shared by all pages.
 * @param children - The content to be rendered within the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppLayout>
          <Nav />
          <Header />
          <Main>{children}</Main>
        </AppLayout>
      </body>
    </html>
  );
}
