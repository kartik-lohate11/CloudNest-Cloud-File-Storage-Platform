import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Cloud, Check } from "lucide-react";
import { authService } from "../services/api";
import { useFiles } from "../context/FileContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useFiles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsLoading(true);

    try {
      const response = await authService.signup({ name, email, password });
      if (response && response.token) {
        localStorage.setItem("cloudnest_token", response.token);
        if (response.user) {
          setUser((prev) => ({ ...prev, ...response.user }));
        }
        navigate("/");
      }
    } catch {
      // Navigate on demo
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen bg-[#0b0c16] text-white">
      {/* Left Section */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-[#0b0c16] min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="glass-card w-full max-w-md rounded-2xl p-8 sm:p-10 relative z-10 shadow-2xl border border-white/10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-['Hanken_Grotesk']">
              Create an account
            </h1>
            <p className="text-gray-400 text-sm">
              Start your 120 GB free cloud storage experience today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kartik Lohate"
                  className="dark-input block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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

            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400 leading-tight">
                I agree to CloudNest's{" "}
                <span className="text-blue-400 hover:underline">Terms of Service</span> and{" "}
                <span className="text-blue-400 hover:underline">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-lg text-sm font-semibold text-white btn-gradient hover:opacity-95 transition-all mt-4 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign up for Free"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="hidden lg:flex w-1/2 relative login-abstract-bg items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center flex flex-col items-center p-12">
          <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-2xl mb-6 flex items-center justify-center shadow-2xl border border-white/20">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-6xl font-extrabold text-white mb-4 tracking-tight font-['Hanken_Grotesk']">
            CloudNest
          </h2>
          <p className="text-xl text-white/90 font-medium tracking-wide">
            Enterprise grade security. Zero friction.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
