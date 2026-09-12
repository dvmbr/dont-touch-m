"use client";

import { useEffect, useRef, useState } from "react";

type ToastProps = {
  message: string;
  x: number;
  y: number;
  duration?: number;
  onClose: () => void;
};

/**
 * Client component that renders a toast notification at a specified position and automatically hides it after a duration.
 */
export default function Toast({
  message,
  x,
  y,
  duration = 700,
  onClose,
}: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ x, y });

  // Adjust the toast position to ensure it stays within the viewport boundaries.
  useEffect(() => {
    const toast = toastRef.current;

    if (!toast) return;

    const rect = toast.getBoundingClientRect();

    setPosition(
      getToastPosition(rect, x, y, window.innerWidth, window.innerHeight),
    );
  }, [x, y, message]);

  // Automatically hide the toast after the specified duration and trigger the onClose callback.
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setVisible(false), duration);
    const closeTimer = window.setTimeout(() => onClose(), duration + 400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      ref={toastRef}
      style={{
        left: position.x,
        top: position.y,
      }}
      className={`pointer-events-none fixed z-50 whitespace-nowrap rounded-lg bg-fg px-4 py-2 text-sm text-bg transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}

/**
 * Calculates the optimal position for the toast notification to ensure it stays within the viewport boundaries.
 * @param rect - The bounding rectangle of the toast element.
 * @param x - The initial x-coordinate based on the pointer position.
 * @param y - The initial y-coordinate based on the pointer position.
 * @param viewportWidth - The width of the viewport.
 * @param viewportHeight - The height of the viewport.
 * @returns The adjusted x and y coordinates for the toast notification.
 */
function getToastPosition(
  rect: Pick<DOMRect, "width" | "height">,
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const edgePadding = 12;
  const cursorOffset = 12;

  let nextX = x + cursorOffset;
  let nextY = y + cursorOffset;

  if (nextX + rect.width > viewportWidth - edgePadding) {
    nextX = x - rect.width - cursorOffset;
  }

  if (nextY + rect.height > viewportHeight - edgePadding) {
    nextY = y - rect.height - cursorOffset;
  }

  return {
    x: Math.max(edgePadding, nextX),
    y: Math.max(edgePadding, nextY),
  };
}
