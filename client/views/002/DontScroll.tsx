"use client";

import styles from "./DontScroll.module.css";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

/**
 * Client component that handles wheel gestures over M and returns to the top when the lower message appears.
 */
export default function DontScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mRef = useRef<DontTouchMHandle>(null);
  const surpriseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let blockedUntil = 0;
    let pointerX = 0;
    let pointerY = 0;

    /**
     * Releases the blocked wheel gesture when the pointer moves.
     * @param event - The pointer movement event.
     */
    const handlePointerMove = (event: PointerEvent) => {
      if (event.clientX !== pointerX || event.clientY !== pointerY) {
        blockedUntil = 0;
      }
    };

    /**
     * Blocks wheel gestures started over M and triggers one warning and escape per gesture.
     * @param event - The wheel input event.
     */
    const handleWheel = (event: WheelEvent) => {
      const m = mRef.current?.element;

      if (!m) return;

      const isOverM = isPointerInside(
        m.getBoundingClientRect(),
        event.clientX,
        event.clientY,
      );
      const continuesBlockedGesture =
        Date.now() < blockedUntil &&
        event.clientX === pointerX &&
        event.clientY === pointerY;

      if (!isOverM && !continuesBlockedGesture) return;

      event.preventDefault();
      blockedUntil = Date.now() + 200;
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (continuesBlockedGesture) return;

      mRef.current?.showToast("Don't scroll M!", event.clientX, event.clientY);

      mRef.current?.escape({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    const surprise = surpriseRef.current;
    const scrollContainer = scrollRef.current;

    if (!surprise || !scrollContainer) return;

    let isMessageVisible = false;
    let scrollTimer: number | undefined;
    let animation: Animation | undefined;

    /**
     * Starts the surprise sequence when the lower message enters view.
     * @param entries - Visibility updates for the lower message.
     */
    const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
        isMessageVisible = false;
        return;
      }

      if (isMessageVisible) return;

      isMessageVisible = true;
      window.clearTimeout(scrollTimer);
      animation?.cancel();

      animation = animateSurprise(surprise);

      mRef.current?.showToast(
        "Wait... how did you get down here?!",
        window.innerWidth / 2,
        window.innerHeight / 2,
      );

      scrollTimer = window.setTimeout(() => {
        scrollContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 650);
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollContainer,
      threshold: [0.5],
    });

    observer.observe(surprise);

    return () => {
      observer.disconnect();
      window.clearTimeout(scrollTimer);
      animation?.cancel();
    };
  }, []);

  return (
    <div ref={scrollRef} className={`${styles.container} p-4`}>
      <section className="flex h-full items-center justify-center">
        <h2 className="select-none text-2xl font-bold">
          <span className="whitespace-nowrap text-2xl">Don't scroll </span>

          <DontTouchM ref={mRef} />
        </h2>
      </section>

      <section className="flex h-full items-center justify-center">
        <p ref={surpriseRef} className="text-2xl font-bold">
          You should be able to scroll here.
        </p>
      </section>
    </div>
  );
}

/**
 * Checks whether the pointer is inside an element's bounding rectangle.
 * @param rect - The bounding rectangle of the element.
 * @param x - The x-coordinate of the pointer.
 * @param y - The y-coordinate of the pointer.
 * @returns Whether the pointer is inside or on the edge of the rectangle.
 */
function isPointerInside(
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom">,
  x: number,
  y: number,
) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/**
 * Animates the lower message when it enters view.
 * @param surprise - The lower message element to animate.
 * @returns The animation instance for cancellation when replaced or unmounted.
 */
function animateSurprise(surprise: HTMLParagraphElement) {
  return surprise.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.15) rotate(-2deg)" },
      { transform: "scale(1)" },
    ],
    { duration: 350, easing: "ease-out" },
  );
}
