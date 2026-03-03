import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, AlertCircle } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Fixed exam date – defined outside to avoid recreation on each render
const JAMB_DATE = new Date("2026-04-15T08:00:00");

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = JAMB_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // ✅ Empty dependency array – effect runs only once

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-14 h-20 sm:w-16 sm:h-24 md:w-28 md:h-32 border-white bg-gradient-to-br from-[#1A1625] to-[#0F0C15] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <span className="text-2xl sm:text-3xl md:text-5xl font-bold relative z-10 tabular-nums bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] bg-clip-text text-transparent">
          {value.toString().padStart(2, "0")}
        </span>
      </motion.div>
      <span className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <section id="countdown" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm text-gray-300">Time Remaining</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isExpired ? (
              <span className="text-[#CCFF00]">
                JAMB Is Here. Are You Ready?
              </span>
            ) : (
              <>
                JAMB{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] bg-clip-text text-transparent">
                  Countdown
                </span>
              </>
            )}
          </h2>

          {!isExpired && (
            <p className="text-gray-400">
              The clock is ticking. Every second counts towards your success.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isExpired ? (
            <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-3xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-[#CCFF00] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">The Wait Is Over</h3>
              <p className="text-gray-400 mb-6">
                JAMB has arrived. We hope you&apos;re prepared to give it your
                best shot!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Exam Date:{" "}
                  {JAMB_DATE.toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#CCFF00]/10 rounded-3xl blur-xl" />
              <div className="relative bg-[#1A1625]/50 backdrop-blur-xl rounded-3xl border border-white/10 p-4 sm:p-8 md:p-12 overflow-x-auto">
                <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
                  <TimeUnit value={timeLeft.days} label="Days" />
                  <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-600 self-start mt-4 sm:mt-6">
                    :
                  </span>
                  <TimeUnit value={timeLeft.hours} label="Hours" />
                  <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-600 self-start mt-4 sm:mt-6">
                    :
                  </span>
                  <TimeUnit value={timeLeft.minutes} label="Minutes" />
                  <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-600 self-start mt-4 sm:mt-6">
                    :
                  </span>
                  <TimeUnit value={timeLeft.seconds} label="Seconds" />
                </div>
                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Next JAMB Exam:{" "}
                      <span className="text-white font-medium">
                        {JAMB_DATE.toLocaleDateString("en-NG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
