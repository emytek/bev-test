import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
// import WyzeLogo from "/images/logo/wyze.png";
import { Loader } from "../ui/loader/Loader";
import { useAuth } from "../../hooks/useAuth";
import { LoginRequest } from "../../types/authTypes";
import Alert, { AlertProps } from "../ui/alert/Alert";
import { toast, Toaster } from "sonner";

const signInSchema = z.object({
  userNameEmail: z.string().min(3, "Invalid username or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
    // State for the success alert
    const [successAlert, setSuccessAlert] = useState<Pick<
    AlertProps,
    "title" | "message" | "variant"
  > | null>(null);
  const [errorAlert, setErrorAlert] = useState<Pick<
  AlertProps,
  "title" | "message" | "variant"
> | null>(null);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(signInSchema),
  });

  // const onSubmit = async (data: LoginRequest) => {
  //   try {
  //     await login(data);
  //     // Display success alert
  //     // setSuccessAlert({
  //     //   variant: "success",
  //     //   title: "Login Successful",
  //     //   message: "You have successfully logged in!",
  //     // });
  //     // Navigate to dashboard after a brief delay
  //     toast.success("Login successful")
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 2000); 
  //   } catch (err) {
  //     toast.error("Invalid Credentials");
  //     if (err instanceof Error) {
  //       console.error("Login Error:", err.message);
  //     } else {
  //       console.error("Login Error:", String(err));
  //     }
  //   }
  // };

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      const response = await login(data);
      if (response?.message === "Login successful") {
        toast.success("Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else if (response?.message === "Invalid credentials") {
        toast.error("Invalid Credentials");
      }
    } catch (err: any) {
      if (err?.message && err.message !== "Login successful" && err.message !== "Invalid credentials") {
        toast.error(err.message);
        console.error("Login Error:", err.message);
      } else {
        console.error("Login Error:", String(err));
      }
    }
  };

  

  // Clear the success alert after a timeout
  useEffect(() => {
    if (successAlert) {
      const timer = setTimeout(() => {
        setSuccessAlert(null);
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [successAlert]);

  useEffect(() => {
    if (errorAlert) {
      const timer = setTimeout(() => {
        setErrorAlert(null);
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [errorAlert]);

  return (
    <>
    <div className="flex flex-col flex-1 justify-center items-center h-screen">
      <div className="w-full max-w-md pt-10 mx-auto">
          {/* Success Message Alert */}
          {successAlert && (
          <div className="mb-4">
            <Alert
              variant={successAlert.variant}
              title={successAlert.title}
              message={successAlert.message}
              showLink={false}
            />
          </div>
        )}
          {errorAlert && (
          <div className="mb-4">
            <Alert
              variant={errorAlert.variant}
              title={errorAlert.title}
              message={errorAlert.message}
              showLink={false}
            />
          </div>
        )}
        {/* Error Message Alert on Form*/}
        {error && (
          <div className="mb-4">
            <Alert
              variant="error"
              title="Login Failed"
              message={error}
              showLink={false}
            />
          </div>
        )}

        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to sign in!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email or Username
            </label>
            <input
              {...register("userNameEmail")}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
              placeholder="admin@example.com"
            />
            {errors.userNameEmail && (
              <p className="text-red-500 text-sm">
                {errors.userNameEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
              
              {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-500 hover:text-error-500 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
            </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-error-500 transition text-white py-2 rounded-lg flex justify-center items-center gap-2"
          >
            {loading && <Loader />}{" "}
            {/* Show loader when request is in progress */}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/create-user"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Create User
                </Link>
              </p>
        </div>
      </div>
    </div>

    <Toaster richColors />
    </>
  );
}
