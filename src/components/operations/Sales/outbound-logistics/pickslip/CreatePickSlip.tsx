
// src/components/operations/Pickslip/CreatePickslipHeaderForm.tsx
// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { toast } from 'sonner';
// import { FaSave, FaSpinner } from 'react-icons/fa';
// import { addPickslipHeader } from '../../../../api/sales/pickslip';
// import Card from '../../../common/Card';
// import SubSubInput from '../../../form/input/SubInput';
// import DateTimeLocalInput from '../../../ui/DatePicker';
// import SubSelect from '../../../form/SubSelect';
// import Button from '../../../ui/button/SalesBtn';
// import { useUserAuth } from '../../../../context/AuthContext';
// import { useProductContext } from '../../../../context/ProductContext';

// interface CreatePickslipHeaderFormProps {
//   onPickslipHeaderCreated: (pickslipId: string) => void;
// }

// // Helper functions (unchanged)
// const formatDateToDateTimeLocal = (date: Date | null) => {
//   if (!date) return '';
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// const formatApiDateTime = (date: Date) => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');
//   const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
// };

// const formatApiTime = (date: Date) => {
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');
//   return `${hours}:${minutes}:${seconds}`;
// };

// // Define the allowed Product ID options for this form
// const ProductIdOptions = ['10375258Z', 'AMST_33CL'] as const;
// const UOMOptions = ['EA', 'TH'] as const;

// // Zod Schema (unchanged, as productID is already validated)
// const pickslipHeaderSchema = z.object({
//   pickslipNumber: z.preprocess(
//     (val) => Number(val),
//     z.number().int().min(1, 'Pickslip Number must be at least 1')
//   ),
//   pickslipDate: z.string().min(1, 'Pickslip Date is required').refine((val) => {
//     return !isNaN(new Date(val).getTime());
//   }, { message: 'Invalid Date format' }),
//   pickslipTime: z.string().min(1, 'Pickslip Time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid Time format (HH:MM:SS)'),
//   shipmentNumber: z.string().min(1, 'Shipment Number is required'),
//   loadNumber: z.string().min(1, 'Load Number is required'),
//   orderNumber: z.string().min(1, 'Order Number is required'),
//   carrier: z.string().min(1, 'Carrier is required'),
//   vehicleRegNo: z.string().min(1, 'Vehicle Reg. No. is required'),
//   specialDeliveryInstructions: z.string().optional(),
//   promisedDeliveryDate: z.string().min(1, 'Promised Delivery Date is required').refine((val) => {
//     return !isNaN(new Date(val).getTime());
//   }, { message: 'Invalid Date format' }),
//   location: z.string().min(1, 'Location is required'),
//   pickedFromLocation: z.string().optional(),
//   lotNumber: z.string().optional(),
//   pickedLotNumber: z.string().optional(),
//   quantity: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0.01, 'Quantity must be greater than 0')
//   ),
//   uom: z.enum(UOMOptions, {
//     required_error: 'UOM is required',
//     invalid_type_error: 'Invalid UOM selected',
//   }).default('TH'),
//   quantityPerPallet: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Quantity Per Pallet cannot be negative')
//   ).default(8.169),
//   pickQuantityPerPack: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Pick Quantity Per Pack cannot be negative')
//   ).optional().default(0),
//   numberOfPacks: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Number of Packs cannot be negative')
//   ).default(22),
//   numberOfPacksPicked: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Number of Packs Picked cannot be negative')
//   ).optional().default(0),
//   totalQuantityPicked: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Total Quantity Picked cannot be negative')
//   ).optional().default(0),
//   productID: z.enum(ProductIdOptions, {
//     required_error: 'Product ID is required',
//     invalid_type_error: 'Please select a valid Product ID',
//   }),
//   productDescription: z.string().min(1, 'Product Description is required'),
// });

// type PickslipHeaderFormInputs = z.infer<typeof pickslipHeaderSchema>;

// const CreatePickslipHeaderForm: React.FC<CreatePickslipHeaderFormProps> = ({ onPickslipHeaderCreated }) => {
//   const { token } = useUserAuth();
//   const { setSelectedProductId } = useProductContext(); // <-- Use the product context
//   const [nextPickslipNumber, setNextPickslipNumber] = useState(1);

//   const authHeader: { Authorization: string } = {
//     Authorization: token ? `Bearer ${token}` : '',
//   };

