"use client";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

/**
 * Returns a random distance that the "M" element should escape when the user tries to click it.
 */
function getEscapeDistance() {
  const almostCatchable = Math.random() < 0.001;

  if (almostCatchable) {
    return Math.random() * 2;
  }

  return 5 + Math.random() * 7;
}

// Component that renders an unclickable button with the "M" element that escapes the user's pointer.
export default function UnclickableButton() {
  const mRef = useRef<DontTouchMHandle>(null);
  const firstAttemptRef = useRef(true);
  const escapeDistanceRef = useRef(12);

  // Function to make the "M" element escape and recalculate the escape distance.
  const escapeAndResetDistance = () => {
    mRef.current?.escape();

    // To ensure the escape distance is recalculated after each escape.
    escapeDistanceRef.current = getEscapeDistance();
  };

  // Function to get the message to display when the "M" element is clicked.
  const getClickMessage = () => {
    if (firstAttemptRef.current) {
      return "Wait, you actually touched M?!";
    }

    return "You actually caught M!";
  };

  // Function to handle the click event on the "M" element.
  const handleClick = () => {
    firstAttemptRef.current = false;
    escapeAndResetDistance();
  };

  // Effect to initialize the escape distance and set up the mousemove event listener.
  useEffect(() => {
    escapeDistanceRef.current = getEscapeDistance();

    const handleMouseMove = (event: MouseEvent) => {
      if (firstAttemptRef.current) return;

      const m = mRef.current?.element;

      if (!m) return;

      const distance = getPointerDistance(
        m.getBoundingClientRect(),
        event.clientX,
        event.clientY,
      );

      if (distance > escapeDistanceRef.current) {
        return;
      }

      escapeAndResetDistance();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="select-none text-2xl font-bold">
        Don't touch{" "}
        <DontTouchM
          ref={mRef}
          getClickMessage={getClickMessage}
          onClick={handleClick}
        />
      </h2>
    </section>
  );
}

/**
 * Calculates the distance between the pointer and the closest point on the "M" element's bounding rectangle.
 * @param rect - The bounding rectangle of the "M" element.
 * @param x - The x-coordinate of the pointer.
 * @param y - The y-coordinate of the pointer.
 * @returns The distance between the pointer and the closest point on the "M" element's bounding rectangle.
 */
function getPointerDistance(
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom">,
  x: number,
  y: number,
) {
  const closestX = Math.max(rect.left, Math.min(x, rect.right));
  const closestY = Math.max(rect.top, Math.min(y, rect.bottom));

  return Math.hypot(x - closestX, y - closestY);
}
