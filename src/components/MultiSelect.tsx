import React from "react";
import ReactSelect, { MultiValue, StylesConfig } from "react-select";
import type { OptionType, MultiSelectProps } from "../types/component.types";

const customStyles: StylesConfig<OptionType, true> = {
	control: (base, state) => ({
		...base,
		backgroundColor: "rgb(249 250 251)",
		borderColor: state.isFocused ? "rgb(79 70 229)" : "rgb(209 213 219)",
		boxShadow: state.isFocused ? "0 0 0 2px rgb(199 210 254)" : "none",
		borderRadius: "0.375rem",
		padding: "0.25rem",
		minHeight: "44px",
		fontSize: "0.875rem",
		fontWeight: "500",
		"&:hover": {
			borderColor: state.isFocused ? "rgb(79 70 229)" : "rgb(209 213 219)",
		},
	}),
	multiValue: (base) => ({
		...base,
		backgroundColor: "rgb(199 210 254)",
		borderRadius: "0.375rem",
		padding: "0.125rem 0.5rem",
	}),
	multiValueLabel: (base) => ({
		...base,
		color: "rgb(67 56 202)",
		fontSize: "0.875rem",
		fontWeight: "500",
	}),
	multiValueRemove: (base) => ({
		...base,
		color: "rgb(67 56 202)",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgb(165 180 252)",
			color: "rgb(55 48 163)",
		},
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isSelected
			? "rgb(79 70 229)"
			: state.isFocused
			? "rgb(224 231 255)"
			: "white",
		color: state.isSelected ? "white" : "rgb(17 24 39)",
		cursor: "pointer",
		fontSize: "0.875rem",
		padding: "8px 12px",
		"&:hover": {
			backgroundColor: state.isSelected ? "rgb(79 70 229)" : "rgb(224 231 255)",
		},
	}),
	menu: (base) => ({
		...base,
		borderRadius: "0.375rem",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		zIndex: 50,
	}),
	menuList: (base) => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
	}),
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
	label,
	placeholder = "Select options...",
	value,
	onChange,
	options,
	error,
	disabled = false,
}) => {
	const selectedValues = options.filter((opt) => value.includes(opt.value));

	const handleChange = (selected: MultiValue<OptionType>) => {
		onChange(selected.map((opt) => opt.value));
	};

	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label className="block text-gray-700 font-semibold mb-2">
					{label}
				</label>
			)}
			<div
				className={`rounded-md transition-all duration-300 ${
					error ? "ring-2 ring-red-500 ring-opacity-50" : ""
				}`}
			>
				<ReactSelect
					isMulti={true}
					options={options}
					value={selectedValues}
					onChange={handleChange}
					placeholder={placeholder}
					isDisabled={disabled}
					styles={customStyles}
					classNamePrefix="react-select"
					isClearable={false}
					isSearchable={true}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
				/>
			</div>
			{error && (
				<span className="text-red-500 text-xs font-medium">{error}</span>
			)}
		</div>
	);
};