//   const {
//     handleSubmit,
//     control,
//     register,
//     formState: { errors, isSubmitting },
//     reset,
//     watch,
//     setValue,
//   } = useForm<PickslipHeaderFormInputs>({
//     resolver: zodResolver(pickslipHeaderSchema),
//     defaultValues: {
//       pickslipNumber: nextPickslipNumber,
//       pickslipDate: formatDateToDateTimeLocal(new Date()),
//       pickslipTime: formatApiTime(new Date()),
//       shipmentNumber: '',
//       loadNumber: '',
//       orderNumber: '',
//       carrier: '',
//       vehicleRegNo: '',
//       specialDeliveryInstructions: '',
//       promisedDeliveryDate: formatDateToDateTimeLocal(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
//       location: '',
//       pickedFromLocation: '',
//       lotNumber: '',
//       pickedLotNumber: '',
//       uom: 'TH',
//       quantityPerPallet: 8.169,
//       numberOfPacks: 22,
//       pickQuantityPerPack: 0,
//       numberOfPacksPicked: 0,
//       totalQuantityPicked: 0,
//       productID: ProductIdOptions[0],
//       productDescription: '',
//       quantity: 22 * 8.169,
//     },
//   });

//   const numberOfPacks = watch('numberOfPacks');
//   const quantityPerPallet = watch('quantityPerPallet');

//   useEffect(() => {
//     const calculatedQuantity = (numberOfPacks || 0) * (quantityPerPallet || 0);
//     setValue('quantity', parseFloat(calculatedQuantity.toFixed(3)));
//   }, [numberOfPacks, quantityPerPallet, setValue]);

//   useEffect(() => {
//     setValue('pickslipNumber', nextPickslipNumber);
//   }, [nextPickslipNumber, setValue]);


//   const onSubmit: SubmitHandler<PickslipHeaderFormInputs> = async (data) => {
//     console.log('Pickslip Header Form Data before submission:', data);

//     if (!token) {
//       toast.error('Authentication token is missing. Please log in again.');
//       return;
//     }

//     try {
//       const pickslipDateFormatted = new Date(data.pickslipDate).toISOString();
//       const promisedDeliveryDateFormatted = new Date(data.promisedDeliveryDate).toISOString();

//       const payload = [{
//         pickslipNumber: data.pickslipNumber,
//         pickslipDate: pickslipDateFormatted,
//         pickslipTime: data.pickslipTime,
//         shipmentNumber: data.shipmentNumber,
//         loadNumber: data.loadNumber,
//         orderNumber: data.orderNumber,
//         carrier: data.carrier,
//         vehicleRegNo: data.vehicleRegNo,
//         specialDeliveryInstructions: data.specialDeliveryInstructions || 'NULL',
//         promisedDeliveryDate: promisedDeliveryDateFormatted,
//         location: data.location,
//         pickedFromLocation: data.pickedFromLocation || '',
//         lotNumber: data.lotNumber || '',
//         pickedLotNumber: data.pickedLotNumber || '',
//         quantity: data.quantity,
//         uom: data.uom,
//         quantityPerPallet: data.quantityPerPallet,
//         pickQuantityPerPack: data.pickQuantityPerPack || 0,
//         numberOfPacks: data.numberOfPacks,
//         numberOfPacksPicked: data.numberOfPacksPicked || 0,
//         totalQuantityPicked: data.totalQuantityPicked || 0,
//         productID: data.productID,
//         productDescription: data.productDescription,
//       }];

//       console.log('Pickslip Header API Payload being sent:', payload);

//       const response = await addPickslipHeader(payload, authHeader);

//       if (response && response[0]?.isSuccess) {
//         toast.success(response[0].message || 'Pickslip header created successfully!', { duration: 3000 });
//         setNextPickslipNumber((prev) => prev + 1);
        
//         // --- Store the selected productID globally ---
//         setSelectedProductId(data.productID); // <-- Save the selected product ID
//         // --- End global storage ---

//         reset({
//           pickslipNumber: nextPickslipNumber + 1,
//           pickslipDate: formatDateToDateTimeLocal(new Date()),
//           pickslipTime: formatApiTime(new Date()),
//           shipmentNumber: '',
//           loadNumber: '',
//           orderNumber: '',
//           carrier: '',
//           vehicleRegNo: '',
//           specialDeliveryInstructions: '',
//           promisedDeliveryDate: formatDateToDateTimeLocal(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
//           location: '',
//           pickedFromLocation: '',
//           lotNumber: '',
//           pickedLotNumber: '',
//           uom: 'TH',
//           quantityPerPallet: 8.169,
//           numberOfPacks: 22,
//           pickQuantityPerPack: 0,
//           numberOfPacksPicked: 0,
//           totalQuantityPicked: 0,
//           productID: ProductIdOptions[0],
//           productDescription: '',
//           quantity: 22 * 8.169,
//         });

