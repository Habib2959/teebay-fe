import React from "react";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
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

export const Select: React.FC<SelectProps> = ({
	label,
	value,
	onChange,
	options,
	multiple = false,
	error,
	disabled = false,
	size,
	helper,
}) => {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label className="block text-gray-700 font-semibold mb-2">
					{label}
				</label>
			)}
			<select
				multiple={multiple}
				value={value}
				onChange={(e) => {
					if (multiple) {
						const selected = Array.from(
							e.target.selectedOptions,
							(option) => option.value
						);
						onChange(selected);
					} else {
						onChange(e.target.value);
					}
				}}
				disabled={disabled}
				size={size}
				className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-white text-black focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
					error ? "border-red-500 bg-red-50" : "border-gray-300"
				} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				{!multiple && <option value="">Select an option</option>}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{helper && <p className="mt-2 text-sm text-gray-600">{helper}</p>}
			{error && (
				<span className="text-red-500 text-xs font-medium">{error}</span>
			)}
		</div>
	);
};
