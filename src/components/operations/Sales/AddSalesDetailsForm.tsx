// // src/components/sales/AddSalesDetailsForm.tsx
// import React, { useState, useEffect } from 'react';
// import { useForm, SubmitHandler, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate } from 'react-router-dom';

// import { SalesDetailResponse } from '../../../types/sales';
// import { toast } from 'sonner';
// import Input from '../../form/input/SubInput';
// import DateTimeLocalInput from '../../ui/DatePicker';
// import Select from '../../form/SubSelect';
// import Button from '../../ui/button/SalesBtn';
// import { addSalesDetails } from '../../../api/sales';
// import Card from '../../common/Card';
// import { useUserAuth } from '../../../context/AuthContext';
// import Loader from '../../ui/loader/NxtLoader';

// interface AddSalesDetailsFormProps {
//   salesOrderId: string; // The ID from the created sales header
// }

// // Helper function to format Date object to "YYYY-MM-DDTHH:mm" for datetime-local input
// const formatDateToDateTimeLocal = (date: Date | null) => {
//   if (!date) return '';
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// // Define the allowed Product ID options
// const ProductIdOptions = ['10375258Z', 'AMST_33CL'] as const;

// // Schema for sales details validation
// const salesDetailSchema = z.object({
//   productID: z.enum(ProductIdOptions, {
//     required_error: 'Product ID is required',
//     invalid_type_error: 'Please select a valid Product ID',
//   }),
//   promisedDeliveryDate: z.string().min(1, 'Promised Delivery Date is required').refine((val) => {
//     return !isNaN(new Date(val).getTime());
//   }, { message: 'Invalid Date/Time format' }),
//   location: z.string().min(1, 'Location is required'),
//   pickedFromLocation: z.string().min(1, 'Picked From Location is required'),
//   lotNumber: z.string().min(1, 'Lot Number is required'),
//   pickedLotNumber: z.string().min(1, 'Picked Lot Number is required'),
//   quantity: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0.01, 'Quantity must be greater than 0')
//   ),
//   uom: z.enum(['EA', 'TH'], {
//     required_error: 'UOM is required',
//     invalid_type_error: 'Invalid UOM selected',
//   }).default('TH'), // <-- ADDED .default('TH') HERE
//   quantityPerPack: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Quantity Per Pack cannot be negative')
//   ).default(8.169),
  
//   pickQuantityPerPack: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Pick Quantity Per Pack cannot be negative')
//   ).default(0),
  
//   numberOfPacks: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Number of Packs cannot be negative').default(22)
//   ),
//   numberOfPacksPicked: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Number of Packs Picked cannot be negative')
//   ),
//   totalQuantityPicked: z.preprocess(
//     (val) => Number(val),
//     z.number().min(0, 'Total Quantity Picked cannot be negative')
//   ),
// });

// type SalesDetailFormInputs = z.infer<typeof salesDetailSchema>;

// const AddSalesDetailsForm: React.FC<AddSalesDetailsFormProps> = ({ salesOrderId }) => {
//   const { token } = useUserAuth();
//   const navigate = useNavigate();

//   const authHeader: { Authorization: string } = {
//     Authorization: token ? `Bearer ${token}` : '',
//   };
//   const [lineNoCounter, setLineNoCounter] = useState(0);
//   const [showLoader, setShowLoader] = useState(false);

//   const {
//     handleSubmit,
//     register,
//     control,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<SalesDetailFormInputs>({
//     resolver: zodResolver(salesDetailSchema),
//     defaultValues: {
//       productID: ProductIdOptions[0],
//       numberOfPacks: 22,
//       quantityPerPack: 8.169,
//       pickQuantityPerPack: 0,
//       uom: 'TH', // <-- SET DEFAULT VALUE HERE IN useForm
//       promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
//     },
//   });

