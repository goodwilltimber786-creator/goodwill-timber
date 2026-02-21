import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 40, suffix: "+", label: "Years of Experience" },
  { value: 5000, suffix: "+", label: "Happy Customers" },
  { value: 200, suffix: "+", label: "Products Available" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 800;
          const steps = 40;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="counter-value">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function Stats() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 3500); // Change stat every 3.5 seconds (0.8s animation + 2.7s pause)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-3 md:py-5 lg:py-8 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-16">
          <div key={activeIndex} className="text-center transition-all duration-500 animate-fade-in">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-1">
              <AnimatedCounter value={stats[activeIndex].value} suffix={stats[activeIndex].suffix} />
            </div>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base leading-tight">
              {stats[activeIndex].label}
            </p>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-foreground" : "w-2 bg-muted-foreground"
              }`}
              aria-label={`Show stat ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}