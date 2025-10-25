import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_ALL_PRODUCTS } from "../graphql/queries";
import { client } from "../apollo/client";
import { Product } from "../types/index";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutations";

const ITEMS_PER_PAGE = 10;

export const Products: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [products, setProducts] = useState<Product[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		productId: string | null;
		productTitle: string;
		isDeleting: boolean;
	}>({
		isOpen: false,
		productId: null,
		productTitle: "",
		isDeleting: false,
	});

	React.useEffect(() => {
		fetchProducts(currentPage);
	}, [currentPage]);

	const fetchProducts = async (page: number) => {
		try {
			setIsLoading(true);
			const offset = (page - 1) * ITEMS_PER_PAGE;
			const { data } = await client.query({
				query: GET_ALL_PRODUCTS,
				variables: {
					limit: ITEMS_PER_PAGE,
					offset,
					status: "PUBLISHED",
				},
			});

			if ((data as any)?.allProducts) {
				setProducts((data as any).allProducts.products);
				setTotal((data as any).allProducts.total);
			}
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddProduct = () => {
		navigate("/add-product");
	};

	const handleProductClick = (productId: string) => {
		navigate(`/products/${productId}`);
	};

	const handleEditProduct = (e: React.MouseEvent, productId: string) => {
		e.stopPropagation();
		navigate(`/products/${productId}/edit`);
	};

	const handleOpenDeleteModal = (
		e: React.MouseEvent,
		productId: string,
		productTitle: string
	) => {
		e.stopPropagation();
		setDeleteModal({
			isOpen: true,
			productId,
			productTitle,
			isDeleting: false,
		});
	};

	const handleCloseDeleteModal = () => {
		setDeleteModal({
			isOpen: false,
			productId: null,
			productTitle: "",
			isDeleting: false,
		});
	};

	const handleConfirmDelete = async () => {
		if (!deleteModal.productId) return;

		try {
			setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
			const response = await client.mutate({
				mutation: DELETE_PRODUCT_MUTATION,
				variables: {
					id: deleteModal.productId,
				},
			});

			if ((response.data as any)?.deleteProduct?.success) {
				alert("Product deleted successfully!");
				// Remove product from list
				setProducts(products.filter((p) => p.id !== deleteModal.productId));
				setTotal(total - 1);
				handleCloseDeleteModal();
				// Refetch products cache
				await client.refetchQueries({ include: ["GetAllProducts"] });
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert(
				error instanceof Error ? error.message : "Failed to delete product"
			);
		} finally {
			setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
		}
	};

	const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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
			<div className="max-w-6xl mx-auto p-6">
				{/* Header with Add Product Button */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800">Products</h1>
					<button
						onClick={handleAddProduct}
						className="px-6 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 hover:-translate-y-0.5"
					>
						Add Product
					</button>
				</div>

				{/* Products List */}
				{isLoading ? (
					<div className="text-center py-10">
						<p className="text-gray-600">Loading products...</p>
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-gray-600">No products found</p>
					</div>
				) : (
					<div className="space-y-4 mb-8">
						{products.map((product) => (
							<div
								key={product.id}
								onClick={() => handleProductClick(product.id)}
								className="bg-white border border-gray-300 rounded p-6 cursor-pointer hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-xl font-semibold text-gray-800 flex-1">
										{product.title}
									</h3>
									{user?.id === product.userId && (
										<div className="flex gap-2">
											<button
												onClick={(e) => handleEditProduct(e, product.id)}
												className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
												title="Edit product"
											>
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
												</svg>
											</button>
											<button
												onClick={(e) =>
													handleOpenDeleteModal(
														e,
														product.id,
														product.title || "Untitled"
													)
												}
												className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
												title="Delete product"
											>
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
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
												{formatRentalPrice(
													product.rentalPrice,
													product.rentUnit
												)}
											</span>
										</>
									)}
								</div>

								<p className="text-gray-700 mb-4 line-clamp-2">
									{product.description}
								</p>

								<div className="flex justify-between items-center text-xs text-gray-500">
									<span>Date posted: {formatDate(product.createdAt)}</span>
								</div>
							</div>
						))}
					</div>
				)}
				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-2">
						<button
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							← Previous
						</button>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-4 py-2 border rounded font-semibold transition-colors ${
									currentPage === page
										? "bg-indigo-600 text-white border-indigo-600"
										: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
								}`}
							>
								{page}
							</button>
						))}

						<button
							onClick={() =>
								setCurrentPage(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
							className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Next →
						</button>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={deleteModal.isOpen}
				title="Delete Product"
				message={`Are you sure you want to delete "${deleteModal.productTitle}"? This action cannot be undone.`}
				onClose={handleCloseDeleteModal}
				primaryAction={{
					label: "Delete",
					onClick: handleConfirmDelete,
					isLoading: deleteModal.isDeleting,
					variant: "danger",
				}}
				secondaryAction={{
					label: "Cancel",
					onClick: handleCloseDeleteModal,
				}}
				maxWidth="sm"
			/>
		</div>
	);
};
