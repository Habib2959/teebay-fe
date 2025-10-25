import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_ALL_PRODUCTS } from "../graphql/queries";
import { client } from "../apollo/client";
import { Product } from "../types/index";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/Modal";
import { ProductCard } from "../components/ProductCard";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutations";

const ITEMS_PER_PAGE = 10;

export const Products: React.FC = () => {
	const navigate = useNavigate();
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
							<ProductCard
								key={product.id}
								product={product}
								showActions={true}
								onEdit={(productId) =>
									handleEditProduct(new MouseEvent("click") as any, productId)
								}
								onDelete={(productId, productTitle) =>
									handleOpenDeleteModal(
										new MouseEvent("click") as any,
										productId,
										productTitle
									)
								}
							/>
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
