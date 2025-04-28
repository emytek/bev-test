// import { useState } from "react";
// import { Link } from "react-router";
// import { Controller, useForm } from "react-hook-form";
// import { EyeIcon, EyeCloseIcon, ChevronLeftIcon } from "../../../icons";
// import Label from "../../form/Label";
// import Input from "../../form/input/InputField";
// import Toggle from "../../ui/toggle/Toggle";
// import Button from "../../ui/button/Button";
// import Select from "../../form/Select";

// interface UserFormData {
//   email: string;
//   password: string;
//   role: "admin" | "manager" | "user";
//   isActive: boolean;
// }

// interface FormData {
//   email: string;
//   password: string;
//   role: string;
//   isActive: boolean;
// }

// const CreateUser = () => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>();

//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmit = (data: FormData) => {
//     console.log("Form Data:", data);
//   };

//   return (
//     <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 mx-auto no-scrollbar">
//       {/* Back to Dashboard */}
//       <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
//         <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
//           <ChevronLeftIcon className="size-5" /> Back to dashboard
//         </Link>
//       </div>

//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div className="mb-5 sm:mb-8">
//           <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
//             Create User
//           </h1>
//           <p className="text-sm text-gray-500">Fill in the details to create a new user.</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-5">
//             {/* Email Field */}
//             <div>
//               <Label>Email <span className="text-error-500">*</span></Label>
//               <Input
//                 type="email"
//                 placeholder="admin@example.com"
//                 {...register("email", { required: "Email is required" })}
//               />
//               {errors.email && <p className="text-error-500 text-sm">{errors.email.message}</p>}
//             </div>

//             {/* Password Field */}
//             <div>
//               <Label>Password <span className="text-error-500">*</span></Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter password"
//                   {...register("password", { required: "Password is required" })}
//                 />
//                 <span
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
//                 >
//                   {showPassword ? <EyeIcon className="size-5 fill-gray-500" /> : <EyeCloseIcon className="size-5 fill-gray-500" />}
//                 </span>
//               </div>
//               {errors.password && <p className="text-error-500 text-sm">{errors.password.message}</p>}
//             </div>

//             {/* Role Selection */}
//             <div>
//               <Label>Role <span className="text-error-500">*</span></Label>
//               <Controller
//                 name="role"
//                 control={control}
//                 rules={{ required: "Role is required" }}
//                 render={({ field }) => (
//                   <Select
//                     options={[
//                       { value: "admin", label: "Admin" },
//                       { value: "manager", label: "Manager" },
//                       { value: "user", label: "User" },
//                     ]}
//                     placeholder="Select a role"
//                     onChange={(value) => field.onChange(value)}
//                     defaultValue={field.value}
//                   />
//                 )}
//               />
//               {errors.role && <p className="text-error-500 text-sm">{errors.role.message}</p>}
//             </div>

//             {/* Status Toggle */}
//             <div>
//               <Label>Active Status</Label>
//               <Controller
//                 name="isActive"
//                 control={control}
//                 render={({ field }) => (
//                   <Toggle checked={field.value} onChange={(checked) => field.onChange(checked)} />
//                 )}
//               />
//             </div>

//             {/* Submit Button */}
//             <div>
//               <Button className="w-full bg-gray-900 hover:bg-error-500 text-white transition" type="submit">
//                 Create User
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateUser;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import axiosInstance from "../../../api/axiosInstance";
import { useForm } from "react-hook-form";
// import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import { Loader } from "../../ui/loader/Loader";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

interface RegisterFormData {
  userName: string;
  emailAddress: string;
  password: string;
}

const RegisterUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    mode: "onSubmit",
    defaultValues: {
      userName: "",
      emailAddress: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      // setSuccessMessage(null);
      toast.loading("Creating account...");

      await axiosInstance.post("/api/account/register", {
        ...data,
        appName: "wyze-addon",
      });      

      // setSuccessMessage("User registered successfully!");
      toast.success("User registered successfully!");
      reset(); // Clear the form after successful submission

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      setError(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-3 left-6">
        <img src="/images/logo/wyze.png" alt="Company Logo" className="w-16 h-auto" />
      </div>
      <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-5 ">
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
      <div className="mb-5 sm:mb-8">
           <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
             Register User
           </h1>
           <p className="text-sm text-gray-500">Fill in the details to create a new user.</p>
       </div>
        <div className="mt-6">
          <Label>Username <span className="text-error-500">*</span></Label>
          <Input
            {...register("userName", { required: "Username is required" })}
            placeholder="Enter username"
            error={!!errors.userName}
            hint={errors.userName?.message}
          />
        </div>

        <div>
          <Label>Email <span className="text-error-500">*</span></Label>
          <Input
            type="email"
            {...register("emailAddress", { required: "Email is required" })}
            placeholder="admin@example.com"
            error={!!errors.emailAddress}
            hint={errors.emailAddress?.message}
          />
        </div>

        <div>
          <Label>Password <span className="text-error-500">*</span></Label>
          <Input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter password"
            error={!!errors.password}
            hint={errors.password?.message}
          />
        </div>

        <div>
          <Button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-error-500 text-white transition py-2 rounded-lg flex justify-center items-center gap-2">
            {loading && <Loader />} {loading ? "Creating User..." : "Create Account"}
          </Button>
        </div>
      </form>
      </div>
      {/* {successMessage && (
        <Modal
          isOpen={!!successMessage}
          title="Success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )} */}
      <Toaster richColors />
    </>
  );
};

export default RegisterUser;


