import React from "react";
import { useNavigate } from "react-router-dom";
import type { ProductCardProps } from "../types/component.types";
import { useAuth } from "../hooks/useAuth";

export const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onEdit,
	onDelete,
	showActions = false,
	period,
}) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const formatPrice = (price?: number) => {
		if (!price) return "-";
		return `$${price.toFixed(2)}`;
	};

	const formatRentalPrice = (price?: number, unit?: string) => {
		if (!price || !unit) return "-";
		const unitLabel = unit.toLowerCase();
		return `$${price} per ${unitLabel}`;
	};

	const handleCardClick = () => {
		navigate(`/products/${product.id}`);
	};

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(product.id);
		} else {
			navigate(`/products/${product.id}/edit`);
		}
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(product.id, product.title || "Untitled");
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className="bg-white border border-gray-300 rounded p-6 cursor-pointer hover:shadow-md transition-shadow"
		>
			<div className="flex justify-between items-start mb-4">
				<h3 className="text-xl font-semibold text-gray-800 flex-1">
					{product.title}
				</h3>
				{showActions && user?.id === product.userId && (
					<div className="flex gap-2">
						<button
							onClick={handleEditClick}
							className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
							title="Edit product"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</button>
						<button
							onClick={handleDeleteClick}
							className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
							title="Delete product"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				)}
			</div>

			<div className="text-sm text-gray-600 mb-3">
				Categories:{" "}
				<span className="font-medium">
					{product.categories.map((c) => c.name).join(", ") || "-"}
				</span>
			</div>

			<div className="text-sm text-gray-600 mb-3">
				Price:{" "}
				<span className="font-medium">
					{formatPrice(product.purchasePrice)}
				</span>
				{product.rentalPrice && (
					<>
						{" "}
						| Rent:{" "}
						<span className="font-medium">
							{formatRentalPrice(product.rentalPrice, product.rentUnit)}
						</span>
					</>
				)}
			</div>

			<p className="text-gray-700 text-sm line-clamp-2">
				{product.description}
			</p>

			{period && (
				<div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
					<p className="text-sm text-gray-600">
						Period:{" "}
						<span className="font-medium">
							{new Date(period.startDate).toLocaleDateString()} -{" "}
							{new Date(period.endDate).toLocaleDateString()}
						</span>
					</p>
					{period.status && (
						<p className="text-sm text-gray-600">
							Status:{" "}
							<span
								className={`font-medium ${
									period.status === "ACTIVE"
										? "text-orange-600"
										: period.status === "COMPLETED"
										? "text-green-600"
										: "text-gray-600"
								}`}
							>
								{period.status}
							</span>
						</p>
					)}
				</div>
			)}
		</div>
	);
};
