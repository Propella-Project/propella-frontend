import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, TrendingUp } from "lucide-react";

interface LiveCounterProps {
  count: number;
}

export function LiveCounter({ count }: LiveCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Spring animation for smooth number transition
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    spring.set(count);
  }, [count, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayCount(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  // Trigger animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            spring.set(count);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [count, hasAnimated, spring]);

  return (
    <section ref={countRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#CCFF00]/10 rounded-3xl blur-xl" />

          <div className="relative bg-[#1A1625]/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left - Icon & Label */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Sign Ups
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-sm text-[#CCFF00]">Growing fast</span>
                  </div>
                </div>
              </div>

              {/* Center - Counter */}
              <div className="text-center">
                <motion.div
                  className="text-5xl md:text-7xl font-bold tabular-nums"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #CCFF00 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {displayCount.toLocaleString()}
                </motion.div>
                <div className="text-gray-400 mt-2">Students Signed Up</div>
              </div>

              {/* Right - Live Indicator */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-[#CCFF00] rounded-full" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-3 h-3 bg-[#CCFF00] rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-400">Live</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Goal: 10,000 students</span>
                <span>{Math.round((count / 10000) * 100)}%</span>
              </div>
              <div className="h-3 bg-[#0F0C15] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(count / 10000) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
