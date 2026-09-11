"use client";

import "./style.css";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

export default function DontScroll() {
  const mRef = useRef<DontTouchMHandle>(null);

  const surpriseRef = useRef<HTMLParagraphElement>(null);

  const surpriseActiveRef = useRef(false);

  useEffect(() => {
    let blockedUntil = 0;
    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.clientX !== pointerX || event.clientY !== pointerY) {
        blockedUntil = 0;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      const m = mRef.current?.element;

      if (!m) return;

      const rect = m.getBoundingClientRect();
      const isOverM =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      const continuesBlockedGesture =
        Date.now() < blockedUntil &&
        event.clientX === pointerX &&
        event.clientY === pointerY;

      if (!isOverM && !continuesBlockedGesture) return;

      event.preventDefault();
      blockedUntil = Date.now() + 200;
      pointerX = event.clientX;
      pointerY = event.clientY;

      mRef.current?.showWarning(
        "Don't scroll M!",
        event.clientX,
        event.clientY,
      );

      if (!isOverM) return;

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
    document.documentElement.classList.add("dont-scroll-active");

    return () => {
      document.documentElement.classList.remove("dont-scroll-active");
    };
  }, []);

  useEffect(() => {
    const surprise = surpriseRef.current;

    if (!surprise) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          return;
        }

        if (surpriseActiveRef.current) {
          return;
        }

        surpriseActiveRef.current = true;

        surprise.animate(
          [
            {
              transform: "scale(1)",
            },
            {
              transform: "scale(1.15) rotate(-2deg)",
            },
            {
              transform: "scale(1)",
            },
          ],
          {
            duration: 350,
            easing: "ease-out",
          },
        );

        mRef.current?.showWarning(
          "Wait... how did you get down here?!",
          window.innerWidth / 2,
          window.innerHeight / 2,
        );

        window.setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 650);

        window.setTimeout(() => {
          surpriseActiveRef.current = false;
        }, 1400);
      },
      {
        threshold: [0.5],
      },
    );

    observer.observe(surprise);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="dont-scroll-page relative min-h-[200vh] select-none overflow-x-hidden">
      <section className="flex h-screen items-center justify-center overflow-hidden">
        <h1 className="flex items-center font-bold">
          <span className="whitespace-nowrap text-2xl">Don't scroll </span>

          <DontTouchM ref={mRef} />
        </h1>
      </section>

      <section className="flex h-screen items-center justify-center">
        <p ref={surpriseRef} className="text-2xl font-bold">
          You should be able to scroll here.
        </p>
      </section>
    </main>
  );
}
