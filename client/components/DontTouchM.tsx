"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Toast from "@/client/components/Toast";

export type DontTouchMHandle = {
  element: HTMLSpanElement | null;
  showWarning: (message: string, x: number, y: number) => void;
};

type DontTouchMProps = {
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

const DontTouchM = forwardRef<DontTouchMHandle, DontTouchMProps>(
  function DontTouchM(
    { message = "Don't touch M!", getClickMessage, onClick },
    forwardedRef,
  ) {
    // Reference to the actual M element.
    const mRef = useRef<HTMLSpanElement>(null);

    // Current warning displayed by M.
    const [toast, setToast] = useState<ToastState | null>(null);

    // A new ID forces Toast to restart its fade-out timer.
    const toastIdRef = useRef(0);

    const closeToast = useCallback(() => {
      setToast(null);
    }, []);

    const showWarning = useCallback(
      (warningMessage: string, x: number, y: number) => {
        // Every event creates a fresh Toast lifecycle.
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

    // Allow each challenge to access M and trigger its warning.
    useImperativeHandle(
      forwardedRef,
      () => ({
        get element() {
          return mRef.current;
        },
        showWarning,
      }),
      [showWarning],
    );

    const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
      const m = mRef.current;

      // Make M react briefly when touched.

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
  },
);

export default DontTouchM;
