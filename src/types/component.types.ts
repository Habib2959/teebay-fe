import React from "react";
import { FieldError } from "react-hook-form";
import { Product } from "./index";

// TextInput component types
export interface TextInputProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	type?: "text" | "email" | "password" | "number" | "date";
	error?: string;
	disabled?: boolean;
}

// TextArea component types
export interface TextAreaProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	rows?: number;
	error?: string;
	disabled?: boolean;
}

// Modal component types
export interface ModalProps {
	isOpen: boolean;
	title: string;
	message?: React.ReactNode;
	children?: React.ReactNode;
	onClose: () => void;
	primaryAction?: {
		label: string;
		onClick: () => void;
		isLoading?: boolean;
		variant?: "danger" | "success" | "primary";
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
		isLoading?: boolean;
	};
	maxWidth?: "sm" | "md" | "lg" | "xl";
}

// Select component types
export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps {
	label?: string;
	value: string | string[];
	onChange: (value: string | string[]) => void;
	options: SelectOption[];
	multiple?: boolean;
	error?: string;
	disabled?: boolean;
	size?: number;
	helper?: string;
}

// FormError component types
export interface FormErrorProps {
	error?: FieldError | { message?: string };
	className?: string;
}

// MultiSelect component types
export interface OptionType {
	value: string;
	label: string;
}

export interface MultiSelectProps {
	label?: string;
	placeholder?: string;
	value: string[];
	onChange: (value: string[]) => void;
	options: OptionType[];
	error?: string;
	disabled?: boolean;
}

// ProtectedRoute component types
export interface ProtectedRouteProps {
	children: React.ReactNode;
}

// ProductCard component types
export interface Period {
	startDate: string;
	endDate: string;
	status?: string;
}

export interface ProductCardProps {
	product: Product;
	onEdit?: (productId: string) => void;
	onDelete?: (productId: string, productTitle: string) => void;
	showActions?: boolean;
	period?: Period;
}
