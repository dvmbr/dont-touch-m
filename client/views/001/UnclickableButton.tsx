"use client";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

function getEscapeDistance() {
  const almostCatchable = Math.random() < 0.001;

  if (almostCatchable) {
    return Math.random() * 2;
  }

  return 5 + Math.random() * 7;
}

export default function UnclickableButton() {
  const mRef = useRef<DontTouchMHandle>(null);

  const firstAttemptRef = useRef(true);

  const escapeDistanceRef = useRef(12);

  const escapeAndResetDistance = () => {
    mRef.current?.escape();

    escapeDistanceRef.current = getEscapeDistance();
  };

  const getClickMessage = () => {
    if (firstAttemptRef.current) {
      return "Wait, you actually touched M?!";
    }

    return "You actually caught M!";
  };

  const handleClick = () => {
    if (firstAttemptRef.current) {
      firstAttemptRef.current = false;

      escapeAndResetDistance();
      return;
    }

    escapeAndResetDistance();
  };

  useEffect(() => {
    escapeDistanceRef.current = getEscapeDistance();

    const handleMouseMove = (event: MouseEvent) => {
      if (firstAttemptRef.current) return;

      const m = mRef.current?.element;

      if (!m) return;

      const rect = m.getBoundingClientRect();

      const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right));

      const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));

      const distance = Math.hypot(
        event.clientX - closestX,
        event.clientY - closestY,
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
