// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from 'sonner';
// import axiosInstance from "../../../api/axiosInstance";
// import { useForm } from "react-hook-form";
// // import { Modal } from "../../../components/ui/modal";
// import Button from "../../../components/ui/button/Button";
// import Alert from "../../../components/ui/alert/Alert";
// import { Loader } from "../../ui/loader/Loader";
// import Label from "../../form/Label";
// import Input from "../../form/input/InputField";

// interface RegisterFormData {
//   userName: string;
//   emailAddress: string;
//   password: string;
// }

// const RegisterUser = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<RegisterFormData>({
//     mode: "onSubmit",
//     defaultValues: {
//       userName: "",
//       emailAddress: "",
//       password: "",
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   //const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       // setSuccessMessage(null);
//       toast.loading("Creating account...");

//       await axiosInstance.post("/api/account/register", {
//         ...data,
//         appName: "wyze-addon",
//       });

//       // setSuccessMessage("User registered successfully!");
//       toast.success("User registered successfully!");
//       reset(); // Clear the form after successful submission

//       setTimeout(() => {
//         navigate("/");
//       }, 3000);
//     } catch (err: any) {
//       const backendMessage =
//         err.response?.data?.message || "An unexpected error occurred.";
//       setError(backendMessage);
//       toast.error(backendMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="absolute top-3 left-6">
//         <img src="/images/logo/wyze.png" alt="Company Logo" className="w-16 h-auto" />
//       </div>
//       <div className="flex items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-5 ">
//       {error && (
//           <div className="mb-4">
//             <Alert
//               variant="error"
//               title="Login Failed"
//               message={error}
//               showLink={false}
//             />
//           </div>
//         )}
//       <div className="mb-5 sm:mb-8">
//            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
//              Register User
//            </h1>
//            <p className="text-sm text-gray-500">Fill in the details to create a new user.</p>
//        </div>
//         <div className="mt-6">
//           <Label>Username <span className="text-error-500">*</span></Label>
//           <Input
//             {...register("userName", { required: "Username is required" })}
//             placeholder="Enter username"
//             error={!!errors.userName}
//             hint={errors.userName?.message}
//           />
//         </div>

//         <div>
//           <Label>Email <span className="text-error-500">*</span></Label>
//           <Input
//             type="email"
//             {...register("emailAddress", { required: "Email is required" })}
//             placeholder="admin@example.com"
//             error={!!errors.emailAddress}
//             hint={errors.emailAddress?.message}
//           />
//         </div>

//         <div>
//           <Label>Password <span className="text-error-500">*</span></Label>
//           <Input
//             type="password"
//             {...register("password", { required: "Password is required" })}
//             placeholder="Enter password"
//             error={!!errors.password}
//             hint={errors.password?.message}
//           />
//         </div>

//         <div>
//           <Button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-error-500 text-white transition py-2 rounded-lg flex justify-center items-center gap-2">
//             {loading && <Loader />} {loading ? "Creating User..." : "Create Account"}
//           </Button>
//         </div>
//       </form>
//       </div>

//       <Toaster richColors />
//     </>
//   );
// };

// export default RegisterUser;

import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";
import Alert, { AlertProps } from "../../ui/alert/Alert";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";

import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { toast, Toaster } from "sonner";
import Loader from "../../ui/loader/Loader";

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  userRole: string;
  company: string;
  isSuspended: boolean;
  password: string;
  confirmPassword: string;
}

