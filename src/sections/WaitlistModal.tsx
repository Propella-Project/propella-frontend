import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User,
  Phone,
  Check,
  Loader2,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RocketLogo } from "@/App";
import {
  registerUser,
  verifyEmail,
  resendCode,
  login,
  createExamProfile,
} from "@/lib/api";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, name: string) => void;
  onLoginClick: () => void;
}

const JAMB_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Government",
  "Economics",
  "Literature",
  "Christian Religious Studies",
  "Islamic Religious Studies",
];

export function WaitlistModal({
  isOpen,
  onClose,
  onSuccess,
  onLoginClick,
}: WaitlistModalProps) {
  const [step, setStep] = useState<"form" | "sending" | "verify" | "verifying">(
    "form",
  );
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    writingJamb: "",
    subjects: [] as string[],
    phone: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Resend timer countdown
  useEffect(() => {
    if (step === "verify" && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendTimer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.writingJamb) {
      newErrors.writingJamb = "Please select an option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSendCode = async () => {
    if (!validateForm()) return;

    setStep("sending");

    // Use the user's provided password instead of generating one
    const pwd = formData.password;
    setGeneratedPassword(pwd);

    const result = await registerUser({
      email: formData.email,
      password: pwd,
      username: formData.email.split("@")[0],
    });

    if (result.success) {
      toast.success("Verification code sent to your email!");
      setStep("verify");
      setResendTimer(120);
      setCanResend(false);
    } else {
      // Check for duplicate email message
      if (result.error?.toLowerCase().includes("already exists")) {
        toast.error("You are already registered. Please log in instead.");
      } else {
        toast.error(result.error || "Failed to send verification code");
      }
      setStep("form");
    }
  };

  const handleVerify = async () => {
    const fullCode = verificationCode.join("");

    if (fullCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setStep("verifying");

    // 1. Verify email
    const verifyResult = await verifyEmail({
      email: formData.email,
      code: fullCode,
    });

    if (!verifyResult.success) {
      toast.error(verifyResult.error || "Invalid verification code");
      setStep("verify");
      return;
    }

    // 2. Login to obtain JWT token
    const loginResult = await login({
      email: formData.email,
      password: generatedPassword,
    });

    // Check both success and that data exists
    if (!loginResult.success || !loginResult.data) {
      toast.error("Auto-login failed. Please try logging in manually.");
      setStep("verify");
      return;
    }

    // Store token – TypeScript now knows loginResult.data is defined
    localStorage.setItem("access_token", loginResult.data.access);
    localStorage.setItem("refresh_token", loginResult.data.refresh);

    // 3. Create exam profile with collected extra data
    const profileResult = await createExamProfile({
      firstName: formData.firstName,
      writingJamb: formData.writingJamb,
      subjects: formData.subjects,
      phone: formData.phone || undefined,
    });

    if (!profileResult.success) {
      toast.error(profileResult.error || "Profile creation failed");
      // Still consider the user verified but show error
    }

    // 4. Notify parent and close modal
    toast.success("Welcome to PROPELLA!");
    onSuccess(formData.email, formData.firstName);

    // Reset form
    setStep("form");
    setFormData({
      firstName: "",
      email: "",
      password: "",
      writingJamb: "",
      subjects: [],
      phone: "",
    });
    setVerificationCode(["", "", "", "", "", ""]);
    setGeneratedPassword("");
  };
  const handleResend = async () => {
    const result = await resendCode(formData.email);

    if (result.success) {
      toast.success("New verification code sent!");
      setResendTimer(120);
      setCanResend(false);
    } else {
      toast.error(result.error || "Failed to resend code");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value.toUpperCase();
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `code-${index + 1}`,
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(
        `code-${index - 1}`,
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().slice(0, 6);
    const newCode = pasted.split("").concat(Array(6 - pasted.length).fill(""));
    setVerificationCode(newCode);
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#1A1625] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <RocketLogo className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {step === "verify" || step === "verifying"
                ? "Verify Your Email"
                : "Join the Waitlist"}
            </h2>
            <p className="text-gray-400 text-sm">
              {step === "verify" || step === "verifying"
                ? `Enter the 6-digit code sent to ${formData.email}`
                : "Be the first to experience AI-powered JAMB preparation. Limited spots available."}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Form Step */}
            {step === "form" && (
              <>
                {/* First Name */}
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium mb-2 block"
                  >
                    First Name <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="Enter your first name"
                      className="pl-10 bg-[#0F0C15] border-white/10 focus:border-[#8B5CF6]"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-[#EF4444] text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium mb-2 block"
                  >
                    Email Address <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      className="pl-10 bg-[#0F0C15] border-white/10 focus:border-[#8B5CF6]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[#EF4444] text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium mb-2 block"
                  >
                    Password <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Create a password"
                      className="pl-10 pr-10 bg-[#0F0C15] border-white/10 focus:border-[#8B5CF6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[#EF4444] text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">Password must have:</p>
                    <ul className="text-xs space-y-1">
                      <li
                        className={
                          formData.password.length >= 8
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        • At least 8 characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        • One uppercase letter (A-Z)
                      </li>
                      <li
                        className={
                          /[0-9]/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        • One number (0-9)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Login Link */}
                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="text-[#8B5CF6] hover:text-[#A78BFA] underline"
                  >
                    Login
                  </button>
                </p>

                {/* Writing JAMB */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Writing JAMB this year?{" "}
                    <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            writingJamb: option,
                          }))
                        }
                        className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                          formData.writingJamb === option
                            ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white"
                            : "bg-[#0F0C15] border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {errors.writingJamb && (
                    <p className="text-[#EF4444] text-xs mt-1">
                      {errors.writingJamb}
                    </p>
                  )}
                </div>

                {/* Subjects (Optional) */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Subjects <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {JAMB_SUBJECTS.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          formData.subjects.includes(subject)
                            ? "bg-[#CCFF00]/20 border-[#CCFF00] text-white"
                            : "bg-[#0F0C15] border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {formData.subjects.includes(subject) && (
                          <Check className="w-3 h-3 inline mr-1" />
                        )}
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium mb-2 block"
                  >
                    Phone Number{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+234..."
                      className="pl-10 bg-[#0F0C15] border-white/10 focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Send Code Button */}
                <Button
                  onClick={handleSendCode}
                  className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white font-semibold rounded-xl"
                >
                  Send Verification Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By joining, you agree to receive updates about PROPELLA. We
                  respect your privacy.
                </p>
              </>
            )}

            {/* Sending State */}
            {step === "sending" && (
              <div className="py-12 flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-10 h-10 text-[#8B5CF6]" />
                </motion.div>
                <p className="mt-4 text-gray-400">
                  Sending verification code...
                </p>
              </div>
            )}

            {/* Verify Code Step */}
            {(step === "verify" || step === "verifying") && (
              <>
                {/* Code Inputs */}
                <div className="flex justify-center gap-2 mb-6">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={handleCodePaste}
                      disabled={step === "verifying"}
                      className="w-12 h-14 text-center text-2xl font-bold bg-[#0F0C15] border-2 border-white/10 rounded-xl focus:border-[#8B5CF6] focus:outline-none transition-colors uppercase disabled:opacity-50"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerify}
                  disabled={
                    step === "verifying" ||
                    verificationCode.join("").length !== 6
                  }
                  className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {step === "verifying" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Join Waitlist"
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Resend in{" "}
                      <span className="text-[#CCFF00]">
                        {formatTime(resendTimer)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Back to Form */}
                <button
                  onClick={() => setStep("form")}
                  className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
                >
                  ← Back to form
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
