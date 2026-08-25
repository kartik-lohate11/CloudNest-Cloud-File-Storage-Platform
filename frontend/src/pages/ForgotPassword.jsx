import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Cloud, ShieldCheck, Clock, RotateCcw, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authService } from "../services/api";
import { useFiles } from "../context/FileContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setUser } = useFiles();

  // Wizard Step: 1 = Email Input & Send OTP, 2 = OTP Verification, 3 = Update Password
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Timer & UI Feedback State (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 5-Minute Countdown Timer Effect
  useEffect(() => {
    let interval = null;
    if (step === 2 && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // Format seconds to MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Step 1: Send OTP to User Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await authService.sendOtp(email.trim(), "FORGOT_PASSWORD");
      setStep(2);
      setTimeLeft(300); // 5 minutes timer
      setSuccessMsg(`OTP sent successfully to ${email}. Code expires in 5 minutes.`);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err?.response?.data : null) ||
        err?.message ||
        "Failed to send OTP code. Please check your email address and try again.";
      setErrorMsg(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await authService.sendOtp(email.trim(), "FORGOT_PASSWORD");
      setTimeLeft(300); // Reset timer back to 5 minutes
      setSuccessMsg(`New OTP code sent to ${email}! Timer reset to 05:00.`);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    if (timeLeft === 0) {
      setErrorMsg("OTP has expired! Please click Resend OTP to receive a new code.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const verifyRes = await authService.verifyOtp(email.trim(), otp.trim(), "FORGOT_PASSWORD");
      const msg = typeof verifyRes === "string" ? verifyRes : verifyRes?.message || "";
      if (msg && !msg.toLowerCase().includes("verified successfully")) {
        setErrorMsg(msg || "Invalid OTP code. Please check your email and try again.");
        return;
      }

      setStep(3); // Advance to Update Password step
      setSuccessMsg("OTP verified successfully! Please set your new password.");
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Invalid OTP code. Please check your email and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 3: Update Password & Render Dashboard
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please enter matching passwords.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Call POST /user/api/update-password with payload { mail: email, password: newPassword }
      await authService.updatePassword(email.trim(), newPassword);

      // Save user session in localStorage & FileContext
      const mockToken = `cloudnest-token-${Date.now()}`;
      localStorage.setItem("cloudnest_token", mockToken);
      setUser((prev) => ({
        ...prev,
        email: email.trim(),
        name: email.split("@")[0] || "User",
      }));

      // Render directly to Dashboard
      navigate("/");
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err?.response?.data : null) ||
        err?.message ||
        "Failed to update password. Please try again.";
      setErrorMsg(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen bg-[#0b0c16] text-white">
      {/* Left Branding Section */}
      <section className="hidden lg:flex w-1/2 relative login-abstract-bg items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center flex flex-col items-center p-12">
          <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-2xl mb-6 flex items-center justify-center shadow-2xl border border-white/20">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-6xl font-extrabold text-white mb-4 tracking-tight font-['Hanken_Grotesk']">
            CloudNest
          </h2>
          <p className="text-xl text-white/90 font-medium tracking-wide">
            Instant recovery, reliable safety.
          </p>
        </div>
      </section>

      {/* Right Form Section */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-[#0b0c16] min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="glass-card w-full max-w-md rounded-2xl p-8 sm:p-10 relative z-10 shadow-2xl border border-white/10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>

          {/* STEP 1: Enter Email & Send OTP */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-['Hanken_Grotesk']">
                  Reset password
                </h1>
                <p className="text-gray-400 text-sm">
                  Enter the email address associated with your CloudNest account to receive an OTP.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="dark-input block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-lg text-sm font-semibold text-white btn-gradient hover:opacity-95 transition-all mt-4 disabled:opacity-50"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Verify OTP Code */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1 font-['Hanken_Grotesk']">
                  Verify OTP Code
                </h1>
                <p className="text-gray-400 text-xs max-w-xs mx-auto">
                  We sent a 6-digit code to <strong className="text-white">{email}</strong>.
                </p>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 text-center">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="dark-input block w-full py-3 text-center text-xl font-bold tracking-[0.4em] text-white rounded-xl focus:border-blue-500"
                  />
                </div>

                {/* 5-Minute Countdown Timer Display */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>OTP Expiration:</span>
                  </div>

                  <span
                    className={`font-mono text-sm font-bold ${
                      timeLeft > 60
                        ? "text-emerald-400"
                        : timeLeft > 0
                        ? "text-amber-400 animate-pulse"
                        : "text-red-400"
                    }`}
                  >
                    {timeLeft > 0 ? formatTimer(timeLeft) : "00:00 (Expired)"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !otp.trim() || timeLeft === 0}
                  className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-lg text-sm font-semibold text-white btn-gradient hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isVerifying ? "Verifying OTP..." : "Verify OTP Code"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Edit Email Address
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isResending ? "Resending..." : "Resend OTP"}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Update Password & Render Dashboard */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1 font-['Hanken_Grotesk']">
                  Set New Password
                </h1>
                <p className="text-gray-400 text-xs">
                  Create a new password for your account <strong className="text-white">{email}</strong>.
                </p>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 text-center">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="dark-input block w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="dark-input block w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-lg text-sm font-semibold text-white btn-gradient hover:opacity-95 transition-all mt-4 disabled:opacity-50"
                >
                  {isLoading ? "Updating Password..." : "Update Password & Go to Dashboard"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
