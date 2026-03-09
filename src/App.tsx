import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/sections/Hero";
import { LiveCounter } from "@/sections/LiveCounter";
import { CountdownTimer } from "@/sections/CountdownTimer";
import { Features } from "@/sections/Features";
import { WaitlistModal } from "@/sections/WaitlistModal";
import { SuccessPage } from "@/sections/SuccessPage";
import { WelcomePage } from "@/sections/WelcomePage";
import { ForgotPasswordPage } from "@/sections/ForgotPasswordPage";
import { ResetPasswordPage } from "@/sections/ResetPasswordPage";
import { Toaster } from "@/components/ui/sonner";

export type PageState = "landing" | "success";

// Rocket Logo Component
export function RocketLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-xl rocket-gradient flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5 text-white"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    </div>
  );
}

// Main app content (landing and success pages)
function AppContent() {
  const [searchParams] = useSearchParams();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [pageState, setPageState] = useState<PageState>("landing");
  const [userEmail, setUserEmail] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(4281);
  const [userName, setUserName] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");

  // Handle referral params - store in localStorage but stay on landing page
  useEffect(() => {
    const ref = searchParams.get("ref");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (ref && name && email) {
      localStorage.setItem(
        "propella_user",
        JSON.stringify({ email, name, ref }),
      );
    }
  }, [searchParams]);

  // Scroll to section handler
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle successful waitlist join
  const handleWaitlistSuccess = (email: string, name: string, referralCode: string) => {
    setUserEmail(email);
    setUserName(name);
    setUserReferralCode(referralCode);
    setPageState("success");
    localStorage.setItem("propella_user", JSON.stringify({ email, name, ref: referralCode }));
    setWaitlistCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0F0C15] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {pageState === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0C15]/80 backdrop-blur-lg border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-3">
                    <RocketLogo className="w-9 h-9" />
                    <span className="font-bold text-xl tracking-tight">
                      PROPELLA
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-8">
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Features
                    </button>
                    <button
                      onClick={() => scrollToSection("countdown")}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Countdown
                    </button>
                    <button
                      onClick={() => setShowWaitlistModal(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            <main className="pt-16">
              <Hero onJoinWaitlist={() => setShowWaitlistModal(true)} />
              <LiveCounter count={waitlistCount} />
              <CountdownTimer />
              <Features />

              {/* Final CTA Section */}
              <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                      Ready to{" "}
                      <span className="bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] bg-clip-text text-transparent">
                        Ace Your JAMB?
                      </span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                      Join {waitlistCount.toLocaleString()} students already
                      preparing smarter. Be the first to experience AI-powered
                      JAMB preparation.
                    </p>
                    <motion.button
                      onClick={() => setShowWaitlistModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                    >
                      Sign Up Now
                    </motion.button>
                  </motion.div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-12 px-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <RocketLogo className="w-8 h-8" />
                      <span className="font-bold">PROPELLA</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      © 2026 PROPELLA. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Privacy
                      </a>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Terms
                      </a>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </main>
          </motion.div>
        )}

        {pageState === "success" && (
          <SuccessPage
            waitlistCount={waitlistCount}
            userEmail={userEmail}
            userName={userName}
            referralCode={userReferralCode}
            onBackToHome={() => setPageState("landing")}
          />
        )}
      </AnimatePresence>

      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        onLoginClick={() => {
          setShowWaitlistModal(false);
          // Navigate to dashboard
          window.location.href = "https://dashboard.propella.ng";
        }}
        onSuccess={(email: string, name: string, referralCode: string) => {
          setShowWaitlistModal(false);
          handleWaitlistSuccess(email, name, referralCode);
        }}
      />
      <Toaster />
    </div>
  );
}

// Redirect to external dashboard
function LoginRedirect() {
  useEffect(() => {
    window.location.href = "https://dashboard.propella.ng";
  }, []);
  return null;
}

// Wrapper for WelcomePage to extract query params
function WelcomePageWrapper() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "there";
  const email = searchParams.get("email") || "";
  const ref = searchParams.get("ref") || "";

  // Optionally store the user info when they come via referral
  useEffect(() => {
    if (ref && name !== "there") {
      localStorage.setItem("propella_user", JSON.stringify({ email, name }));
    }
  }, [ref, name, email]);

  return <WelcomePage userName={name} userEmail={email} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/welcome" element={<WelcomePageWrapper />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
