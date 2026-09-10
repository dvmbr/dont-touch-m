"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "@/client/components/Toast";

type ToastState = {
  message: string;
  x: number;
  y: number;
};

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
  // Reference to the actual M button element.
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keep M still until the first successful click.
  const firstAttemptRef = useRef(true);

  // Current distance that triggers M to escape.
  const escapeDistanceRef = useRef(12);

  // Current toast displayed on the screen.
  const [toast, setToast] = useState<ToastState | null>(null);

  // Remove the current toast.
  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Move M to a random position inside the viewport.
  const moveM = () => {
    const button = buttonRef.current;

    if (!button) return;

    // Get the current size of M before calculating its next position.
    const rect = button.getBoundingClientRect();

    // Keep M slightly away from the viewport edges.
    const edgePadding = 20;

    const maxX = window.innerWidth - rect.width - edgePadding;

    const maxY = window.innerHeight - rect.height - edgePadding;

    // Pick a random position that keeps the entire M inside the viewport.
    const x = edgePadding + Math.random() * Math.max(0, maxX - edgePadding);

    const y = edgePadding + Math.random() * Math.max(0, maxY - edgePadding);

    // Detach M from "Don't touch M" and move it around the viewport.
    button.style.position = "fixed";
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    // Randomize the escape distance after every escape.
    escapeDistanceRef.current = getEscapeDistance();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // First click: surprise the user and start the escape behavior.
    if (firstAttemptRef.current) {
      firstAttemptRef.current = false;

      // Show the first surprise toast where M was clicked.
      setToast({
        message: "Wait, you actually touched M?!",
        x: event.clientX,
        y: event.clientY,
      });

      // M immediately escapes after the first successful click.
      moveM();
      return;
    }

    // Rare successful click after M has started escaping.
    setToast({
      message: "You actually caught M!",
      x: event.clientX,
      y: event.clientY,
    });

    // Escape again immediately after being caught.
    moveM();
  };

  useEffect(() => {
    // Set the initial escape distance.
    escapeDistanceRef.current = getEscapeDistance();

    const handleMouseMove = (event: MouseEvent) => {
      // M must remain completely still before the first click.
      if (firstAttemptRef.current) return;

      const button = buttonRef.current;

      if (!button) return;

      // Get M's current position and size.
      const rect = button.getBoundingClientRect();

      // Find the closest point on M to the cursor.
      const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right));

      const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));

      // Calculate the shortest distance between the cursor and M.
      const distance = Math.hypot(
        event.clientX - closestX,
        event.clientY - closestY,
      );

      // Do nothing while the cursor is still far enough away.
      if (distance > escapeDistanceRef.current) return;

      // Escape as soon as the cursor crosses the current threshold.
      moveM();
    };

    // Track cursor movement across the entire viewport.
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="select-none text-2xl font-bold">
        Don't touch{" "}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          className="cursor-pointer select-none border-0 bg-transparent p-0 text-[12rem] font-black leading-none"
        >
          M
        </button>
      </h1>

      {toast && (
        <Toast
          message={toast.message}
          x={toast.x}
          y={toast.y}
          onClose={closeToast}
        />
      )}
    </main>
  );
}
