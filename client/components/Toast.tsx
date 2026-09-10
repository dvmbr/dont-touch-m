"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  x: number;
  y: number;
  duration?: number;
  onClose: () => void;
};

export default function Toast({
  message,
  x,
  y,
  duration = 700,
  onClose,
}: ToastProps) {
  // Controls the fade-out animation.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start fading out after the display duration.
    const fadeTimer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    // Remove the toast after the fade-out animation finishes.
    const closeTimer = window.setTimeout(() => {
      onClose();
    }, duration + 400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      // Display the toast next to the given cursor position.
      style={{
        left: x,
        top: y,
      }}
      className={`pointer-events-none fixed z-50 ml-3 mt-3 whitespace-nowrap rounded-lg bg-black px-4 py-2 text-sm text-white transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
