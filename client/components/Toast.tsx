"use client";

import { useEffect, useRef, useState } from "react";

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
  const toastRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);

  const [position, setPosition] = useState({
    x,
    y,
  });

  useEffect(() => {
    const toast = toastRef.current;

    if (!toast) return;

    const rect = toast.getBoundingClientRect();

    const edgePadding = 12;
    const cursorOffset = 12;

    let nextX = x + cursorOffset;
    let nextY = y + cursorOffset;

    if (nextX + rect.width > window.innerWidth - edgePadding) {
      nextX = x - rect.width - cursorOffset;
    }

    if (nextY + rect.height > window.innerHeight - edgePadding) {
      nextY = y - rect.height - cursorOffset;
    }

    nextX = Math.max(edgePadding, nextX);

    nextY = Math.max(edgePadding, nextY);

    setPosition({
      x: nextX,
      y: nextY,
    });
  }, [x, y, message]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

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
      ref={toastRef}
      style={{
        left: position.x,
        top: position.y,
      }}
      className={`pointer-events-none fixed z-50 whitespace-nowrap rounded-lg bg-black px-4 py-2 text-sm text-white transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