//   useEffect(() => {
//     reset({
//       productID: ProductIdOptions[0],
//       numberOfPacks: 22,
//       quantityPerPack: 8.169,
//       pickQuantityPerPack: 0,
//       uom: 'TH', // <-- RESET DEFAULT VALUE HERE
//       promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
//     });
//     setLineNoCounter(0);
//   }, [salesOrderId, reset]);

//   const onSubmit: SubmitHandler<SalesDetailFormInputs> = async (data) => {
//     console.log('Sales Detail Form Data before submission:', data);
//     console.log('Product ID:', data.productID);
//     console.log('Promised Delivery Date (raw from input):', data.promisedDeliveryDate);
//     console.log('Quantity Per Pack (from form):', data.quantityPerPack);
//     console.log('Pick Quantity Per Pack (from form):', data.pickQuantityPerPack);
//     console.log('UOM (from form):', data.uom); // Log UOM value


//     if (!token) {
//       toast.error('Authentication token is missing. Please log in again.');
//       return;
//     }

//     try {
//       setLineNoCounter((prev) => prev + 1);
//       const currentLineNo = (lineNoCounter + 1) * 10;

//       const selectedDeliveryDate = new Date(data.promisedDeliveryDate);
//       const formattedPromisedDeliveryDate = selectedDeliveryDate.toISOString();

//       const payload = [{
//         sapSalesOrderID: salesOrderId,
//         saleDetails: [{
//           lineno: String(currentLineNo).padStart(3, '0'),
//           productID: data.productID,
//           promisedDeliveryDate: formattedPromisedDeliveryDate,
//           location: data.location,
//           pickedFromLocation: data.pickedFromLocation,
//           lotNumber: data.lotNumber,
//           pickedLotNumber: data.pickedLotNumber,
//           quantity: data.quantity,
//           uom: data.uom,
//           quantityPerPallet: data.quantityPerPack,
//           pickQuantityPerPack: data.pickQuantityPerPack,
//           numberOfPacks: data.numberOfPacks,
//           numberOfPacksPicked: data.numberOfPacksPicked,
//           totalQuantityPicked: data.totalQuantityPicked,
//         }],
//       }];

//       console.log('Sales Detail API Payload being sent:', payload);

//       const response = await addSalesDetails(payload, authHeader);

//       if (response && response[0]?.isSuccess) {
//         toast.success(response[0].message || 'Sales detail added successfully!', { duration: 3000 });
//         reset({
//             productID: ProductIdOptions[0],
//             numberOfPacks: 22,
//             quantityPerPack: 8.169,
//             pickQuantityPerPack: 0,
//             uom: 'TH', // <-- RESET DEFAULT VALUE HERE
//             promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
//         });

//         setShowLoader(true);
//         setTimeout(() => {
//           setShowLoader(false);
//           navigate('/scanner');
//         }, 2000);
//       } else {
//         const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to add sales detail.';
//         toast.error(errorMessage, { duration: 5000 });
//         setLineNoCounter((prev) => prev - 1);
//       }
//     } catch (error: any) {
//       const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
//       toast.error(`Error: ${errMsg}`, { duration: 5000 });
//       console.error('Error adding sales details:', error);
//       setLineNoCounter((prev) => prev - 1);
//     }
//   };

//   const productIDSelectOptions = ProductIdOptions.map(id => ({ value: id, label: id }));

//   const uomOptions = [
//     { value: 'EA', label: 'Each (Ea)' },
//     { value: 'TH', label: 'Thousands (Th)' },
//   ];

//   return (
//     <>
//       {showLoader && <Loader message="Adding Sales Detail..." />}
//       <Card className="max-w-3xl mx-auto p-6 mt-8">
//         <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Sales Details for Order: {salesOrderId}</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Product ID"
//               options={productIDSelectOptions}
//               {...register('productID')}
//               error={errors.productID?.message}
//             />

