import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
// import WyzeLogo from "/images/logo/wyze.png";
import { Loader } from "../ui/loader/Loader";
import { useAuth } from "../../hooks/useAuth";
import { LoginRequest } from "../../types/authTypes";
import Alert from "../ui/alert/Alert";

// Validation schema
// const signInSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export default function SignInForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signInSchema),
//   });

//   const onSubmit = (data: any) => {
//     console.log("Sign In Data:", data);
//   };

//   return (
//     <div className="flex flex-col flex-1">
//         <div className="w-full max-w-md pt-10 mx-auto">
//         {/* Logo */}
//         <div className="mb-5 flex justify-start">
//           <img src={WyzeLogo} alt="Wyze Logo" className="h-10 w-auto dark:invert" />
//         </div>

//         <div className="mb-5 sm:pt-10">
//           <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//             <ChevronLeftIcon className="size-5" />
//             Back to Dashboard
//           </Link>
//         </div>

//         <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
//           Sign In
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Enter your email and password to sign in!
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email
//               </label>
//               <input
//                 placeholder="info@gmail.com"
//                 {...register("email")}
//                 className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring focus:ring-indigo-500"
//               />
//               {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password")}
//                   className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring focus:ring-indigo-500"
//                 />
//                 <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300">
//                   {showPassword ? <EyeCloseIcon className="size-5" /> : <EyeIcon className="size-5" />}
//                 </span>
//               </div>
//               {errors.password && <p className="text-error-500 text-sm mt-1">{errors.password.message}</p>}
//             </div>

//             <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Checkbox checked={isChecked} onChange={setIsChecked} />
//                     <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
//                       Keep me logged in
//                     </span>
//                   </div>
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-brand-500 hover:text-error-500 dark:text-brand-400"
//                   >
//                     Forgot password?
//                   </Link>
//             </div>
//             <button type="submit" className="w-full bg-gray-900 hover:bg-error-500 text-white py-2 rounded-lg transition">
//               Sign in
//             </button>
//           </div>
//         </form>

//         <div className="mt-5">
//               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//                 Don&apos;t have an account? {""}
//                 <Link
//                   to="/create-user"
//                   className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//                 >
//                   Create User
//                 </Link>
//               </p>
//         </div>
//       </div>
//     </div>
//   );
// }

const signInSchema = z.object({
  userNameOrEmailAddress: z.string().min(3, "Invalid username or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate("/"); 
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login Error:", err.message);
      } else {
        console.error("Login Error:", String(err));
      }
    }
  };
  

  return (
    <div className="flex flex-col flex-1 justify-center items-center h-screen">
      <div className="w-full max-w-md pt-10 mx-auto">
        {/* Error Message Alert */}
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
              {...register("userNameOrEmailAddress")}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
              placeholder="admin@example.com"
            />
            {errors.userNameOrEmailAddress && (
              <p className="text-red-500 text-sm">
                {errors.userNameOrEmailAddress.message}
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
  );
}
