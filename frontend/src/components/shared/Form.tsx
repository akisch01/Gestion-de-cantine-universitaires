import React from "react";
import { z } from "zod";
import { DefaultValues, Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormFieldProps<T> {
    label: string;
    name: Path<T>;
    type?: string;
    value: T[keyof T];
    error?: string;
    onChange: (value: T[keyof T]) => void;
    required?: boolean;
    options?: { label: string; value: T[keyof T] }[];
    placeholder?: string;
}

const FormField: React.FC<FormFieldProps<any>> = ({
    label,
    name,
    type = "text",
    value,
    error,
    onChange,
    required = false,
    options,
    placeholder
}) => {
    const renderField = () => {
        switch (type) {
            case "select":
                return (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        required={required}
                    >
                        <option value="">Sélectionnez une option</option>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case "textarea":
                return (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        required={required}
                        placeholder={placeholder}
                        rows={4}
                    />
                );
            case "checkbox":
                return (
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className={`h-4 w-4 text-blue-600 ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        required={required}
                    />
                );
            default:
                return (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        required={required}
                        placeholder={placeholder}
                    />
                );
        }
    };

    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField()}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

interface FormProps<T> {
    initialValues: T;
    validationSchema: z.ZodSchema<T>;
    onSubmit: (values: T) => Promise<void>;
    fields: {
        name: Path<T>;
        label: string;
        type?: string;
        required?: boolean;
        options?: { label: string; value: T[keyof T] }[];
        placeholder?: string;
    }[];
    submitLabel?: string;
    className?: string;
}

export function Form<T extends Record<string, any>>({
    initialValues,
    validationSchema,
    onSubmit,
    fields,
    submitLabel = "Soumettre",
    className = ""
}: FormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        watch
    } = useForm<T>({
        resolver: zodResolver(validationSchema),
        defaultValues: initialValues as DefaultValues<T>
    });

    const formValues = watch();

    const onSubmitForm = async (data: T) => {
        try {
            await onSubmit(data);
        } catch (error: any) {
            if (error.response?.data) {
                Object.entries(error.response.data).forEach(([key, value]) => {
                    setError(key as Path<T>, {
                        type: "manual",
                        message: value as string
                    });
                });
            } else {
                setError("root", {
                    type: "manual",
                    message: "Une erreur est survenue"
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className={`space-y-4 ${className}`}>
            {fields.map((field) => (
                <FormField
                    key={String(field.name)}
                    label={field.label}
                    name={String(field.name)}
                    type={field.type}
                    value={formValues[field.name]}
                    error={errors[field.name]?.message as string | undefined}
                    onChange={(value) => {
                        const event = {
                            target: { name: field.name, value }
                        };
                        register(field.name as Path<T>).onChange(event);
                    }}
                    required={field.required}
                    options={field.options}
                    placeholder={field.placeholder}
                />
            ))}
            {errors._form && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-500">{errors._form?.message?.toString()}</p>
                </div>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {isSubmitting ? "Chargement..." : submitLabel}
            </button>
        </form>
    );
} 