//             <Controller
//               name="promisedDeliveryDate"
//               control={control}
//               render={({ field }) => (
//                 <DateTimeLocalInput
//                   label="Promised Delivery Date"
//                   {...field}
//                   error={errors.promisedDeliveryDate?.message}
//                 />
//               )}
//             />
//             <Input label="Location" type="text" {...register('location')} error={errors.location?.message} />
//             <Input label="Picked From Location" type="text" {...register('pickedFromLocation')} error={errors.pickedFromLocation?.message} />
//             <Input label="Lot Number" type="text" {...register('lotNumber')} error={errors.lotNumber?.message} />
//             <Input label="Picked Lot Number" type="text" {...register('pickedLotNumber')} error={errors.pickedLotNumber?.message} />
//             <Input label="Quantity" type="number" step="0.01" {...register('quantity')} error={errors.quantity?.message} />
//             <Select label="UOM" options={uomOptions} {...register('uom')} error={errors.uom?.message} />
            
//             <Input
//               label="Quantity Per Pack"
//               type="number"
//               step="0.001"
//               {...register('quantityPerPack')}
//               error={errors.quantityPerPack?.message}
//             />
            
//             <Input label="Pick Quantity Per Pack" type="number" step="0.001" {...register('pickQuantityPerPack')} error={errors.pickQuantityPerPack?.message} />
//             <Input label="Number of Packs" type="number" step="1" {...register('numberOfPacks')} error={errors.numberOfPacks?.message} />
//             <Input label="Number of Packs Picked" type="number" step="1" {...register('numberOfPacksPicked')} error={errors.numberOfPacksPicked?.message} />
//             <Input label="Total Quantity Picked" type="number" step="0.01" {...register('totalQuantityPicked')} error={errors.totalQuantityPicked?.message} />
//           </div>
//           <Button type="submit" disabled={isSubmitting || showLoader} className="w-full mt-6">
//             {isSubmitting ? 'Adding Detail...' : 'Add Sales Detail'}
//           </Button>
//         </form>
//       </Card>
//     </>
//   );
// };

// export default AddSalesDetailsForm;




// src/components/sales/AddSalesDetailsForm.tsx
// src/components/sales/AddSalesDetailsForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '../../form/input/SubInput';
import DateTimeLocalInput from '../../ui/DatePicker';
import Select from '../../form/SubSelect';
import Button from '../../ui/button/SalesBtn';
import { addSalesDetails } from '../../../api/sales/sales';
import Card from '../../common/Card';
import { useUserAuth } from '../../../context/auth/AuthContext';
import Loader from '../../ui/loader/NxtLoader';

interface AddSalesDetailsFormProps {
  salesOrderId: string; // The ID from the created sales header
}

// Helper function to format Date object to "YYYY-MM-DDTHH:mm" for datetime-local input
const formatDateToDateTimeLocal = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Define the allowed Product ID options
const ProductIdOptions = ['10375258Z', 'AMST_33CL'] as const;

// Schema for sales details validation
const salesDetailSchema = z.object({
  productID: z.enum(ProductIdOptions, {
    required_error: 'Product ID is required',
    invalid_type_error: 'Please select a valid Product ID',
  }),
  promisedDeliveryDate: z.string().min(1, 'Promised Delivery Date is required').refine((val) => {
    return !isNaN(new Date(val).getTime());
  }, { message: 'Invalid Date/Time format' }),
  
  location: z.string().optional(),
  pickedFromLocation: z.string().optional(),
  lotNumber: z.string().optional(),
  pickedLotNumber: z.string().optional(),

  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, 'Quantity must be greater than 0')
  ),
  uom: z.enum(['EA', 'TH'], {
    required_error: 'UOM is required',
    invalid_type_error: 'Invalid UOM selected',
  }).default('TH'),
  
  quantityPerPack: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Quantity Per Pack cannot be negative')
  ).default(8.169),
  
  pickQuantityPerPack: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Pick Quantity Per Pack cannot be negative')
  ).optional().default(0),
  
  numberOfPacks: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Number of Packs cannot be negative').default(22)
  ),
  
  numberOfPacksPicked: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Number of Packs Picked cannot be negative')
  ).optional().default(0),
  
  totalQuantityPicked: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Total Quantity Picked cannot be negative')
  ).optional().default(0),
});

