import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "../apollo/client";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { GET_PRODUCT, GET_CATEGORIES } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Select } from "../components/Select";
import { MultiSelect } from "../components/MultiSelect";

interface FormData {
	title: string;
	description: string;
	categoryIds: string[];
	purchasePrice: string;
	rentalPrice: string;
	rentUnit: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
}

interface Category {
	id: string;
	name: string;
	createdAt: string;
}

export const EditProduct: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		categoryIds: [],
		purchasePrice: "",
		rentalPrice: "",
		rentUnit: "DAILY",
	});
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			fetchProductAndCategories();
		}
	}, [id]);

	const fetchProductAndCategories = async () => {
		try {
			setPageLoading(true);
			// Fetch product
			const productResult = await client.query({
				query: GET_PRODUCT,
				variables: { id },
			});

			const product = (productResult.data as any).product;
			if (product) {
				setFormData({
					title: product.title || "",
					description: product.description || "",
					categoryIds: product.categories.map((cat: any) => cat.id) || [],
					purchasePrice: product.purchasePrice
						? String(product.purchasePrice)
						: "",
					rentalPrice: product.rentalPrice ? String(product.rentalPrice) : "",
					rentUnit: product.rentUnit || "DAILY",
				});
			}

			// Fetch categories
			const categoriesResult = await client.query({ query: GET_CATEGORIES });
			setCategories((categoriesResult.data as any).categories || []);
		} catch (error) {
			console.error("Error fetching product:", error);
			setError("Failed to load product details");
		} finally {
			setPageLoading(false);
			setCategoriesLoading(false);
		}
	};

	const validateForm = (): boolean => {
		if (!formData.title.trim()) {
			alert("Please enter a product title");
			return false;
		}
		if (formData.categoryIds.length === 0) {
			alert("Please select at least one category");
			return false;
		}
		if (!formData.description.trim()) {
			alert("Please enter a product description");
			return false;
		}
		if (!formData.purchasePrice) {
			alert("Please enter a purchase price");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			setUpdateLoading(true);
			const response = await client.mutate({
				mutation: UPDATE_PRODUCT_MUTATION,
				variables: {
					input: {
						id,
						title: formData.title,
						description: formData.description,
						categoryIds: formData.categoryIds,
						purchasePrice: parseFloat(formData.purchasePrice) || null,
						rentalPrice: formData.rentalPrice
							? parseFloat(formData.rentalPrice)
							: null,
						rentUnit: formData.rentalPrice ? formData.rentUnit : null,
					},
				},
			});

			if ((response.data as any)?.updateProduct?.success) {
				alert("Product updated successfully!");
				// Refetch products cache to show updated product
				await client.refetchQueries({
					include: ["GetAllProducts", "GetProduct"],
				});
				navigate("/");
			}
		} catch (error) {
			console.error("Error updating product:", error);
			alert(
				error instanceof Error ? error.message : "Failed to update product"
			);
		} finally {
			setUpdateLoading(false);
		}
	};

	if (pageLoading) {
		return (
			<div className="min-h-screen bg-gray-100">
				<Navbar />
				<div className="max-w-4xl mx-auto p-6">
					<div className="text-center py-10">
						<p className="text-gray-600">Loading product details...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-100">
				<Navbar />
				<div className="max-w-4xl mx-auto p-6">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
						<p className="text-red-600">{error}</p>
						<button
							onClick={() => navigate("/")}
							className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />

			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Edit product</h1>
				</div>

				{/* Form Container */}
				<div className="bg-white rounded-lg shadow-md p-8">
					{/* Title */}
					<div className="mb-6">
						<label className="block text-gray-700 font-semibold mb-2">
							Title
						</label>
						<TextInput
							placeholder="Enter product title"
							value={formData.title}
							onChange={(value) => setFormData({ ...formData, title: value })}
						/>
					</div>

					{/* Categories */}
					<div className="mb-6">
						<label className="block text-gray-700 font-semibold mb-2">
							Categories
						</label>
						{categoriesLoading ? (
							<p className="text-gray-600">Loading categories...</p>
						) : (
							<MultiSelect
								label=""
								placeholder="Select one or more categories..."
								value={formData.categoryIds}
								onChange={(value) =>
									setFormData({
										...formData,
										categoryIds: value,
									})
								}
								options={categories.map((cat) => ({
									value: cat.id,
									label: cat.name,
								}))}
							/>
						)}
					</div>

					{/* Description */}
					<div className="mb-6">
						<label className="block text-gray-700 font-semibold mb-2">
							Description
						</label>
						<TextArea
							placeholder="Enter product description"
							value={formData.description}
							onChange={(value) =>
								setFormData({ ...formData, description: value })
							}
							rows={6}
						/>
					</div>

					{/* Price and Rent */}
					<div className="mb-6 grid grid-cols-2 gap-6">
						{/* Purchase Price */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Price
							</label>
							<TextInput
								type="number"
								placeholder="0.00"
								value={formData.purchasePrice}
								onChange={(value) =>
									setFormData({
										...formData,
										purchasePrice: value,
									})
								}
							/>
						</div>

						{/* Rental Price */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Rent
							</label>
							<div className="flex gap-3">
								<div className="flex-1">
									<TextInput
										type="number"
										placeholder="0.00"
										value={formData.rentalPrice}
										onChange={(value) =>
											setFormData({
												...formData,
												rentalPrice: value,
											})
										}
									/>
								</div>
								<div className="w-32">
									<Select
										value={formData.rentUnit}
										onChange={(value) =>
											setFormData({
												...formData,
												rentUnit: value as
													| "HOURLY"
													| "DAILY"
													| "WEEKLY"
													| "MONTHLY",
											})
										}
										options={[
											{ value: "HOURLY", label: "per hr" },
											{ value: "DAILY", label: "per day" },
											{ value: "WEEKLY", label: "per week" },
											{ value: "MONTHLY", label: "per month" },
										]}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Edit Product Button */}
					<div className="flex justify-end">
						<button
							onClick={handleSubmit}
							disabled={updateLoading}
							className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{updateLoading ? "Updating..." : "Edit Product"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
