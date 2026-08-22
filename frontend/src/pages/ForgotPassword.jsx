import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, Cloud } from "lucide-react";
import { authService } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await authService.forgotPassword(email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <main className="flex w-full min-h-screen bg-[#0b0c16] text-white">
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-['Hanken_Grotesk']">
              Reset password
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the email address associated with your CloudNest account.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold text-sm mb-1">Check your inbox</h4>
              <p className="text-gray-300 text-xs mb-4">
                We've sent password reset instructions to{" "}
                <strong className="text-white">{email}</strong>.
              </p>
              <Link
                to="/login"
                className="btn-gradient inline-block py-2 px-4 rounded-xl text-xs font-semibold text-white shadow-md"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </section>

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
    </main>
  );
};

export default ForgotPassword;
