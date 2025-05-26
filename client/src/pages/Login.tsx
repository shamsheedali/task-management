import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import userService from "../services/userService";
import useAuthStore from "../store/authStore";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (data) => {
      if (data.data) {
        setUser({
          id: data.data.id as string,
          username: data.data.username,
          email: data.data.email,
        });
      }
      toast.success("Login successful");
      navigate("/");
    },
  });

  const validateForm = () => {
    // Email: valid format
    const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        toastId: "email-error",
      });
      return false;
    }

    // Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character",
        { toastId: "password-error" }
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10">
      <div className="p-8 max-w-md w-full bg-card dark:bg-neutral-800 backdrop-blur-lg rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputField
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging In..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary-500 font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
