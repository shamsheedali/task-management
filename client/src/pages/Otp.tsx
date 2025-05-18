import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import userService from "../services/userService";

const Otp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (otpCode: string) => userService.verifyOtp(otpCode),
    onSuccess: () => navigate("/"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(otp);
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
          <button type="submit" className="btn btn-primary w-full">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
