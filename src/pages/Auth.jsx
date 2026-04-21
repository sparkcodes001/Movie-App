import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Install @heroicons/react


export function AuthPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, logIn } = useAuth();
  const navigate = useNavigate();

  async function submitForm(formData) {
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } =
        mode === "signup" ? await signUp(formData) : await logIn(formData);

      if (authError) {
        setError(authError.message);
      } else if (mode === "signup" && !data.session) {
        // This handles the case where Email Confirmation is still ON
        setError("Success! Please check your email to confirm your account.");
      } else {
        reset();
        navigate("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -top-10 -left-10 z-0" />
      <div className="absolute w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -bottom-10 -right-10 z-0" />

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-white italic">
            MOVIE<span className="text-indigo-500">HUB</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col gap-6"
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>

          {error && (
            <div
              className={`text-xs p-3 rounded-lg text-center border ${
                error.includes("Success")
                  ? "bg-green-500/10 border-green-500 text-green-400"
                  : "bg-red-500/10 border-red-500 text-red-400"
              }`}
            >
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: mode === "signup" })}
                className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              {...register("email", { required: true })}
              className="p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-indigo-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition"
              >
                
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : mode === "signup"
                ? "Get Started"
                : "Sign In"}
          </button>

          <p className="text-gray-400 text-sm text-center">
            {mode === "signup" ? "Already a member?" : "New to MovieHub?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setError(null);
                reset();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              {mode === "signup" ? "Log In" : "Create Account"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
