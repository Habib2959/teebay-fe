import React from "react";

interface TextInputProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	type?: "text" | "email" | "password" | "number";
	error?: string;
	disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
	label,
	placeholder,
	value,
	onChange,
	type = "text",
	error,
	disabled = false,
}) => {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label className="block text-gray-700 font-semibold mb-2">
					{label}
				</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
					error ? "border-red-500 bg-red-50" : "border-gray-300"
				} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			/>
			{error && (
				<span className="text-red-500 text-xs font-medium">{error}</span>
			)}
		</div>
	);
};
