import { useState, useCallback } from "react";
import { z } from "zod";
import { ApiErrorHandler } from "../lib/errorHandler";
import { safeValidate } from "../lib/validators";

interface UseFormOptions<T> {
    initialValues: T;
    validationSchema: z.ZodSchema<T>;
    onSubmit: (values: T) => Promise<void>;
}

interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    handleChange: (field: keyof T) => (value: any) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    reset: () => void;
    setError: (field: keyof T, message: string) => void;
    clearErrors: () => void;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validationSchema,
    onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((field: keyof T) => (value: any) => {
        setValues(prev => ({
            ...prev,
            [field]: value
        }));
        // Effacer l'erreur du champ modifié
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const validate = useCallback(() => {
        const result = safeValidate(validationSchema, values);
        if (!result.success) {
            const newErrors: Partial<Record<keyof T, string>> = {};
            // Convertir les erreurs Zod en format de formulaire
            const zodErrors = result.error?.split(", ") || [];
            zodErrors.forEach(error => {
                const [field, message] = error.split(": ");
                if (field && message) {
                    newErrors[field as keyof T] = message;
                }
            });
            setErrors(newErrors);
            return false;
        }
        return true;
    }, [values, validationSchema]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
            reset();
        } catch (error) {
            const apiError = ApiErrorHandler.handle(error);
            if (ApiErrorHandler.isValidationError(apiError) && apiError.details) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(apiError.details).map(([key, messages]) => [key, messages.join(", ")])
                    ) as Partial<Record<keyof T, string>>
                );
            } else {
                setErrors({ _form: apiError.message } as Partial<Record<keyof T, string>>);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate, onSubmit]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    const setError = useCallback((field: keyof T, message: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: message
        }));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
        setError,
        clearErrors
    };
} 