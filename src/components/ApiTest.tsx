// import { useMutation, useQuery } from "@tanstack/react-query";
// import { fetchDataWithCache, createData, updateData, deleteData } from "../services/axiosService";
// import { queryClient } from "../utils/reactQueryClient"; 
// import { useState } from "react";
// import QRCode from "qrcode";

// interface User {
//   id: string;
//   name: string;
// }

// const ApiTest = () => {
//     const [username, setUsername] = useState<string>('')
//     const [src, setSrc] = useState<string>('')

//     const generate = () => {
//         QRCode.toDataURL(`https://github.com/${username}`).then(setSrc);
//     }

//   // ✅ Fetch Users (Auto-refetch every 5s)
//   const { data: users = [], isLoading } = useQuery<User[]>({
//     queryKey: ["users"],
//     queryFn: () => fetchDataWithCache("users"),
//     staleTime: 5000,
//     refetchOnWindowFocus: true,
//   });

//   // ✅ Create User
//   const createUserMutation = useMutation({
//     mutationFn: (newUser: Partial<User>) => createData("users", newUser),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });

//   // ✅ Update User
//   const updateUserMutation = useMutation({
//     mutationFn: ({ id, updatedUser }: { id: string; updatedUser: Partial<User> }) =>
//       updateData("users", id, updatedUser),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });

//   // ✅ Delete User
//   const deleteUserMutation = useMutation({
//     mutationFn: (id: string) => deleteData("users", id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });

//   if (isLoading) return <p>Loading...</p>;


//   return (
//     <>
//     <div className="flex items-center justify-center space-x-2">
//       <h2>Users</h2>
//       <ul>
//         {users.map((user: User) => (
//           <li key={user.id}>
//             {user.name}
//             <button
//               onClick={() => updateUserMutation.mutate({ id: user.id, updatedUser: { name: "Updated Name" } })}
//             >
//               Update
//             </button>
//             <button onClick={() => deleteUserMutation.mutate(user.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <button onClick={() => createUserMutation.mutate({ name: "New User" })}>Add User</button>
//     </div>
//     <div className="flex items-center justify-center space-x-2">
//     <img src={src} alt="" />
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Enter text..."
//         className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={generate}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//       >
//         Submit
//       </button>

//       <video id="player" autoPlay></video>
//       <canvas id="canvas" width="320px" height="240px"></canvas>
//       <button>Capture</button>

//       <div id="pick-image">
//         <h6>Pick an image instead</h6>
//         <input type="text" accept="image/*" id="image-picker" />
//       </div>

//       <div>
//         <input type="text" id="location" />
//         <label htmlFor="location">Location</label> 
//         </div>
//     </div>
//     </>
//   );
// };

// export default ApiTest;



import React, { useState } from 'react';

interface LoginFormPayload {
  userNameEmail: string;
  password: string;
}

interface AuthResponse {
  status: string;
  message: string;
  // Add other relevant properties from your API response (e.g., token, user details)
  data?: {
    token?: string;
    // other user data
  };
}

const BASE_URL = 'http://35.177.236.20:3006';
const LOGIN_ENDPOINT = `${BASE_URL}/api/v1/auth/signin`;

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormPayload>({
    userNameEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: AuthResponse = await response.json();

      if (response.ok) {
        // Best Practice: Store the token securely (e.g., in HttpOnly cookie or localStorage with careful consideration)
        // For this simple example, we'll just log it.
        if (data.data?.token) {
          console.log('Login successful. Token:', data.data.token);
          // Consider redirecting the user to a protected area here
        } else {
          console.log('Login successful.', data.message);
          // Handle successful login without a token if that's your API's behavior
        }
        // Optionally reset the form
        setFormData({ userNameEmail: '', password: '' });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="userNameEmail"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="userNameEmail"
              name="userNameEmail"
              value={formData.userNameEmail}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
            {/* Consider adding a "Forgot Password?" link here */}
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Sign In'}
            </button>
            {/* Consider adding a "Register" link here */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