const PasswordInput: React.FC<{
  id: string;
  register: any; // Use 'any' or the specific type of your register function
  placeholder: string;
  error: boolean;
  hint?: string;
  label: string; // Add a label prop
  required?: boolean; // Add required prop
  name: string;
}> = ({ id, register, placeholder, error, hint, label, required, name }) => {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          {...register(name, {
            required: required ? `${label} is required` : undefined,
          })} // Use the label in the message
          placeholder={placeholder}
          error={error}
          className="pr-10" // Make space for the icon
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
          title={isPasswordVisible ? "Hide Password" : "Show Password"}
        >
          {isPasswordVisible ? (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-error-500">{hint}</p>}
    </div>
  );
};

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    userRole: z.string().min(2, "User role is required"),
    company: z.string().min(2, "Company name is required"),
    isSuspended: z
      .enum(["true", "false"], {
        errorMap: () => ({ message: "Please select a suspension status" }),
      })
      .transform((val) => val === "true"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const REGISTER_USER_ENDPOINT = "/api/v1/account/Register";

export default function RegisterUserForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [isSuspendedLocal, setIsSuspendedLocal] = useState(""); // Local state for the select value
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post(REGISTER_USER_ENDPOINT, data);

      if (response.data.status) {
        setSuccessAlertVisible(true);
        toast.success("Account registered successfully!");
        // setTimeout(() => {
        //   navigate("/");
        // }, 3000);
      } else {
        setError(response.data.message || "Failed to register user.");
      }
    } catch (error: any) {
      setError(
        error.message || "An unexpected error occurred during registration."
      );
      toast.error("Failed to register user account");
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successAlertVisible) {
      const timer = setTimeout(() => {
        setSuccessAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successAlertVisible]);

  const successAlertProps: AlertProps = {
    variant: "success",
    title: "Success",
    message: `User account registered successfully!`,
  };

  const errorAlertProps: AlertProps = {
    variant: "error",
    title: "Error",
    message: error || `Failed to register user account. Please try again.`,
  };

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 sm:px-6 lg:px-8">
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 lg:max-w-2xl xl:max-w-4xl">
          <AnimatePresence>
            {successAlertVisible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-5"
              >
                <Alert {...successAlertProps} />
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-5"
              >
                <Alert {...errorAlertProps} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mb-5 sm:mb-8">
            <h4 className="mb-2 font-semibold text-gray-800 dark:text-white text-title-sm sm:text-title-md">
              Register User
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details to create a new user.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <div className="lg:flex lg:space-x-8">
              <div className="flex flex-col space-y-4 lg:w-1/2">
                <div>
                  <Label htmlFor="firstName">
                    First Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    placeholder="Enter first name"
                    error={!!errors.firstName}
                    hint={errors.firstName?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    Last Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    placeholder="Enter last name"
                    error={!!errors.lastName}
                    hint={errors.lastName?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="admin@example.com"
                    error={!!errors.email}
                    hint={errors.email?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="userName">
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="userName"
                    {...register("userName", {
                      required: "Username is required",
                    })}
                    placeholder="Enter username"
                    error={!!errors.userName}
                    hint={errors.userName?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">
                    Phone No <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    placeholder="Enter phone number"
                    error={!!errors.phoneNumber}
                    hint={errors.phoneNumber?.message}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4 mt-4 lg:mt-0 lg:w-1/2">
                <div>
                  <Label htmlFor="userRole">
                    User Role <span className="text-error-500">*</span>
                  </Label>
                  <select
                    id="userRole"
                    {...register("userRole")} // No need for required validation here, Zod handles it
                    className={`
                      block
                      w-full
                      px-3
                      py-2
                      border
                      rounded-md
                      shadow-sm
                      focus:outline-none
                      focus:ring-indigo-500
                      focus:border-indigo-500
                      sm:text-sm
                      ${errors.userRole ? "border-red-500" : "border-gray-300"}
                    `}
                  >
                    <option value="">Select a role</option>{" "}
                    {/* Optional: A default placeholder option */}
                    <option value="Admin">Admin</option>
                    <option value="Production Supervisor">
                      Production Supervisor
                    </option>
                    <option value="Sales Supervisor">Sales Supervisor</option>
                    <option value="User">User</option>
                  </select>
                  {errors.userRole && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userRole.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company">
                    Company <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    {...register("company", {
                      required: "Company name is required",
                    })}
                    placeholder="Enter company name"
                    error={!!errors.company}
                    hint={errors.company?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="isSuspended">
                    Suspended <span className="text-error-500">*</span>
                  </Label>
                  <select
                    id="isSuspended"
                    value={isSuspendedLocal}
                    className={`h-11 w-full appearance-none rounded-lg border ${
                      errors.isSuspended
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
                        : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800"
                    } bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`}
                    {...register("isSuspended", {
                      required: "Suspension status is required",
                      onChange: (e) => setIsSuspendedLocal(e.target.value),
                    })}
                  >
                    <option value="" disabled>
                      Suspended (Yes/No)
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  {errors.isSuspended?.message && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.isSuspended.message}
                    </p>
                  )}
                </div>
                <div>
                  {/* <Label htmlFor="password">
                  Password <span className="text-error-500">*</span>
                </Label> */}
                  <PasswordInput
                    id="password"
                    name="password"
                    register={register}
                    placeholder="Enter password"
                    error={!!errors.password}
                    hint={errors.password?.message}
                    label="Password"
                    required={true}
                  />
                </div>
                <div>
                  {/* <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-error-500">*</span>
                </Label> */}
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    register={register}
                    placeholder="Confirm password"
                    error={!!errors.confirmPassword}
                    hint={errors.confirmPassword?.message}
                    label="Confirm Password"
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-error-500 text-white transition py-2 rounded-lg flex justify-center items-center gap-2"
              >
                {loading && <Loader />}{" "}
                {loading ? "Create Account" : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}
