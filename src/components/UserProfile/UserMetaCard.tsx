import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
//import { useAuth } from "../../hooks/useAuth";
import { NewModal } from "../ui/modal/ConfirmationModal";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axiosInstance from "../../api/axiosInstance";
import { SubmitHandler, useForm } from "react-hook-form";

import { FiSave } from "react-icons/fi";
import Loader from "../ui/loader/Loader";

export interface EditPersonalInformationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  company: string;
}

export const editPersonalInformationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  userRole: z.string().min(2, "User role is required"),
  company: z.string().min(2, "Company name is required"),
});

export type EditPersonalInformationFormSchema = z.infer<
  typeof editPersonalInformationSchema
>;

export interface EditPersonalInformationFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    userRole?: string;
    company?: string;
  } | null;
  onUserUpdated?: (updatedUser: any) => void; // Optional callback for parent component
}

export default function UserMetaCard({
  isOpen,
  setIsOpen,
  user: propUser,
  onUserUpdated,
}: EditPersonalInformationFormProps) {
  // const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPersonalInformationFormData>({
    resolver: zodResolver(editPersonalInformationSchema),
    defaultValues: {
      firstName: propUser?.firstName || '',
      lastName: propUser?.lastName || '',
      email: propUser?.email || '',
      phoneNumber: propUser?.phoneNumber || '',
      userRole: propUser?.userRole || '',
      company: propUser?.company || '',
    },
    mode: 'onSubmit', // Only validate on submit for better user experience
  });

  const onSubmit: SubmitHandler<EditPersonalInformationFormData> = async (
    data: EditPersonalInformationFormData
  ) => {
    if (!propUser?.id) {
      toast.error('User ID is not available.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/api/v1/user/update-user/${propUser.id}`,
        data
      );

      if (response.data?.status) {
        toast.success('Personal information updated successfully!');
        setIsOpen(false);
        // Optimistic Update (assuming the backend reflects changes immediately)
        const updatedUser = { ...propUser, ...data };
        onUserUpdated?.(updatedUser);

        // Optional: Re-fetch user data to ensure consistency
        // const updatedAuthResponse = await axiosInstance.get(`/api/v1/user/${propUser.id}`);
        // if (updatedAuthResponse.data?.status && updatedAuthResponse.data.user) {
        //   reLoginUser({ token: authUser?.token || '', user: updatedAuthResponse.data.user });
        // }

      } else {
        setError(
          response.data?.message || 'Failed to update personal information.'
        );
        toast.error(
          response.data?.message || 'Failed to update personal information.'
        );
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
      toast.error(error.message || 'An unexpected error occurred.');
      console.error('Update Personal Information Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="/images/avatar.jpg" alt="User" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {`${propUser?.firstName} ${propUser?.lastName}`}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {propUser?.userRole}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {propUser?.company}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
             
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)} // Use the setIsOpen prop
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>
      <NewModal isOpen={isOpen} onClose={() => setIsOpen(false)}> {/* Use the isOpen prop */}
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              {/* Form fields remain the same, but now use propUser for defaultValues */}
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      hint={errors.firstName?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      hint={errors.lastName?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="text"
                      id="email"
                      {...register('email')}
                      error={!!errors.email}
                      hint={errors.email?.message}
                    />
                  </div>

                  {/* <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Input
                      type="text"
                      id="phoneNumber"
                      {...register('phoneNumber')}
                      error={!!errors.phoneNumber}
                      hint={errors.phoneNumber?.message}
                    />
                  </div> */}

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="userRole">Role</Label>
                    <Input
                      type="text"
                      id="userRole"
                      {...register('userRole')}
                      error={!!errors.userRole}
                      hint={errors.userRole?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      type="text"
                      id="company"
                      {...register('company')}
                      error={!!errors.company}
                      hint={errors.company?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)} // Use the setIsOpen prop
                disabled={loading}
              >
                Close
              </Button>
              <Button variant="sync" size="sm" type="submit" disabled={loading}>
                {loading ? (
                  <Loader />
                ) : (
                  <span className="flex items-center gap-2">
                    <FiSave className="text-base" />
                    Save Changes
                  </span>
                )}
              </Button>

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </NewModal>
    </>
  );
}
