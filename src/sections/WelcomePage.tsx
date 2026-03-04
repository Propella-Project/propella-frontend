import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RocketLogo } from "@/App";

interface WelcomePageProps {
  userName: string;
  userEmail: string;
}

export function WelcomePage({ userName, userEmail }: WelcomePageProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  // Target date: March 6th, 2026 at 6:00 PM
  const targetDate = new Date("2026-03-06T18:00:00");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsComplete(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Redirect when countdown is complete
  useEffect(() => {
    if (isComplete) {
      window.location.href = "https://propella-lp.vercel.app/";
    }
  }, [isComplete]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#0F0C15] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <RocketLogo className="w-24 h-24" />
        </motion.div>

        {/* Welcome Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] bg-clip-text text-transparent">
            PROPELLA
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-2"
        >
          Hello, {userName || "future student"}!
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-12"
        >
          You may now begin your onboarding
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm text-gray-500 mb-4">Platform launches in</p>
          <div className="flex justify-center gap-4 md:gap-6">
            <div className="bg-[#1A1625] rounded-2xl border border-white/10 p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <span className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                {formatNumber(timeLeft.days)}
              </span>
              <p className="text-xs text-gray-500 mt-2">Days</p>
            </div>
            <div className="bg-[#1A1625] rounded-2xl border border-white/10 p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <span className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                {formatNumber(timeLeft.hours)}
              </span>
              <p className="text-xs text-gray-500 mt-2">Hours</p>
            </div>
            <div className="bg-[#1A1625] rounded-2xl border border-white/10 p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <span className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                {formatNumber(timeLeft.minutes)}
              </span>
              <p className="text-xs text-gray-500 mt-2">Minutes</p>
            </div>
            <div className="bg-[#1A1625] rounded-2xl border border-white/10 p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
              <span className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                {formatNumber(timeLeft.seconds)}
              </span>
              <p className="text-xs text-gray-500 mt-2">Seconds</p>
            </div>
          </div>
        </motion.div>

        {/* Onboarding Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            className="h-14 px-8 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white font-semibold rounded-xl text-lg"
          >
            Start Onboarding
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Launch Date Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-8"
        >
          Launching March 6th, 2026 at 6:00 PM
        </motion.p>

        {/* Display referral code if present? Optional */}
        {userEmail && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs text-gray-600 mt-4"
          >
            Invited via: {userEmail}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
