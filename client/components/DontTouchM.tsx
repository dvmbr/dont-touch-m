"use client";

import {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
  type Ref,
} from "react";
import Toast from "@/client/components/Toast";

type EscapePointer = { x: number; y: number };

export type DontTouchMHandle = {
  element: HTMLSpanElement | null;
  escape: (pointer?: EscapePointer) => void;
  showWarning: (message: string, x: number, y: number) => void;
};

type DontTouchMProps = {
  ref?: Ref<DontTouchMHandle>;
  message?: string;
  getClickMessage?: (event: MouseEvent<HTMLSpanElement>) => string;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
};

type ToastState = {
  id: number;
  message: string;
  x: number;
  y: number;
};

export default function DontTouchM({
  ref,
  message = "Don't touch M!",
  getClickMessage,
  onClick,
}: DontTouchMProps) {
  const mRef = useRef<HTMLSpanElement>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const toastIdRef = useRef(0);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const showWarning = useCallback(
    (warningMessage: string, x: number, y: number) => {
      toastIdRef.current += 1;

      setToast({
        id: toastIdRef.current,
        message: warningMessage,
        x,
        y,
      });
    },
    [],
  );

  const escape = useCallback((pointer?: EscapePointer) => {
    const m = mRef.current;
    if (!m) return;

    const rect = m.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const paddingX = Math.min(
      20,
      Math.max(0, (viewportWidth - rect.width) / 2),
    );
    const paddingY = Math.min(
      20,
      Math.max(0, (viewportHeight - rect.height) / 2),
    );
    const maxX = Math.max(paddingX, viewportWidth - rect.width - paddingX);
    const maxY = Math.max(paddingY, viewportHeight - rect.height - paddingY);
    let x = paddingX + Math.random() * (maxX - paddingX);
    let y = paddingY + Math.random() * (maxY - paddingY);

    if (
      pointer &&
      pointer.x >= x &&
      pointer.x <= x + rect.width &&
      pointer.y >= y &&
      pointer.y <= y + rect.height
    ) {
      x = pointer.x < viewportWidth / 2 ? maxX : paddingX;
      y = pointer.y < viewportHeight / 2 ? maxY : paddingY;
    }

    m.style.position = "fixed";
    m.style.left = `${x}px`;
    m.style.top = `${y}px`;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return mRef.current;
      },
      showWarning,
      escape,
    }),
    [showWarning, escape],
  );

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    const m = mRef.current;

    if (m) {
      m.animate(
        [
          {
            transform: "scale(1) rotate(0deg)",
          },

          {
            transform: "scale(0.92) rotate(-3deg)",
          },

          {
            transform: "scale(1.06) rotate(2deg)",
          },

          {
            transform: "scale(1) rotate(0deg)",
          },
        ],

        {
          duration: 260,

          easing: "ease-out",
        },
      );
    }

    const clickMessage = getClickMessage?.(event) ?? message;

    showWarning(
      clickMessage,

      event.clientX,

      event.clientY,
    );

    onClick?.(event);
  };

  return (
    <>
      <span
        ref={mRef}
        onClick={handleClick}
        className="inline-block cursor-pointer select-none text-[12rem] font-black leading-none transition-transform duration-150 ease-out"
      >
        M
      </span>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          x={toast.x}
          y={toast.y}
          onClose={closeToast}
        />
      )}
    </>
  );
}
