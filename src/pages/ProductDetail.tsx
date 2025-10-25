import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { FormError } from "../components/FormError";
import { GET_PRODUCT } from "../graphql/queries";
import {
	BUY_PRODUCT_MUTATION,
	RENT_PRODUCT_MUTATION,
} from "../graphql/mutations";
import { client } from "../apollo/client";
import { Product } from "../types/index";

export const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const {
		control: rentControl,
		handleSubmit: handleSubmitRent,
		formState: { errors: rentErrors },
		watch: watchRent,
	} = useForm({
		defaultValues: {
			startDate: "",
			endDate: "",
		},
	});
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [buyModal, setBuyModal] = useState({
		isOpen: false,
		isProcessing: false,
	});
	const [rentModal, setRentModal] = useState({
		isOpen: false,
		isProcessing: false,
	});

	useEffect(() => {
		if (id) {
			fetchProduct(id);
		}
	}, [id]);

	const fetchProduct = async (productId: string) => {
		try {
			setIsLoading(true);
			const { data } = await client.query({
				query: GET_PRODUCT,
				variables: { id: productId },
			});

			if ((data as any)?.product) {
				setProduct((data as any).product);
			} else {
				setError("Product not found");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load product");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBuyClick = () => {
		if (product) {
			setBuyModal({ isOpen: true, isProcessing: false });
		}
	};

	const handleCloseBuyModal = () => {
		setBuyModal({ isOpen: false, isProcessing: false });
	};

	const handleConfirmBuy = async () => {
		if (!product) return;

		try {
			setBuyModal((prev) => ({ ...prev, isProcessing: true }));

			const response = await client.mutate({
				mutation: BUY_PRODUCT_MUTATION,
				variables: {
					input: {
						productId: product.id,
					},
				},
			});

			if ((response.data as any)?.buyProduct?.id) {
				const buyTransaction = (response.data as any).buyProduct;
				alert(
					`Successfully purchased ${
						buyTransaction.product.title
					} for $${buyTransaction.price.toFixed(2)}`
				);
				handleCloseBuyModal();
				setTimeout(() => navigate("/"), 1500);
			} else {
				alert("Failed to complete purchase");
			}
		} catch (err) {
			console.error("Error processing purchase:", err);
			const errorMsg =
				err instanceof Error ? err.message : "Failed to process purchase";
			alert(errorMsg);
		} finally {
			setBuyModal((prev) => ({ ...prev, isProcessing: false }));
		}
	};

	const handleRentClick = () => {
		if (product) {
			setRentModal({
				isOpen: true,
				isProcessing: false,
			});
		}
	};

	const handleCloseRentModal = () => {
		setRentModal({
			isOpen: false,
			isProcessing: false,
		});
	};

	const handleConfirmRent = async (data: {
		startDate: string;
		endDate: string;
	}) => {
		if (!product || !data.startDate || !data.endDate) {
			alert("Please select both start and end dates");
			return;
		}

		const start = new Date(data.startDate);
		const end = new Date(data.endDate);

		if (start >= end) {
			alert("End date must be after start date");
			return;
		}

		try {
			setRentModal((prev) => ({ ...prev, isProcessing: true }));

			const response = await client.mutate({
				mutation: RENT_PRODUCT_MUTATION,
				variables: {
					input: {
						productId: product.id,
						startDate: data.startDate,
						endDate: data.endDate,
					},
				},
			});

			if ((response.data as any)?.rentProduct?.id) {
				const rentTransaction = (response.data as any).rentProduct;
				alert(
					`Successfully rented ${
						rentTransaction.product.title
					} for $${rentTransaction.rentalPrice.toFixed(2)} from ${
						data.startDate
					} to ${data.endDate}`
				);
				handleCloseRentModal();
				setTimeout(() => navigate("/"), 1500);
			} else {
				alert("Failed to complete rental");
			}
		} catch (err) {
			console.error("Error processing rental:", err);
			const errorMsg =
				err instanceof Error ? err.message : "Failed to process rental";
			alert(errorMsg);
		} finally {
			setRentModal((prev) => ({ ...prev, isProcessing: false }));
		}
	};

	const formatPrice = (price?: number) => {
		if (!price) return "-";
		return `$${price.toFixed(2)}`;
	};

	const formatRentalPrice = (price?: number, unit?: string) => {
		if (!price || !unit) return "-";
		const unitLabel = unit.toLowerCase();
		return `$${price} ${unitLabel}`;
	};

	const calculateTotalRentalPrice = (
		startDate: string,
		endDate: string,
		rentalPrice?: number,
		rentUnit?: string
	) => {
		if (!startDate || !endDate || !rentalPrice || !rentUnit) return null;

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (start >= end) return null;

		let days = 0;
		switch (rentUnit.toUpperCase()) {
			case "HOURLY":
				days = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
				break;
			case "DAILY":
				days = Math.ceil(
					(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
				);
				break;
			case "WEEKLY":
				days = Math.ceil(
					(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
				);
				break;
			case "MONTHLY":
				days = Math.ceil(
					(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
				);
				break;
			default:
				days = Math.ceil(
					(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
				);
		}

		const total = rentalPrice * days;
		return total;
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />

			{/* Main Content */}
			<div className="max-w-4xl mx-auto p-6">
				{isLoading ? (
					<div className="text-center py-20">
						<p className="text-gray-600 text-lg">Loading product...</p>
					</div>
				) : error ? (
					<div className="text-center py-20">
						<p className="text-red-600 text-lg">{error}</p>
						<button
							onClick={() => navigate("/")}
							className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
						>
							Back to Products
						</button>
					</div>
				) : product ? (
					<div className="bg-white rounded shadow-lg">
						{/* Content */}
						<div className="p-8">
							{/* Product Title */}
							<h1 className="text-4xl font-bold text-gray-800 mb-4">
								{product.title}
							</h1>
							{/* Status Badges */}
							{(product.isBought || product.isCurrentlyRented) && (
								<div className="mb-6 flex gap-3">
									{product.isBought && (
										<div className="px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
											<p className="text-red-800 text-sm font-semibold">
												🔴 Already Purchased
											</p>
											<p className="text-red-700 text-xs">
												This product has been bought and is no longer available
												for purchase.
											</p>
										</div>
									)}
									{product.isCurrentlyRented && (
										<div className="px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg">
											<p className="text-orange-800 text-sm font-semibold">
												🟠 Currently Being Rented
											</p>
											<p className="text-orange-700 text-xs">
												This product is currently rented and unavailable for new
												rentals during this period.
											</p>
										</div>
									)}
								</div>
							)}
							{/* Categories */}
							<div className="mb-4">
								<p className="text-gray-600">
									Categories:{" "}
									<span className="font-medium">
										{product.categories.map((c) => c.name).join(", ") || "-"}
									</span>
								</p>
							</div>
							{/* Price */}
							<div className="mb-6 space-y-3">
								<div className="flex items-center justify-between">
									<p className="text-gray-600">
										Price:{" "}
										<span className="font-medium text-lg">
											{formatPrice(product.purchasePrice)}
										</span>
									</p>
								</div>
								{product.rentalPrice && (
									<div className="flex items-center justify-between">
										<p className="text-gray-600">
											Rental Price:{" "}
											<span className="font-medium">
												{formatRentalPrice(
													product.rentalPrice,
													product.rentUnit
												)}
											</span>
										</p>
									</div>
								)}
							</div>{" "}
							{/* Description */}
							<div className="text-gray-700 mb-12 leading-relaxed">
								{product.description}
							</div>
							{/* Action Buttons */}
							<div className="flex gap-4 justify-end pt-8">
								{product.rentalPrice && (
									<button
										onClick={handleRentClick}
										disabled={product.isCurrentlyRented}
										className={`px-8 py-3 font-semibold rounded transition-colors ${
											product.isCurrentlyRented
												? "bg-gray-400 text-gray-600 cursor-not-allowed"
												: "bg-indigo-600 text-white hover:bg-indigo-700"
										}`}
									>
										{product.isCurrentlyRented
											? "Currently Being Rented"
											: "Rent"}
									</button>
								)}
								{product.purchasePrice && (
									<button
										onClick={handleBuyClick}
										disabled={product.isBought || product.isCurrentlyRented}
										className={`px-8 py-3 font-semibold rounded transition-colors ${
											product.isBought || product.isCurrentlyRented
												? "bg-gray-400 text-gray-600 cursor-not-allowed"
												: "bg-indigo-600 text-white hover:bg-indigo-700"
										}`}
									>
										{product.isBought
											? "Already Purchased"
											: product.isCurrentlyRented
											? "Currently Being Rented"
											: "Buy"}
									</button>
								)}
							</div>
						</div>

						{/* Footer Info */}
						<div className="bg-gray-50 px-8 py-4 border-t text-xs text-gray-500">
							<p>Posted on: {formatDate(product.createdAt)}</p>
						</div>
					</div>
				) : null}
			</div>

			{/* Buy Confirmation Modal */}
			<Modal
				isOpen={buyModal.isOpen}
				title="Confirm Purchase"
				message={`Are you sure you want to buy "${
					product?.title
				}" for ${formatPrice(product?.purchasePrice)}?`}
				onClose={handleCloseBuyModal}
				primaryAction={{
					label: "Confirm Purchase",
					onClick: handleConfirmBuy,
					isLoading: buyModal.isProcessing,
					variant: "primary",
				}}
				secondaryAction={{
					label: "Cancel",
					onClick: handleCloseBuyModal,
				}}
				maxWidth="sm"
			/>

			{/* Rent Modal with Date Picker */}
			<Modal
				isOpen={rentModal.isOpen}
				title="Rent Product"
				onClose={handleCloseRentModal}
				primaryAction={{
					label: "Confirm Rent",
					onClick: handleSubmitRent(handleConfirmRent),
					isLoading: rentModal.isProcessing,
					variant: "primary",
				}}
				secondaryAction={{
					label: "Cancel",
					onClick: handleCloseRentModal,
				}}
				maxWidth="sm"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Start Date
						</label>
						<Controller
							name="startDate"
							control={rentControl}
							rules={{ required: "Start date is required" }}
							render={({ field }) => (
								<input
									{...field}
									type="date"
									className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-900 cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
									style={{ colorScheme: "light" }}
								/>
							)}
						/>
						<FormError error={rentErrors.startDate} />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							End Date
						</label>
						<Controller
							name="endDate"
							control={rentControl}
							rules={{ required: "End date is required" }}
							render={({ field }) => (
								<input
									{...field}
									type="date"
									className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-900 cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
									style={{ colorScheme: "light" }}
								/>
							)}
						/>
						<FormError error={rentErrors.endDate} />
					</div>

					<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded space-y-2">
						<p>
							Rental Price:{" "}
							<span className="font-semibold">
								{formatRentalPrice(product?.rentalPrice, product?.rentUnit)}
							</span>
						</p>
						<p>
							Total Rental Price:{" "}
							<span className="font-semibold">
								{(() => {
									const total = calculateTotalRentalPrice(
										watchRent("startDate"),
										watchRent("endDate"),
										product?.rentalPrice,
										product?.rentUnit
									);
									return total ? formatPrice(total) : "-";
								})()}
							</span>
						</p>
					</div>
				</div>
			</Modal>
		</div>
	);
};
