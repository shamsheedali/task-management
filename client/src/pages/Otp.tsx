import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import userService from "../services/userService";
import useAuthStore from "../store/authStore";

const Otp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (otpCode: string) => userService.verifyOtp(otpCode),
    onSuccess: (data) => {
      if (data.data) {
        setUser({
          id: data.data.id as string,
          username: data.data.username,
          email: data.data.email,
        });
      }
      toast.success("Account created successfully");
      navigate("/");
    },
  });

  const validateForm = () => {
    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 characters", {
        toastId: "otp-error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(otp);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10">
      <div className="p-8 max-w-md w-full bg-card dark:bg-neutral-800 backdrop-blur-lg rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          OTP Verification
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
