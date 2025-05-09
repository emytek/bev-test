"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../ui/button/Button";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      console.log("Submitted:", data);
      // API logic here
      reset();
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 shadow-2xl rounded-2xl p-8 md:p-10 space-y-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
              errors.currentPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="Enter current password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
            onClick={() => setShowCurrent((prev) => !prev)}
          >
            {showCurrent ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
              errors.newPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
            onClick={() => setShowNew((prev) => !prev)}
          >
            {showNew ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="sync"
            size="md"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
