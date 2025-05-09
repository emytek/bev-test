import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
// import axiosInstance from "../../../api/axiosInstance";
import { toast } from "sonner";
import { NewModal } from "../ui/modal/ConfirmationModal";
import EditUserForm from "./EditUser";
import axiosInstance from "../../api/axiosInstance";
import { Loader } from "../ui/loader/Loader";
// import NewModal from "../../ui/modal/NewModal";
// import EditUserForm from "./EditUserForm"; // Create this component

interface UserFromServer {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  company: string;
  fullName: string;
  isSuspended: boolean;
  restrictToState: boolean;
  transactionState: string;
}

interface ApiResponse {
  status: boolean;
  data?: UserFromServer[];
  message?: string;
}

export default function UserList() {
  const [userList, setUserList] = useState<UserFromServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFromServer | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ApiResponse>("/api/v1/user/get-users");
      if (response.data?.status && response.data?.data) {
        setUserList(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch users.");
        toast.error(response.data?.message || "Failed to fetch users.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserFromServer) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = (updatedUser: UserFromServer) => {
    setUserList((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    toast.success("User updated successfully!");
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="text-center py-8"><Loader /></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-500">User Management</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">First Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Last Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">User Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Phone Number</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Company</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Suspended</TableCell>
                <TableCell isHeader className="px-5 py-3 text-left text-gray-500">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.firstName}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.lastName}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.userName}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.email}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.userRole}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.phoneNumber}</TableCell>
                  <TableCell className="px-5 py-4 text-left text-gray-500">{user.company}</TableCell>
                  <TableCell className="px-5 py-4 text-left">
                    <Badge size="sm" color={user.isSuspended ? "warning" : "success"}>
                      {user.isSuspended ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleEdit(user)}>
                      <FiEdit /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewModal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        {selectedUser && (
          <EditUserForm user={selectedUser} onUserUpdated={handleUserUpdated} onClose={handleCloseEditModal} />
        )}
      </NewModal>
    </div>
  );
}