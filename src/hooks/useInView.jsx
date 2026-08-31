import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that detects when an element enters the viewport.
 * Returns [ref, isInView] where ref should be attached to the target element.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1, default 0.15)
 * @param {string} options.rootMargin - Margin around root (default "0px 0px -60px 0px")
 * @param {boolean} options.triggerOnce - If true, only triggers once (default true)
 */
export function useInView({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}

/**
 * Animated wrapper component that fades/slides in when scrolled into view.
 */
export function AnimateOnScroll({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 600,
  className = "",
  ...props
}) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : getInitialTransform(animation),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function getInitialTransform(animation) {
  switch (animation) {
    case "fade-in-up":
      return "translateY(30px)";
    case "fade-in-down":
      return "translateY(-30px)";
    case "fade-in-left":
      return "translateX(-30px)";
    case "fade-in-right":
      return "translateX(30px)";
    case "scale-in":
      return "scale(0.92)";
    case "fade-in":
    default:
      return "translateY(20px)";
  }
}
