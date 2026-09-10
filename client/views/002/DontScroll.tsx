"use client";

import "./style.css";

import { useEffect, useRef } from "react";
import DontTouchM, {
  type DontTouchMHandle,
} from "@/client/components/DontTouchM";

export default function DontScroll() {
  // Reference to the shared M component.
  const mRef = useRef<DontTouchMHandle>(null);

  // Reference to the lower message.
  const surpriseRef = useRef<HTMLParagraphElement>(null);

  // Prevent bounce animations from stacking.
  const bounceActiveRef = useRef(false);

  // Prevent the surprise sequence from running multiple times at once.
  const surpriseActiveRef = useRef(false);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Ignore wheel events over the browser scrollbar area.

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      const isOverScrollbar =
        event.clientX >= window.innerWidth - scrollbarWidth;

      if (isOverScrollbar) return;

      // Block the actual page scroll.

      event.preventDefault();

      const m = mRef.current?.element;

      // Make M bounce slightly whenever scrolling is attempted.
      if (m && !bounceActiveRef.current) {
        bounceActiveRef.current = true;

        m.style.transform = "translateY(-16px)";

        window.setTimeout(() => {
          m.style.transform = "translateY(0)";
        }, 120);

        window.setTimeout(() => {
          bounceActiveRef.current = false;
        }, 240);
      }

      // Every wheel event refreshes the warning timer.
      mRef.current?.showWarning(
        "Don't scroll M!",
        event.clientX,
        event.clientY,
      );
    };

    // passive: false is required to prevent wheel scrolling.
    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
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
        // Wait until the lower message becomes clearly visible.
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          return;
        }

        if (surpriseActiveRef.current) {
          return;
        }

        surpriseActiveRef.current = true;

        // React when the user somehow reaches the lower message.
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

        // Use the same shared warning system.
        mRef.current?.showWarning(
          "Wait... how did you get down here?!",
          window.innerWidth / 2,
          window.innerHeight / 2,
        );

        // Send the user back to M after the surprise.
        window.setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 650);

        // Allow the sequence again after returning to the top.
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

      {/* Reaching this message means the user somehow got past M. */}
      <section className="flex h-screen items-center justify-center">
        <p ref={surpriseRef} className="text-2xl font-bold">
          You should be able to scroll here.
        </p>
      </section>
    </main>
  );
}
