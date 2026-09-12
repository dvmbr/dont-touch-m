import type { Metadata } from "next";
import DontScroll from "@/client/views/002/DontScroll";

export const metadata: Metadata = {
  title: "Don't Scroll M",
};

/**
 * Server component for demonstrating the "Don't Scroll M" feature.
 */
export default function Page002() {
  return <DontScroll />;
}
