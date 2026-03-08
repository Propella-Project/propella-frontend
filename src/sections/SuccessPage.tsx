import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ArrowLeft,
  Mail,
  Rocket,
  MessageCircle, // For SMS
  MessageSquare, // For WhatsApp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { RocketLogo } from "@/App";

interface SuccessPageProps {
  waitlistCount: number;
  userEmail: string;
  userName: string;
  referralCode: string;
  onBackToHome: () => void;
}

export function SuccessPage({
  waitlistCount,
  userEmail,
  userName,
  referralCode,
  onBackToHome,
}: SuccessPageProps) {
  const [copied, setCopied] = useState(false);

  // Get launch date (6th of current month)
  const now = new Date();
  const launchDate = new Date(now.getFullYear(), now.getMonth(), 6);
  // If 6th has passed, use next month
  if (now.getDate() > 6) {
    launchDate.setMonth(launchDate.getMonth() + 1);
  }

  const formattedLaunchDate = launchDate.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#8B5CF6", "#A78BFA", "#CCFF00"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#8B5CF6", "#A78BFA", "#CCFF00"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8B5CF6", "#A78BFA", "#CCFF00", "#10B981"],
    });

    frame();
  }, []);

  const referralLink = `https://propella.ng/?code=${referralCode}&name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `I just signed up for PROPELLA! 🚀 AI-powered JAMB preparation is here. Join me and be ready to ace your exams! ${referralLink}`;

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case "sms":
        // Opens default SMS app with pre-filled message (works on mobile)
        url = `sms:?body=${encodeURIComponent(text)}`;
        break;
    }

    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Success Card */}
        <div className="relative bg-[#1A1625] rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-[#CCFF00]/20 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <RocketLogo className="w-16 h-16" />
            </div>

            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-24 h-24 bg-gradient-to-br from-[#CCFF00] to-[#A3E635] rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              {/* Pulse Ring */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#CCFF00] rounded-full"
              />
              <CheckCircle className="w-12 h-12 text-[#0F0C15] relative z-10" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold mb-3"
            >
              You&apos;re In! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mb-2"
            >
              Welcome to PROPELLA, {userName || "Student"}!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 mb-6"
            >
              You&apos;re our {waitlistCount.toLocaleString()}th student!
            </motion.p>

            {/* Launch Date Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#CCFF00]/10 rounded-xl p-4 mb-6 border border-[#8B5CF6]/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-5 h-5 text-[#CCFF00]" />
                <span className="font-semibold text-white">Launch Date</span>
              </div>
              <p className="text-gray-300 text-sm">
                PROPELLA will be ready on{" "}
                <span className="text-[#CCFF00] font-semibold">
                  {formattedLaunchDate}
                </span>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                We&apos;ll send you an email reminder on March 6, 2026
              </p>
            </motion.div>

            {/* Email Confirmation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#0F0C15] rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm text-gray-300">
                  Confirmation sent to
                </span>
              </div>
              <p className="text-white font-medium">{userEmail}</p>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <p className="text-sm font-medium mb-4">Share with friends</p>

              {/* Social Buttons */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-10 h-10 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-10 h-10 bg-[#4267B2]/20 hover:bg-[#4267B2]/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#4267B2]" />
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="w-10 h-10 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                </button>
                <button
                  onClick={() => handleShare("sms")}
                  className="w-10 h-10 bg-[#34B7F1]/20 hover:bg-[#34B7F1]/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#34B7F1]" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-10 h-10 bg-[#0077B5]/20 hover:bg-[#0077B5]/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                </button>
              </div>

              {/* Referral Link */}
              <div className="flex items-center gap-2 bg-[#0F0C15] rounded-lg p-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-400 px-2 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-sm flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-[#CCFF00]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={onBackToHome}
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
