// src/components/user/EditUserForm.tsx
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import axiosInstance from "../../api/axiosInstance";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Loader } from "../ui/loader/Loader";

interface EditUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  userRole: string;
  company: string;
  isSuspended: boolean;
}

const editUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  userRole: z.string().min(2, "User role is required"),
  company: z.string().min(2, "Company name is required"),
  isSuspended: z.boolean(),
});

interface EditUserFormProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
    company: string;
    isSuspended: boolean;
  };
  onUserUpdated: (updatedUser: any) => void;
  onClose: () => void;
}

const EDIT_USER_ENDPOINT = "/api/v1/user/update-user";

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onUserUpdated,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      userRole: user.userRole,
      company: user.company,
      isSuspended: user.isSuspended,
    },
  });

  const onSubmit: SubmitHandler<EditUserFormData> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        id: user.id,
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      };
      const response = await axiosInstance.post(
        `${EDIT_USER_ENDPOINT}/${user.id}`,
        payload
      );

      if (response.data?.status) {
        onUserUpdated({ ...user, ...data, fullName: payload.fullName });
      } else {
        setError(response.data?.message || "Failed to update user.");
        toast.error(response.data?.message || "Failed to update user.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
      console.error("Update User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(error)
  return (
    <div className="dark:bg-gray-800 rounded-lg max-h-[70vh] overflow-y-auto p-6">
      <h4 className="mb-4 font-semibold text-gray-800 dark:text-white">
        Edit User
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Enter first name"
            error={!!errors.firstName}
            hint={errors.firstName?.message}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Enter last name"
            error={!!errors.lastName}
            hint={errors.lastName?.message}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter email"
            error={!!errors.email}
            hint={errors.email?.message}
          />
        </div>
        <div>
          <Label htmlFor="userName">Username</Label>
          <Input
            id="userName"
            {...register("userName")}
            placeholder="Enter username"
            error={!!errors.userName}
            hint={errors.userName?.message}
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            {...register("phoneNumber")}
            placeholder="Enter phone number"
            error={!!errors.phoneNumber}
            hint={errors.phoneNumber?.message}
          />
        </div>
        <div>
          <Label htmlFor="userRole">User Role</Label>
          <Input
            id="userRole"
            {...register("userRole")}
            placeholder="Enter user role"
            error={!!errors.userRole}
            hint={errors.userRole?.message}
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Enter company name"
            error={!!errors.company}
            hint={errors.company?.message}
          />
        </div>
        <div>
          <Label htmlFor="isSuspended">Suspended</Label>
          <select
            id="isSuspended"
            className={`h-11 w-full appearance-none rounded-lg border ${
              errors.isSuspended
                ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800"
            } bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`}
            {...register("isSuspended")}
            defaultValue={String(user.isSuspended)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {errors.isSuspended?.message && (
            <p className="mt-1.5 text-xs text-error-500">
              {errors.isSuspended.message}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="sync">
            {loading ? <Loader /> : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