//         onPickslipHeaderCreated(response[0].id);
//       } else {
//         const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to create pickslip header.';
//         toast.error(errorMessage, { duration: 5000 });
//       }
//     } catch (error: any) {
//       const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
//       toast.error(`Error: ${errMsg}`, { duration: 5000 });
//       console.error('Error creating pickslip header:', error);
//     }
//   };

//   const productIDSelectOptions = ProductIdOptions.map(id => ({ value: id, label: id }));
//   const uomOptions = UOMOptions.map(uom => ({ value: uom, label: uom === 'EA' ? 'Each (Ea)' : 'Thousands (Th)' }));

//   return (
//     <Card className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Create New Pickslip</h2>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <SubInput
//             label="Pickslip Number"
//             type="number"
//             step="1"
//             {...register('pickslipNumber')}
//             error={errors.pickslipNumber?.message}
//             required={true}
//           />
//           <Controller
//             name="pickslipDate"
//             control={control}
//             render={({ field }) => (
//               <DateTimeLocalInput
//                 label="Pickslip Date"
//                 type="date"
//                 {...field}
//                 error={errors.pickslipDate?.message}
//                 required={true}
//               />
//             )}
//           />
//           <Controller
//             name="pickslipTime"
//             control={control}
//             render={({ field }) => (
//               <SubInput
//                 label="Pickslip Time"
//                 type="time"
//                 step="1"
//                 {...field}
//                 error={errors.pickslipTime?.message}
//                 required={true}
//               />
//             )}
//           />
//           <SubInput label="Shipment Number" type="text" {...register('shipmentNumber')} error={errors.shipmentNumber?.message} required={true} />
//           <SubInput label="Load Number" type="text" {...register('loadNumber')} error={errors.loadNumber?.message} required={true} />
//           <SubInput label="Order Number" type="text" {...register('orderNumber')} error={errors.orderNumber?.message} required={true} />
//           <SubInput label="Carrier" type="text" {...register('carrier')} error={errors.carrier?.message} required={true} />
//           <SubInput label="Vehicle Reg. No." type="text" {...register('vehicleRegNo')} error={errors.vehicleRegNo?.message} required={true} />
//           <SubInput label="Special Delivery Instructions" type="text" {...register('specialDeliveryInstructions')} error={errors.specialDeliveryInstructions?.message} required={false} />
          
//           <Controller
//             name="promisedDeliveryDate"
//             control={control}
//             render={({ field }) => (
//               <DateTimeLocalInput
//                 label="Promised Delivery Date"
//                 {...field}
//                 error={errors.promisedDeliveryDate?.message}
//                 required={true}
//               />
//             )}
//           />
//           <SubInput label="Location" type="text" {...register('location')} error={errors.location?.message} required={true} />
//           <SubInput label="Picked From Location" type="text" {...register('pickedFromLocation')} error={errors.pickedFromLocation?.message} required={false} />
//           <SubInput label="Lot Number" type="text" {...register('lotNumber')} error={errors.lotNumber?.message} required={false} />
//           <SubInput label="Picked Lot Number" type="text" {...register('pickedLotNumber')} error={errors.pickedLotNumber?.message} required={false} />
          
//           <SubInput
//             label="Quantity"
//             type="number"
//             step="0.001"
//             {...register('quantity')}
//             error={errors.quantity?.message}
//             readOnly
//             className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
//             required={true}
//           />
//           <SubSelect label="UOM" options={uomOptions} {...register('uom')} error={errors.uom?.message} required={true} />
//           <SubInput
//             label="Quantity Per Pallet"
//             type="number"
//             step="0.001"
//             {...register('quantityPerPallet')}
//             error={errors.quantityPerPallet?.message}
//             required={true}
//           />
//           <SubInput label="Pick Quantity Per Pack" type="number" step="0.001" {...register('pickQuantityPerPack')} error={errors.pickQuantityPerPack?.message} required={false} />
//           <SubInput label="Number of Packs" type="number" step="1" {...register('numberOfPacks')} error={errors.numberOfPacks?.message} required={true} />
//           <SubInput label="Number of Packs Picked" type="number" step="1" {...register('numberOfPacksPicked')} error={errors.numberOfPacksPicked?.message} required={false} />
//           <SubInput label="Total Quantity Picked" type="number" step="0.01" {...register('totalQuantityPicked')} error={errors.totalQuantityPicked?.message} required={false} />
//           <SubSelect label="Product ID" options={productIDSelectOptions} {...register('productID')} error={errors.productID?.message} required={true} />
//           <SubInput label="Product Description" type="text" {...register('productDescription')} error={errors.productDescription?.message} required={true} />
//         </div>

