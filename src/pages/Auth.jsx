import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [mode, setMode] = useState("signup");
  const [error, setError] = useState();

  const { signUp, logIn } = useAuth();
  const navigate = useNavigate();

  function submitForm(data) {
    const result = mode === "signup" ? signUp(data) : logIn(data);

    if (result.success) {
      reset();
      navigate("/");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* TITLE */}
      <h1 className="text-gray-300 text-xl sm:text-2xl md:text-3xl font-bold text-center">
        🎥 Welcome to MOVIE-HUB
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(submitForm)}
        className="w-full max-w-sm sm:max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl flex flex-col gap-5"
      >
        {/* HEADER */}
        <h2 className="text-center text-white text-xl sm:text-2xl font-bold">
          {mode === "signup" ? "Create Account" : "Log In"}
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-300 text-black text-xs sm:text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        {mode === "signup" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs sm:text-sm text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className={`p-3 rounded-lg bg-gray-800 text-white border text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <span className="text-red-400 text-xs sm:text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
        )}

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm text-gray-300">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className={`p-3 rounded-lg bg-gray-800 text-white border text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-600 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <span className="text-red-400 text-xs sm:text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm text-gray-300">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 4, message: "Min 4 characters" },
              maxLength: { value: 12, message: "Max 12 characters" },
            })}
            className={`p-3 rounded-lg bg-gray-800 text-white border text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-600 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <span className="text-red-400 text-xs sm:text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* SWITCH MODE */}
        <p className="text-gray-400 text-xs sm:text-sm text-center">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError(null);
              reset();
            }}
            className="text-blue-500 underline cursor-pointer hover:text-blue-400"
          >
            {mode === "signup" ? "Log In" : "Sign Up"}
          </span>
        </p>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-sm sm:text-base"
        >
          {mode === "signup" ? "Sign Up" : "Log In"}
        </button>
      </form>
    </div>
  );
}