type SalesDetailFormInputs = z.infer<typeof salesDetailSchema>;

const AddSalesDetailsForm: React.FC<AddSalesDetailsFormProps> = ({ salesOrderId }) => {
  const { token } = useUserAuth();
  const navigate = useNavigate();

  const authHeader: { Authorization: string } = {
    Authorization: token ? `Bearer ${token}` : '',
  };
  const [lineNoCounter, setLineNoCounter] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SalesDetailFormInputs>({
    resolver: zodResolver(salesDetailSchema),
    defaultValues: {
      productID: ProductIdOptions[0],
      location: '',
      pickedFromLocation: '',
      lotNumber: '',
      pickedLotNumber: '',
      quantityPerPack: 8.169,
      numberOfPacks: 22,
      pickQuantityPerPack: 0,
      numberOfPacksPicked: 0,
      totalQuantityPicked: 0,
      uom: 'TH',
      promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
      quantity: 22 * 8.169,
    },
  });

  const numberOfPacks = watch('numberOfPacks');
  const quantityPerPack = watch('quantityPerPack');

  useEffect(() => {
    const calculatedQuantity = (numberOfPacks || 0) * (quantityPerPack || 0);
    if (setValue) {
      setValue('quantity', parseFloat(calculatedQuantity.toFixed(3)));
    }
  }, [numberOfPacks, quantityPerPack, setValue]);


  useEffect(() => {
    reset({
      productID: ProductIdOptions[0],
      location: '',
      pickedFromLocation: '',
      lotNumber: '',
      pickedLotNumber: '',
      numberOfPacks: 22,
      quantityPerPack: 8.169,
      pickQuantityPerPack: 0,
      numberOfPacksPicked: 0,
      totalQuantityPicked: 0,
      uom: 'TH',
      promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
      quantity: 22 * 8.169,
    });
    setLineNoCounter(0);
  }, [salesOrderId, reset]);

  const onSubmit: SubmitHandler<SalesDetailFormInputs> = async (data) => {
    console.log('Sales Detail Form Data before submission:', data);
    console.log('Product ID:', data.productID);
    console.log('Promised Delivery Date (raw from input):', data.promisedDeliveryDate);
    console.log('Quantity Per Pack (from form):', data.quantityPerPack);
    console.log('Pick Quantity Per Pack (from form):', data.pickQuantityPerPack);
    console.log('UOM (from form):', data.uom);
    console.log('Calculated Quantity (from form):', data.quantity);


    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      setLineNoCounter((prev) => prev + 1);
      const currentLineNo = (lineNoCounter + 1) * 10;

      const selectedDeliveryDate = new Date(data.promisedDeliveryDate);
      const formattedPromisedDeliveryDate = selectedDeliveryDate.toISOString();

      const payload = [{
        sapSalesOrderID: salesOrderId,
        saleDetails: [{
          lineno: String(currentLineNo).padStart(3, '0'),
          productID: data.productID,
          promisedDeliveryDate: formattedPromisedDeliveryDate,
          location: data.location || '',
          pickedFromLocation: data.pickedFromLocation || '',
          lotNumber: data.lotNumber || '',
          pickedLotNumber: data.pickedLotNumber || '',
          quantity: data.quantity,
          uom: data.uom,
          quantityPerPallet: data.quantityPerPack,
          pickQuantityPerPack: data.pickQuantityPerPack || 0,
          numberOfPacks: data.numberOfPacks,
          numberOfPacksPicked: data.numberOfPacksPicked || 0,
          totalQuantityPicked: data.totalQuantityPicked || 0,
        }],
      }];

      console.log('Sales Detail API Payload being sent:', payload);

      const response = await addSalesDetails(payload, authHeader);

      if (response && response[0]?.isSuccess) {
        toast.success(response[0].message || 'Sales detail added successfully!', { duration: 3000 });
        reset({
            productID: ProductIdOptions[0],
            location: '',
            pickedFromLocation: '',
            lotNumber: '',
            pickedLotNumber: '',
            numberOfPacks: 22,
            quantityPerPack: 8.169,
            pickQuantityPerPack: 0,
            numberOfPacksPicked: 0,
            totalQuantityPicked: 0,
            uom: 'TH',
            promisedDeliveryDate: formatDateToDateTimeLocal(new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))),
            quantity: 22 * 8.169,
        });

        setShowLoader(true);
        setTimeout(() => {
          setShowLoader(false);
          navigate('/scanner');
        }, 2000);
      } else {
        const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to add sales detail.';
        toast.error(errorMessage, { duration: 5000 });
        setLineNoCounter((prev) => prev - 1);
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Error: ${errMsg}`, { duration: 5000 });
      console.error('Error adding sales details:', error);
      setLineNoCounter((prev) => prev - 1);
    }
  };

  const productIDSelectOptions = ProductIdOptions.map(id => ({ value: id, label: id }));

  const uomOptions = [
    { value: 'EA', label: 'Each (Ea)' },
    { value: 'TH', label: 'Thousands (Th)' },
  ];

  return (
    <>
      {showLoader && <Loader message="Adding Sales Detail..." />}
      <Card className="max-w-3xl mx-auto p-6 mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Sales Details for Order: {salesOrderId}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product ID - Required */}
            <Select
              label="Product ID"
              options={productIDSelectOptions}
              {...register('productID')}
              error={errors.productID?.message}
              required={true}
            />

            {/* Promised Delivery Date - Required */}
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
            {/* Location - Optional */}
            <Input label="Location" type="text" {...register('location')} error={errors.location?.message} required={false} />
            {/* Picked From Location - Optional */}
            <Input label="Picked From Location" type="text" {...register('pickedFromLocation')} error={errors.pickedFromLocation?.message} required={false} />
            {/* Lot Number - Optional */}
            <Input label="Lot Number" type="text" {...register('lotNumber')} error={errors.lotNumber?.message} required={false} />
            {/* Picked Lot Number - Optional */}
            <Input label="Picked Lot Number" type="text" {...register('pickedLotNumber')} error={errors.pickedLotNumber?.message} required={false} />
            
            {/* Quantity - Required (calculated) */}
            <Input
              label="Quantity"
              type="number"
              step="0.001"
              {...register('quantity')}
              error={errors.quantity?.message}
              readOnly
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              required={true}
            />

            {/* UOM - Required */}
            <Select label="UOM" options={uomOptions} {...register('uom')} error={errors.uom?.message} required={true} />
            
            {/* Quantity Per Pack - Required */}
            <Input
              label="Quantity Per Pack"
              type="number"
              step="0.001"
              {...register('quantityPerPack')}
              error={errors.quantityPerPack?.message}
              required={true}
            />
            
            {/* Pick Quantity Per Pack - Optional */}
            <Input label="Pick Quantity Per Pack" type="number" step="0.001" {...register('pickQuantityPerPack')} error={errors.pickQuantityPerPack?.message} required={false} />
            {/* Number of Packs - Required */}
            <Input label="Number of Packs" type="number" step="1" {...register('numberOfPacks')} error={errors.numberOfPacks?.message} required={true} />
            {/* Number of Packs Picked - Optional */}
            <Input label="Number of Packs Picked" type="number" step="1" {...register('numberOfPacksPicked')} error={errors.numberOfPacksPicked?.message} required={false} />
            {/* Total Quantity Picked - Optional */}
            <Input label="Total Quantity Picked" type="number" step="0.01" {...register('totalQuantityPicked')} error={errors.totalQuantityPicked?.message} required={false} />
          </div>
          <Button type="submit" disabled={isSubmitting || showLoader} className="w-full mt-6">
            {isSubmitting ? 'Adding Detail...' : 'Add Sales Detail'}
          </Button>
        </form>
      </Card>
    </>
  );
};

export default AddSalesDetailsForm;