//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full mt-8 py-3 text-xl"
//           icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
//         >
//           {isSubmitting ? 'Creating Pickslip...' : 'Create Pickslip'}
//         </Button>
//       </form>
//     </Card>
//   );
// };

// export default CreatePickslipHeaderForm;

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { addPickslipHeader } from '../../../../../api/sales/pickslip';
import Card from '../../../../common/Card';
import SubInput from '../../../../form/input/SubInput';
import DateTimeLocalInput from '../../../../ui/DatePicker';
import SubSelect from '../../../../form/SubSelect';
import Button from '../../../../ui/button/SalesBtn';
import { useUserAuth } from '../../../../../context/auth/AuthContext';
import { useProductContext } from '../../../../../context/production/ProductContext';
import { usePickslipContext } from '../../../../../context/sales/PickSlipContext';


interface CreatePickslipHeaderFormProps {
  onPickslipHeaderCreated: (pickslipId: string) => void;
}

// Helper functions (unchanged)
const formatDateToDateTimeLocal = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// const formatApiDateTime = (date: Date) => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');
//   const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
// };

const formatApiTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Define the allowed Product ID options for this form
const ProductIdOptions = ['10375258Z', 'AMST_33CL'] as const;
const UOMOptions = ['EA', 'TH'] as const;

// Zod Schema (unchanged)
const pickslipHeaderSchema = z.object({
  pickslipDate: z.string().min(1, 'Pickslip Date is required').refine((val) => {
    return !isNaN(new Date(val).getTime());
  }, { message: 'Invalid Date format' }),
  pickslipTime: z.string().min(1, 'Pickslip Time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid Time format (HH:MM:SS)'),
  shipmentNumber: z.string().min(1, 'Shipment Number is required'),
  loadNumber: z.string().min(1, 'Load Number is required'),
  orderNumber: z.string().min(1, 'Order Number is required'),
  carrier: z.string().min(1, 'Carrier is required'),
  vehicleRegNo: z.string().min(1, 'Vehicle Reg. No. is required'),
  specialDeliveryInstructions: z.string().optional(),
  promisedDeliveryDate: z.string().min(1, 'Promised Delivery Date is required').refine((val) => {
    return !isNaN(new Date(val).getTime());
  }, { message: 'Invalid Date format' }),
  location: z.string().min(1, 'Location is required'),
  pickedFromLocation: z.string().optional(),
  lotNumber: z.string().optional(),
  pickedLotNumber: z.string().optional(),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, 'Quantity must be greater than 0')
  ),
  uom: z.enum(UOMOptions, {
    required_error: 'UOM is required',
    invalid_type_error: 'Invalid UOM selected',
  }).default('TH'),
  quantityPerPallet: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Quantity Per Pallet cannot be negative')
  ).default(8.169),
  pickQuantityPerPack: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Pick Quantity Per Pack cannot be negative')
  ).optional().default(0),
  numberOfPacks: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Number of Packs cannot be negative')
  ).default(22),
  numberOfPacksPicked: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Number of Packs Picked cannot be negative')
  ).optional().default(0),
  totalQuantityPicked: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Total Quantity Picked cannot be negative')
  ).optional().default(0),
  productID: z.enum(ProductIdOptions, {
    required_error: 'Product ID is required',
    invalid_type_error: 'Please select a valid Product ID',
  }),
  productDescription: z.string().min(1, 'Product Description is required'),
});

type PickslipHeaderFormInputs = z.infer<typeof pickslipHeaderSchema>;

