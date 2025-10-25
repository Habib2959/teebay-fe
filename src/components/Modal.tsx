import React from "react";

interface ModalProps {
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

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	title,
	message,
	children,
	onClose,
	primaryAction,
	secondaryAction,
	maxWidth = "sm",
}) => {
	if (!isOpen) return null;

	const maxWidthClass = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
	}[maxWidth];

	const buttonVariantClass = {
		danger: "bg-red-600 hover:bg-red-700",
		success: "bg-green-600 hover:bg-green-700",
		primary: "bg-indigo-600 hover:bg-indigo-700",
	};

	const primaryVariant = primaryAction?.variant || "primary";

	return (
		<div className="fixed inset-0 bg-[#05050580] bg-opacity-20 flex items-center justify-center z-50">
			<div
				className={`bg-white rounded-lg shadow-lg p-8 ${maxWidthClass} mx-4`}
			>
				{/* Header */}
				<h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>

				{/* Content */}
				<div className="text-gray-600 mb-6">
					{message && <p>{message}</p>}
					{children}
				</div>

				{/* Footer */}
				<div className="flex gap-3 justify-end">
					{secondaryAction && (
						<button
							onClick={secondaryAction.onClick}
							disabled={secondaryAction.isLoading}
							className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{secondaryAction.label}
						</button>
					)}

					{primaryAction && (
						<button
							onClick={primaryAction.onClick}
							disabled={primaryAction.isLoading}
							className={`px-6 py-2 text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariantClass[primaryVariant]}`}
						>
							{primaryAction.isLoading
								? `${primaryAction.label}...`
								: primaryAction.label}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
