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
    let result;

    if (mode === "signup") {
      result = signUp(data);
    } else {
      result = logIn(data);
    }

    if (result.success) {
      reset();
      navigate("/");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br flex-col gap-20 from-gray-900 via-black to-gray-800">
      <h1 className="text-gray-300 text-3xl font-bold">
        {" "}
        🎥 Welcome to MOVIE-HUB
      </h1>

      <form
        onSubmit={handleSubmit(submitForm)}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6"
      >
        {/* HEADER */}
        {mode === "signup" ? (
          <h1 className="text-3xl font-bold text-center text-white">
            Create Account
          </h1>
        ) : (
          <h1 className="text-3xl font-bold text-center text-white">Log-In</h1>
        )}

        {/* ERROR */}
        {error && (
          <span className="bg-red-300 p-2 text-sm text-black rounded-sm text-center">
            {error}
          </span>
        )}

        {/* NAME */}
        {mode === "signup" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-300">
              Name
            </label>
            <input
              type="name"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className={`bg-gray-800 text-white border rounded-lg p-2 focus:outline-none focus:ring-2 
            ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-600 focus:ring-blue-500"
            }`}
            />
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className={`bg-gray-800 text-white border rounded-lg p-2 focus:outline-none focus:ring-2 
            ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-600 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "At least 4 characters",
              },
              maxLength: {
                value: 12,
                message: "Max 12 characters",
              },
            })}
            className={`bg-gray-800 text-white border rounded-lg p-2 focus:outline-none focus:ring-2 
            ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-600 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <span className="text-red-400 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* AuthSwitch */}
        {mode === "signup" ? (
          <p className="text-gray-400 text-sm">
            Already have an account{" "}
            <span
              onClick={() => {
                setMode("login");
                setError(null);
                reset();
              }}
              className="underline text-blue-500 cursor-pointer hover:text-blue-400"
            >
              Log In
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Don't have an account{" "}
            <span
              onClick={() => {
                setMode("signup");
                setError(null);
                reset();
              }}
              className="underline text-blue-500 cursor-pointer hover:text-blue-400"
            >
              signUp
            </span>
          </p>
        )}

        {/* Button */}
        {mode === "signup" ? (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-2 rounded-lg font-semibold cursor-pointer"
          >
            Sign Up
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-2 rounded-lg font-semibold cursor-pointer"
          >
            Log In
          </button>
        )}
      </form>
    </div>
  );
}
