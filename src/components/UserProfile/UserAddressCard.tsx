// // import { useModal } from "../../hooks/useModal";
// // import { Modal } from "../ui/modal";
// // import Button from "../ui/button/Button";
// // import Input from "../form/input/InputField";
// // import Label from "../form/Label";
// // import { useAuth } from "../../hooks/useAuth";

// // export default function UserAddressCard() {
// //   const { isOpen, openModal, closeModal } = useModal();
// //    const { user } = useAuth();

// //   const handleSave = () => {
// //     // Handle save logic here
// //     console.log("Saving changes...");
// //     closeModal();
// //   };
// //   return (
// //     <>
// //       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
// //         <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
// //           <div>
// //             <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
// //               Address
// //             </h4>

// //             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
// //               <div>
// //                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
// //                   Country
// //                 </p>
// //                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
// //                   Nigeria
// //                 </p>
// //               </div>

// //               <div>
// //                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
// //                   City/State
// //                 </p>
// //                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
// //                   Lagos, Nigeria
// //                 </p>
// //               </div>

// //               <div>
// //                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
// //                   Postal Code
// //                 </p>
// //                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
// //                   ERT 2489
// //                 </p>
// //               </div>

// //               <div>
// //                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
// //                   TAX ID
// //                 </p>
// //                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
// //                   AS4568384
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <button
// //             onClick={openModal}
// //             className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
// //           >
// //             <svg
// //               className="fill-current"
// //               width="18"
// //               height="18"
// //               viewBox="0 0 18 18"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 fillRule="evenodd"
// //                 clipRule="evenodd"
// //                 d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
// //                 fill=""
// //               />
// //             </svg>
// //             Edit
// //           </button>
// //         </div>
// //       </div>
// //       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
// //         <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
// //           <div className="px-2 pr-14">
// //             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
// //               Edit Address
// //             </h4>
// //             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
// //               Update your details to keep your profile up-to-date.
// //             </p>
// //           </div>
// //           <form className="flex flex-col">
// //             <div className="px-2 overflow-y-auto custom-scrollbar">
// //               <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
// //                 <div>
// //                   <Label>Country</Label>
// //                   <Input type="text" value="United States" />
// //                 </div>

// //                 <div>
// //                   <Label>City/State</Label>
// //                   <Input type="text" value="Arizona, United States." />
// //                 </div>

// //                 <div>
// //                   <Label>Postal Code</Label>
// //                   <Input type="text" value="ERT 2489" />
// //                 </div>

// //                 <div>
// //                   <Label>TAX ID</Label>
// //                   <Input type="text" value="AS4568384" />
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
// //               <Button size="sm" variant="outline" onClick={closeModal}>
// //                 Close
// //               </Button>
// //               <Button size="sm" onClick={handleSave}>
// //                 Save Changes
// //               </Button>
// //             </div>
// //           </form>
// //         </div>
// //       </Modal>
// //     </>
// //   );
// // }

// import React, { useState } from 'react';
// import { FiSave } from 'react-icons/fi';
// import {toast} from 'sonner';

// // import { useAuth } from '@/hooks/auth';
// // import { axiosInstance } from '@/lib/axios';
// // import { Button } from '@/components/ui/button';
// // import Input from '@/components/form/input/InputField';
// // import Label from '@/components/form/Label';
// // import { Modal } from '@/components/ui/modal';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axiosInstance from '../../api/axiosInstance';
// import { z } from 'zod';
// import { NewModal } from '../ui/modal/ConfirmationModal';
// import Label from '../form/Label';
// import Input from '../form/input/InputField';
// import Button from '../ui/button/Button';
// import { Loader } from '../ui/loader/Loader';

// // Define types for the address form
// interface EditAddressFormData {
//   country: string;
//   cityState: string;
//   postalCode: string;
//   taxId: string;
// }

// const editAddressSchema = z.object({
//   country: z.string().min(2, 'Country name must be at least 2 characters'),
//   cityState: z.string().min(2, 'City/State must be at least 2 characters'),
//   postalCode: z.string().min(2, 'Postal code is required'),
//   taxId: z.string().optional(), // Tax ID is optional
// });

// interface EditAddressFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: {
//     id?: string;
//     country?: string;
//     cityState?: string;
//     postalCode?: string;
//     taxId?: string;
//   } | null;
//   onAddressUpdated?: (updatedAddress: {
//     country: string;
//     cityState: string;
//     postalCode: string;
//     taxId?: string;
//   }) => void;
// }

