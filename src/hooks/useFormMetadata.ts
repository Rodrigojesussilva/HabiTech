import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/utils/formUtils';

// Global variables to hold the shared state
let globalForm: UseFormReturn<any> | null = null;
let globalMetadata: FormSection | null = null;

// Simple hook to access shared form data
export function useFormMetadata() {
  return {
    // Access the shared form and metadata
    form: globalForm,
    metadata: globalMetadata,
    
    // Simple setters
    setForm: (form: UseFormReturn<any> | null) => {
      globalForm = form;
    },
    setMetadata: (metadata: FormSection | null) => {
      globalMetadata = metadata;
    }
  };
} 