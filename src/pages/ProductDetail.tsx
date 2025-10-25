import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { GET_PRODUCT } from "../graphql/queries";
import { BUY_PRODUCT_MUTATION } from "../graphql/mutations";
import { client } from "../apollo/client";
import { Product } from "../types/index";

export const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [buyModal, setBuyModal] = useState({
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
				// Optionally navigate back to products list after successful purchase
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
			// TODO: Implement rent functionality
			alert("Rent functionality coming soon");
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
						{/* Header Tab */}
						<div className="bg-gray-400 px-6 py-3">
							<h2 className="text-gray-700 font-semibold">
								Buy/Rent product {product.title}
							</h2>
						</div>

						{/* Content */}
						<div className="p-8">
							{/* Product Title */}
							<h1 className="text-4xl font-bold text-gray-800 mb-4">
								{product.title}
							</h1>

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
							<div className="mb-6">
								<p className="text-gray-600">
									Price:{" "}
									<span className="font-medium text-lg">
										{formatPrice(product.purchasePrice)}
									</span>
								</p>
								{product.rentalPrice && (
									<p className="text-gray-600">
										Rental Price:{" "}
										<span className="font-medium">
											{formatRentalPrice(product.rentalPrice, product.rentUnit)}
										</span>
									</p>
								)}
							</div>

							{/* Description */}
							<div className="text-gray-700 mb-12 leading-relaxed">
								{product.description}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 justify-end pt-8">
								{product.rentalPrice && (
									<button
										onClick={handleRentClick}
										className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
									>
										Rent
									</button>
								)}
								{product.purchasePrice && (
									<button
										onClick={handleBuyClick}
										className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
									>
										Buy
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
		</div>
	);
};
