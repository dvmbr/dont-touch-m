"use client";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

// Decide how close the cursor can get before M escapes.
// 99.9%: escape when the cursor gets within 5–12px.
// 0.1%: allow the cursor to get extremely close.
function getEscapeDistance() {
  const almostCatchable = Math.random() < 0.001;

  if (almostCatchable) {
    return Math.random() * 2;
  }

  return 5 + Math.random() * 7;
}

export default function UnclickableButton() {
  // Reference to the shared M component.
  const mRef = useRef<DontTouchMHandle>(null);

  // Keep M still until the first successful click.
  const firstAttemptRef = useRef(true);

  // Current distance that triggers M to escape.
  const escapeDistanceRef = useRef(12);

  // Move M to a random position inside the viewport.
  const moveM = () => {
    const m = mRef.current?.element;

    if (!m) return;

    const rect = m.getBoundingClientRect();

    // Keep M slightly away from the viewport edges.
    const edgePadding = 20;

    const maxX = window.innerWidth - rect.width - edgePadding;

    const maxY = window.innerHeight - rect.height - edgePadding;

    // Pick a random position that keeps M inside the viewport.
    const x = edgePadding + Math.random() * Math.max(0, maxX - edgePadding);

    const y = edgePadding + Math.random() * Math.max(0, maxY - edgePadding);

    // Detach M from the sentence and move it around the viewport.
    m.style.position = "fixed";
    m.style.left = `${x}px`;
    m.style.top = `${y}px`;

    // Randomize the next escape distance.
    escapeDistanceRef.current = getEscapeDistance();
  };

  const getClickMessage = () => {
    // The first successful click gets its own reaction.
    if (firstAttemptRef.current) {
      return "Wait, you actually touched M?!";
    }

    // Reaching M again after it starts escaping is extremely rare.
    return "You actually caught M!";
  };

  const handleClick = () => {
    // First click activates the escape behavior.
    if (firstAttemptRef.current) {
      firstAttemptRef.current = false;

      moveM();
      return;
    }

    // Escape again immediately after being caught.
    moveM();
  };

  useEffect(() => {
    // Set the initial escape distance.
    escapeDistanceRef.current = getEscapeDistance();

    const handleMouseMove = (event: MouseEvent) => {
      // M must remain completely still before the first click.
      if (firstAttemptRef.current) return;

      const m = mRef.current?.element;

      if (!m) return;

      const rect = m.getBoundingClientRect();

      // Find the closest point on M to the cursor.
      const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right));

      const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));

      // Calculate the shortest distance between the cursor and M.
      const distance = Math.hypot(
        event.clientX - closestX,
        event.clientY - closestY,
      );

      if (distance > escapeDistanceRef.current) {
        return;
      }

      // Escape as soon as the cursor crosses the current threshold.
      moveM();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="select-none text-2xl font-bold">
        Don't touch{" "}
        <DontTouchM
          ref={mRef}
          getClickMessage={getClickMessage}
          onClick={handleClick}
        />
      </h1>
    </main>
  );
}
