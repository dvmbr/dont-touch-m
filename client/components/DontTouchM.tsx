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
  showToast: (message: string, x: number, y: number) => void;
};

type DontTouchMProps = {
  ref?: Ref<DontTouchMHandle>;
  message?: string;
  getClickMessage?: (event: MouseEvent<HTMLSpanElement>) => string;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
};

type DontTouchMToastState = {
  id: number;
  message: string;
  x: number;
  y: number;
};

/**
 * Client component that renders the interactive "Don't Touch M" element and manages its toast notifications.
 * @param [ref] - A ref object to access the imperative handle of the component.
 * @param [message="Don't touch M!"] - The default message to display in the toast notification.
 * @param [getClickMessage] - A function to generate a custom message based on the click event.
 * @param [onClick] - A callback function to handle click events on the "M" element.
 */
export default function DontTouchM({
  ref,
  message = "Don't touch M!",
  getClickMessage,
  onClick,
}: DontTouchMProps) {
  const mRef = useRef<HTMLSpanElement>(null);
  const [toast, setToast] = useState<DontTouchMToastState | null>(null);
  const toastIdRef = useRef(0);
  const closeToast = useCallback(() => setToast(null), []);

  /**
   * Shows the toast notification with the specified message and coordinates.
   * @param toastMessage - The message to display in the toast.
   * @param x - The x-coordinate for the toast's position.
   * @param y - The y-coordinate for the toast's position.
   */
  const showToast = useCallback(
    (toastMessage: string, x: number, y: number) => {
      toastIdRef.current += 1;

      setToast({
        id: toastIdRef.current,
        message: toastMessage,
        x,
        y,
      });
    },
    [],
  );

  /**
   * Moves the "M" element to a new position to escape the pointer.
   * @param pointer - The current pointer coordinates, used to determine the escape direction.
   */
  const escape = useCallback((pointer?: EscapePointer) => {
    const m = mRef.current;
    if (!m) return;

    const rect = m.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const { x, y } = getEscapePosition(
      rect,
      viewportWidth,
      viewportHeight,
      pointer,
    );

    m.style.position = "fixed";
    m.style.left = `${x}px`;
    m.style.top = `${y}px`;
  }, []);

  // Expose the imperative handle for the parent component to interact with this component.
  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return mRef.current;
      },
      showToast,
      escape,
    }),
    [showToast, escape],
  );

  // Handle the click event on the "M" element.
  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    const m = mRef.current;

    if (m) animateClick(m);

    const clickMessage = getClickMessage?.(event) ?? message;

    showToast(clickMessage, event.clientX, event.clientY);

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

/**
 * Calculates a new position for the "M" element to escape the pointer, ensuring it stays within the viewport boundaries.
 * @param rect - The bounding rectangle of the "M" element.
 * @param viewportWidth - The width of the viewport.
 * @param viewportHeight - The height of the viewport.
 * @param pointer - The current pointer coordinates, used to determine the escape direction.
 * @returns The new x and y coordinates for the "M" element.
 */
function getEscapePosition(
  rect: Pick<DOMRect, "width" | "height">,
  viewportWidth: number,
  viewportHeight: number,
  pointer?: EscapePointer,
) {
  const paddingX = Math.min(20, Math.max(0, (viewportWidth - rect.width) / 2));
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

  return { x, y };
}

/**
 * Animates the "M" element to provide visual feedback when it is clicked.
 * @param m - The "M" element to animate.
 */
function animateClick(m: HTMLSpanElement) {
  m.animate(
    [
      { transform: "scale(1) rotate(0deg)" },
      { transform: "scale(0.92) rotate(-3deg)" },
      { transform: "scale(1.06) rotate(2deg)" },
      { transform: "scale(1) rotate(0deg)" },
    ],
    { duration: 260, easing: "ease-out" },
  );
}