// const EditAddressModal: React.FC<EditAddressFormProps> = ({
//   isOpen,
//   onClose,
//   user: modalUser,
//   onAddressUpdated,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<EditAddressFormData>({
//     resolver: zodResolver(editAddressSchema),
//     defaultValues: {
//       country: modalUser?.country || '',
//       cityState: modalUser?.cityState || '',
//       postalCode: modalUser?.postalCode || '',
//       taxId: modalUser?.taxId || '',
//     },
//     mode: 'onSubmit',
//   });

//   const onSubmit: SubmitHandler<EditAddressFormData> = async (
//     data: EditAddressFormData
//   ) => {
//     if (!modalUser?.id) {
//       toast.error('User ID is not available.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axiosInstance.post(
//         `/api/v1/user/update-address/${modalUser.id}`,
//         data
//       );

//       if (response.data?.status) {
//         toast.success('Address updated successfully!');
//         onClose();
//         onAddressUpdated?.(data); // Notify parent with updated address
//       } else {
//         setError(response.data?.message || 'Failed to update address.');
//         toast.error(response.data?.message || 'Failed to update address.');
//       }
//     } catch (error: any) {
//       setError(error.message || 'An unexpected error occurred.');
//       toast.error(error.message || 'An unexpected error occurred.');
//       console.error('Update Address Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <NewModal isOpen={isOpen} onClose={onClose}>
//       <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
//         <div className="px-2 pr-14">
//           <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
//             Edit Address
//           </h4>
//           <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
//             Update your address details.
//           </p>
//         </div>
//         <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
//           <div className="px-2 overflow-y-auto custom-scrollbar">
//             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
//               <div>
//                 <Label htmlFor="country">Country</Label>
//                 <Input
//                   type="text"
//                   id="country"
//                   {...register('country')}
//                   error={!!errors.country}
//                   hint={errors.country?.message}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="cityState">City/State</Label>
//                 <Input
//                   type="text"
//                   id="cityState"
//                   {...register('cityState')}
//                   error={!!errors.cityState}
//                   hint={errors.cityState?.message}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="postalCode">Postal Code</Label>
//                 <Input
//                   type="text"
//                   id="postalCode"
//                   {...register('postalCode')}
//                   error={!!errors.postalCode}
//                   hint={errors.postalCode?.message}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="taxId">TAX ID (Optional)</Label>
//                 <Input
//                   type="text"
//                   id="taxId"
//                   {...register('taxId')}
//                   error={!!errors.taxId}
//                   hint={errors.taxId?.message}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
//             <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
//               Close
//             </Button>
//             <Button variant="sync" size="sm" type="submit" disabled={loading}>
//               {loading ? (
//                 <Loader />
//               ) : (
//                 <span className="flex items-center gap-2">
//                   <FiSave className="text-base" />
//                   Save Changes
//                 </span>
//               )}
//             </Button>
//             {error && <p className="text-xs text-red-500">{error}</p>}
//           </div>
//         </form>
//       </div>
//     </NewModal>
//   );
// };

// interface UserAddressCardProps {
//   user: {
//     id?: string;
//     country?: string;
//     cityState?: string;
//     postalCode?: string;
//     taxId?: string;
//   } | null;
//   onAddressUpdated?: (updatedAddress: {
//     country: string;
//     cityState: string;
//     postalCode: string;
//     taxId?: string;
//   }) => void;
// }

// export default function UserAddressCard({ user: propUser, onAddressUpdated }: UserAddressCardProps) {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const handleOpenEditModal = () => {
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//   };

//   return (
//     <>
//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//           <div>
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
//               Address
//             </h4>

//             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
//               <div>
//                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
//                   Country
//                 </p>
//                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
//                   {propUser?.country || 'Nigeria'}
//                 </p>
//               </div>

//               <div>
//                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
//                   City/State
//                 </p>
//                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
//                   {propUser?.cityState || 'Lagos'}
//                 </p>
//               </div>

//               <div>
//                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
//                   Postal Code
//                 </p>
//                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
//                   {propUser?.postalCode || ''}
//                 </p>
//               </div>

//               <div>
//                 <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
//                   TAX ID
//                 </p>
//                 <p className="text-sm font-medium text-gray-800 dark:text-white/90">
//                   {propUser?.taxId || ''}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={handleOpenEditModal}
//             className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
//           >
//             <svg
//               className="fill-current"
//               width="18"
//               height="18"
//               viewBox="0 0 18 18"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
//                 fill=""
//               />
//             </svg>
//             Edit
//           </button>
//         </div>
//       </div>
//       <EditAddressModal
//         isOpen={isEditModalOpen}
//         onClose={handleCloseEditModal}
//         user={propUser}
//         onAddressUpdated={onAddressUpdated}
//       />
//     </>
//   );
// }
