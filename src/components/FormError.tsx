import React from "react";
import type { FormErrorProps } from "../types/component.types";

export const FormError: React.FC<FormErrorProps> = ({
	error,
	className = "",
}) => {
	if (!error) return null;

	const message =
		(error as any)?.message || (typeof error === "string" ? error : null);
	if (!message) return null;

	return (
		<span
			className={`text-red-500 text-xs font-medium block mt-1 ${className}`}
		>
			{message}
		</span>
	);
};
