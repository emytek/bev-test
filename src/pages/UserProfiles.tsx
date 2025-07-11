// import PageBreadcrumb from "../components/common/PageBreadCrumb";

// import UserInfoCard from "../components/UserProfile/UserInfoCard";
// //import UserAddressCard from "../components/UserProfile/UserAddressCard";
// import PageMeta from "../components/common/PageMeta";
// import UserMetaCard from "../components/UserProfile/UserMetaCard";
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { User } from "../types/authTypes";

// export default function UserProfiles() {
//   const [isMetaCardOpen, setIsMetaCardOpen] = useState(false);
//   const { user: authUser, login: reLoginUser } = useAuth();
//   const [localUser, setLocalUser] = useState<User | null>(authUser); // Local state for user data

//   const handleUserUpdated = (updatedUser: User) => {
//     setLocalUser(updatedUser); // Update the local user state
//     // Optionally, you might want to update the authUser context as well
//     // if the changes need to be reflected globally immediately.
//     // reLoginUser({ token: authUser?.token || '', user: updatedUser });
//   };

//   return (
//     <>
//       <PageMeta
//         title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
//         description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Profile" />
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
//         <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
//           Profile
//         </h3>
//         <div className="space-y-6">
//           {localUser && (
//             <UserMetaCard
//               isOpen={isMetaCardOpen}
//               setIsOpen={setIsMetaCardOpen}
//               user={localUser}
//               onUserUpdated={handleUserUpdated}
//             />
//           )}
//           <UserInfoCard user={localUser}/>
//           {/* <UserAddressCard /> */}
//         </div>
//       </div>
//     </>
//   );
// }


import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
//import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import { useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { User } from "../types/authTypes";

export default function UserProfiles() {
  const [isMetaCardOpen, setIsMetaCardOpen] = useState(false);
  const { user: authUser, updateUser } = useUserAuth(); // Get the updateUser function
  const [localUser, setLocalUser] = useState<User | null>(authUser); // Local state for user data

  const handleUserUpdated = (updatedUser: User) => {
    setLocalUser(updatedUser); // Update the local user state for immediate UI feedback
    updateUser(updatedUser); // Update the global user state in the AuthContext
    // You might also want to persist this updated user data to your backend here
    // and potentially update it in local storage/session storage if needed.
  };

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {localUser && (
            <UserMetaCard
              isOpen={isMetaCardOpen}
              setIsOpen={setIsMetaCardOpen}
              user={localUser}
              onUserUpdated={handleUserUpdated}
            />
          )}
          <UserInfoCard user={localUser} onUserUpdated={handleUserUpdated} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
