import type { Metadata } from "next";
import UnclickableButton from "@/client/views/001/UnclickableButton";

export const metadata: Metadata = {
  title: "The Unclickable Button",
};

/**
 * Server component for demonstrating the "Unclickable Button" feature.
 */
export default function Page001() {
  return <UnclickableButton />;
}
