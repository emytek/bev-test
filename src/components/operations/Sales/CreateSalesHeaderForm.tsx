import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Card from '../../../components/common/Card';
import { addSalesHeader } from '../../../api/sales/sales';
import { toast } from 'sonner';
import Button from '../../ui/button/SalesBtn';
import Input from '../../form/input/SubInput';
import DateTimeLocalInput from '../../ui/DatePicker';
import { useUserAuth } from '../../../context/auth/AuthContext';
import { FaSave, FaSpinner } from 'react-icons/fa';

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

// Helper function to format Date object to "YYYY-MM-DD HH:MM:SS.SSS" for API payload
const formatApiDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

// Schema for form validation
const salesHeaderSchema = z.object({
  // --- CHANGED: SAPSalesOrderID is now required ---
  SAPSalesOrderID: z.string().min(1, 'Sales Order ID is required'), // No .optional()
  // --- END CHANGE ---
  CustomerID: z.string().min(1, 'Customer ID is required'),
  SalesDate: z.string().min(1, 'Sales Date is required').refine((val) => {
    return !isNaN(new Date(val).getTime());
  }, { message: 'Invalid Date/Time format' }),
  TotalAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, 'Total Amount must be greater than 0')
  ),
  SAPQuantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, 'Quantity must be greater than 0')
  ),
});

type SalesHeaderFormInputs = z.infer<typeof salesHeaderSchema>;

interface CreateSalesHeaderFormProps {
  onSalesHeaderCreated: (salesOrderId: string) => void;
}

const CreateSalesHeaderForm: React.FC<CreateSalesHeaderFormProps> = ({ onSalesHeaderCreated }) => {
  const { token } = useUserAuth();

  const authHeader: { Authorization: string } = {
    Authorization: token ? `Bearer ${token}` : '',
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SalesHeaderFormInputs>({
    resolver: zodResolver(salesHeaderSchema),
    defaultValues: {
      SAPSalesOrderID: '', // Still good to initialize, Zod will validate it's not empty
      SalesDate: formatDateToDateTimeLocal(new Date()),
    },
  });

  const onSubmit: SubmitHandler<SalesHeaderFormInputs> = async (data) => {
    console.log('Form Data before submission:', data);
    console.log('SAPSalesOrderID (user input):', data.SAPSalesOrderID);
    console.log('CustomerID:', data.CustomerID);
    console.log('SalesDate (raw from input):', data.SalesDate);
    console.log('TotalAmount:', data.TotalAmount);
    console.log('SAPQuantity:', data.SAPQuantity);

    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const selectedDate = new Date(data.SalesDate);
      const formattedSalesDate = formatApiDateTime(selectedDate);

      const payload: {
        SAPSalesOrderID: string; // <-- CHANGED: Now required in payload type
        CustomerID: string;
        SalesDate: string;
        TotalAmount: number;
        SAPQuantity: number;
      }[] = [{
        SAPSalesOrderID: data.SAPSalesOrderID, // <-- Directly use data.SAPSalesOrderID
        CustomerID: data.CustomerID,
        SalesDate: formattedSalesDate,
        TotalAmount: data.TotalAmount,
        SAPQuantity: data.SAPQuantity,
      }];

      console.log('API Payload being sent:', payload);

      const response = await addSalesHeader(payload, authHeader);

      if (response && response[0]?.isSuccess) {
        toast.success(response[0].message || 'Sales header created successfully!', { duration: 3000 });
        
        // --- CRITICAL CHANGE HERE (Simplified) ---
        const finalSalesOrderId = data.SAPSalesOrderID; // Directly use the user's input
        // --- END CRITICAL CHANGE ---
        onSalesHeaderCreated(finalSalesOrderId);
        
        reset({
          SAPSalesOrderID: '',
          SalesDate: formatDateToDateTimeLocal(new Date()),
        });
      } else {
        const errorMessage = response && response[0]?.errorMessage?.join(', ') || response[0]?.message || 'Failed to create sales header.';
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Error: ${errMsg}`, { duration: 5000 });
      console.error('Error creating sales header:', error);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Sales Order Header</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Sales Order ID - Now REQUIRED, with asterisk */}
        <Input
          label="Sales Order ID"
          type="text"
          {...register('SAPSalesOrderID')}
          error={errors.SAPSalesOrderID?.message}
          required={true} // <-- CHANGED: Explicitly required
        />

        {/* Customer ID - Required, with asterisk */}
        <Input
          label="Customer ID"
          type="text"
          {...register('CustomerID')}
          error={errors.CustomerID?.message}
          required={true}
        />

        {/* Sales Date - Required, with asterisk */}
        <Controller
          name="SalesDate"
          control={control}
          render={({ field }) => (
            <DateTimeLocalInput
              label="Sales Date"
              {...field}
              error={errors.SalesDate?.message}
              required={true}
            />
          )}
        />

        {/* Total Amount - Required, with asterisk */}
        <Input
          label="Total Amount"
          type="number"
          step="0.01"
          {...register('TotalAmount')}
          error={errors.TotalAmount?.message}
          required={true}
        />
        {/* Quantity - Required, with asterisk */}
        <Input
          label="Quantity"
          type="number"
          step="0.00000001"
          {...register('SAPQuantity')}
          error={errors.SAPQuantity?.message}
          required={true}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4"
          icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
        >
          {isSubmitting ? 'Creating...' : 'Create Sales Header'}
        </Button>
      </form>
    </Card>
  );
};

export default CreateSalesHeaderForm;