const CreatePickslipHeaderForm: React.FC<CreatePickslipHeaderFormProps> = ({ onPickslipHeaderCreated }) => {
  const { token } = useUserAuth();
  const { setSelectedProductId, setNumberOfPacks } = useProductContext(); // <-- Destructure setNumberOfPacks
  const { setSelectedPickslipId } = usePickslipContext();

  const authHeader: { Authorization: string } = {
    Authorization: token ? `Bearer ${token}` : '',
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PickslipHeaderFormInputs>({
    resolver: zodResolver(pickslipHeaderSchema),
    defaultValues: {
      pickslipDate: formatDateToDateTimeLocal(new Date()),
      pickslipTime: formatApiTime(new Date()),
      shipmentNumber: '',
      loadNumber: '',
      orderNumber: '',
      carrier: '',
      vehicleRegNo: '',
      specialDeliveryInstructions: '',
      promisedDeliveryDate: formatDateToDateTimeLocal(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      location: '',
      pickedFromLocation: '',
      lotNumber: '',
      pickedLotNumber: '',
      uom: 'TH',
      quantityPerPallet: 8.169,
      numberOfPacks: 22,
      pickQuantityPerPack: 0,
      numberOfPacksPicked: 0,
      totalQuantityPicked: 0,
      productID: ProductIdOptions[0],
      productDescription: '',
      quantity: 22 * 8.169,
    },
  });

  const numberOfPacksWatch = watch('numberOfPacks'); // Renamed to avoid conflict with context variable
  const quantityPerPallet = watch('quantityPerPallet');

  useEffect(() => {
    const calculatedQuantity = (numberOfPacksWatch || 0) * (quantityPerPallet || 0);
    setValue('quantity', parseFloat(calculatedQuantity.toFixed(3)));
  }, [numberOfPacksWatch, quantityPerPallet, setValue]);

  const onSubmit: SubmitHandler<PickslipHeaderFormInputs> = async (data) => {
    console.log('Pickslip Header Form Data before submission:', data);

    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const pickslipDateFormatted = new Date(data.pickslipDate).toISOString();
      const promisedDeliveryDateFormatted = new Date(data.promisedDeliveryDate).toISOString();

      const payload = [{
        pickslipDate: pickslipDateFormatted,
        pickslipTime: data.pickslipTime,
        shipmentNumber: data.shipmentNumber,
        loadNumber: data.loadNumber,
        orderNumber: data.orderNumber,
        carrier: data.carrier,
        vehicleRegNo: data.vehicleRegNo,
        specialDeliveryInstructions: data.specialDeliveryInstructions || 'NULL',
        promisedDeliveryDate: promisedDeliveryDateFormatted,
        location: data.location,
        pickedFromLocation: data.pickedFromLocation || '',
        lotNumber: data.lotNumber || '',
        pickedLotNumber: data.pickedLotNumber || '',
        quantity: data.quantity,
        uom: data.uom,
        quantityPerPallet: data.quantityPerPallet,
        pickQuantityPerPack: data.pickQuantityPerPack || 0,
        numberOfPacks: data.numberOfPacks,
        numberOfPacksPicked: data.numberOfPacksPicked || 0,
        totalQuantityPicked: data.totalQuantityPicked || 0,
        productID: data.productID,
        productDescription: data.productDescription,
      }];

      console.log('Pickslip Header API Payload being sent:', payload);

      const response = await addPickslipHeader(payload, authHeader);

      if (response && response[0]?.isSuccess) {
        toast.success(response[0].message || 'Pickslip header created successfully!', { duration: 3000 });
        
        // Store the selected productID globally
        setSelectedProductId(data.productID);
        // Store the pickslip ID from the response globally
        setSelectedPickslipId(response[0].id);
        // Store the numberOfPacks globally
        setNumberOfPacks(data.numberOfPacks); // <-- Store numberOfPacks here
        
        reset({
          pickslipDate: formatDateToDateTimeLocal(new Date()),
          pickslipTime: formatApiTime(new Date()),
          shipmentNumber: '',
          loadNumber: '',
          orderNumber: '',
          carrier: '',
          vehicleRegNo: '',
          specialDeliveryInstructions: '',
          promisedDeliveryDate: formatDateToDateTimeLocal(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
          location: '',
          pickedFromLocation: '',
          lotNumber: '',
          pickedLotNumber: '',
          uom: 'TH',
          quantityPerPallet: 8.169,
          numberOfPacks: 22,
          pickQuantityPerPack: 0,
          numberOfPacksPicked: 0,
          totalQuantityPicked: 0,
          productID: ProductIdOptions[0],
          productDescription: '',
          quantity: 22 * 8.169,
        });

        onPickslipHeaderCreated(response[0].id);
      } else {
        const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to create pickslip header.';
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Error: ${errMsg}`, { duration: 5000 });
      console.error('Error creating pickslip header:', error);
    }
  };

  const productIDSelectOptions = ProductIdOptions.map(id => ({ value: id, label: id }));
  const uomOptions = UOMOptions.map(uom => ({ value: uom, label: uom === 'EA' ? 'Each (Ea)' : 'Thousands (Th)' }));

  return (
    <Card className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Create New Pickslip</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Controller
            name="pickslipDate"
            control={control}
            render={({ field }) => (
              <DateTimeLocalInput
                label="Pickslip Date"
                type="date"
                {...field}
                error={errors.pickslipDate?.message}
                required={true}
              />
            )}
          />
          <Controller
            name="pickslipTime"
            control={control}
            render={({ field }) => (
              <SubInput
                label="Pickslip Time"
                type="time"
                step="1"
                {...field}
                error={errors.pickslipTime?.message}
                required={true}
              />
            )}
          />
          <SubInput label="Shipment Number" type="text" {...register('shipmentNumber')} error={errors.shipmentNumber?.message} required={true} />
          <SubInput label="Load Number" type="text" {...register('loadNumber')} error={errors.loadNumber?.message} required={true} />
          <SubInput label="Order Number" type="text" {...register('orderNumber')} error={errors.orderNumber?.message} required={true} />
          <SubInput label="Carrier" type="text" {...register('carrier')} error={errors.carrier?.message} required={true} />
          <SubInput label="Vehicle Reg. No." type="text" {...register('vehicleRegNo')} error={errors.vehicleRegNo?.message} required={true} />
          <SubInput label="Special Delivery Instructions" type="text" {...register('specialDeliveryInstructions')} error={errors.specialDeliveryInstructions?.message} required={false} />
          
          <Controller
            name="promisedDeliveryDate"
            control={control}
            render={({ field }) => (
              <DateTimeLocalInput
                label="Promised Delivery Date"
                {...field}
                error={errors.promisedDeliveryDate?.message}
                required={true}
              />
            )}
          />
          <SubInput label="Location" type="text" {...register('location')} error={errors.location?.message} required={true} />
          <SubInput label="Picked From Location" type="text" {...register('pickedFromLocation')} error={errors.pickedFromLocation?.message} required={false} />
          <SubInput label="Lot Number" type="text" {...register('lotNumber')} error={errors.lotNumber?.message} required={false} />
          <SubInput label="Picked Lot Number" type="text" {...register('pickedLotNumber')} error={errors.pickedLotNumber?.message} required={false} />
          
          <SubInput
            label="Quantity"
            type="number"
            step="0.001"
            {...register('quantity')}
            error={errors.quantity?.message}
            readOnly
            className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            required={true}
          />
          <SubSelect label="UOM" options={uomOptions} {...register('uom')} error={errors.uom?.message} required={true} />
          <SubInput
            label="Quantity Per Pallet"
            type="number"
            step="0.001"
            {...register('quantityPerPallet')}
            error={errors.quantityPerPallet?.message}
            required={true}
          />
          <SubInput label="Pick Quantity Per Pack" type="number" step="0.001" {...register('pickQuantityPerPack')} error={errors.pickQuantityPerPack?.message} required={false} />
          <SubInput label="Number of Packs" type="number" step="1" {...register('numberOfPacks')} error={errors.numberOfPacks?.message} required={true} />
          <SubInput label="Number of Packs Picked" type="number" step="1" {...register('numberOfPacksPicked')} error={errors.numberOfPacksPicked?.message} required={false} />
          <SubInput label="Total Quantity Picked" type="number" step="0.01" {...register('totalQuantityPicked')} error={errors.totalQuantityPicked?.message} required={false} />
          <SubSelect label="Product ID" options={productIDSelectOptions} {...register('productID')} error={errors.productID?.message} required={true} />
          <SubInput label="Product Description" type="text" {...register('productDescription')} error={errors.productDescription?.message} required={true} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 py-3 text-xl"
          icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
        >
          {isSubmitting ? 'Creating Pickslip...' : 'Create Pickslip'}
        </Button>
      </form>
    </Card>
  );
};

export default CreatePickslipHeaderForm;