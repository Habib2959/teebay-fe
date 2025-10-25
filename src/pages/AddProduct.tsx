import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../apollo/client";
import { CREATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { GET_CATEGORIES } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Select } from "../components/Select";
import { MultiSelect } from "../components/MultiSelect";
import { FormData } from "../types/product.types";
import { Category } from "../types";

export const AddProduct: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
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
	const [createLoading, setCreateLoading] = useState(false);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const result = await client.query({ query: GET_CATEGORIES });
			setCategories((result.data as any).categories || []);
		} catch (error) {
			console.error("Error fetching categories:", error);
		} finally {
			setCategoriesLoading(false);
		}
	};

	const handleNext = () => {
		if (validateStep()) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		setCurrentStep(currentStep - 1);
	};

	const validateStep = (): boolean => {
		switch (currentStep) {
			case 1:
				if (!formData.title.trim()) {
					alert("Please enter a product title");
					return false;
				}
				return true;
			case 2:
				if (formData.categoryIds.length === 0) {
					alert("Please select at least one category");
					return false;
				}
				return true;
			case 3:
				if (!formData.description.trim()) {
					alert("Please enter a product description");
					return false;
				}
				return true;
			case 4:
				if (!formData.purchasePrice) {
					alert("Please enter a purchase price");
					return false;
				}
				return true;
			default:
				return true;
		}
	};

	const handleSubmit = async () => {
		try {
			setCreateLoading(true);
			const response = await client.mutate({
				mutation: CREATE_PRODUCT_MUTATION,
				variables: {
					input: {
						title: formData.title,
						description: formData.description,
						categoryIds: formData.categoryIds,
						purchasePrice: parseFloat(formData.purchasePrice) || null,
						rentalPrice: formData.rentalPrice
							? parseFloat(formData.rentalPrice)
							: null,
						rentUnit: formData.rentalPrice ? formData.rentUnit : null,
						status: "PUBLISHED",
					},
				},
			});

			if ((response.data as any)?.createProduct?.success) {
				alert("Product created successfully!");
				// Refetch products cache to show new product
				await client.refetchQueries({ include: ["GetAllProducts"] });
				navigate("/");
			}
		} catch (error) {
			console.error("Error creating product:", error);
			alert(
				error instanceof Error ? error.message : "Failed to create product"
			);
		} finally {
			setCreateLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />

			<div className="max-w-2xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Create product</h1>
				</div>

				{/* Step 1: Title */}
				{currentStep === 1 && (
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Select a title for your product
						</h2>
						<TextInput
							placeholder="Enter product title"
							value={formData.title}
							onChange={(value) => setFormData({ ...formData, title: value })}
						/>
						<div className="flex justify-end gap-3 mt-8">
							<button
								onClick={handleNext}
								className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{/* Step 2: Categories */}
				{currentStep === 2 && (
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Select categories
						</h2>
						{categoriesLoading ? (
							<p className="text-gray-600">Loading categories...</p>
						) : (
							<>
								<MultiSelect
									label="Categories"
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
								<div className="flex justify-between gap-3 mt-8">
									<button
										onClick={handleBack}
										className="px-6 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition-colors"
									>
										Back
									</button>
									<button
										onClick={handleNext}
										className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
									>
										Next
									</button>
								</div>
							</>
						)}
					</div>
				)}

				{/* Step 3: Description */}
				{currentStep === 3 && (
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Add description
						</h2>
						<TextArea
							placeholder="Enter product description"
							value={formData.description}
							onChange={(value) =>
								setFormData({ ...formData, description: value })
							}
							rows={6}
						/>
						<div className="flex justify-between gap-3 mt-8">
							<button
								onClick={handleBack}
								className="px-6 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition-colors"
							>
								Back
							</button>
							<button
								onClick={handleNext}
								className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{/* Step 4: Pricing */}
				{currentStep === 4 && (
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Set pricing
						</h2>

						{/* Purchase Price */}
						<div className="mb-6">
							<TextInput
								label="Selling Price"
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
						<div className="mb-6">
							<label className="block text-gray-700 font-semibold mb-2">
								Rental Price (Optional)
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
								<div className="w-40">
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
											{ value: "HOURLY", label: "Hourly" },
											{ value: "DAILY", label: "Daily" },
											{ value: "WEEKLY", label: "Weekly" },
											{ value: "MONTHLY", label: "Monthly" },
										]}
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-between gap-3 mt-8">
							<button
								onClick={handleBack}
								className="px-6 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition-colors"
							>
								Back
							</button>
							<button
								onClick={handleNext}
								className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{/* Step 5: Summary */}
				{currentStep === 5 && (
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Review your product
						</h2>

						{/* Summary Display */}
						<div className="space-y-4 mb-8 p-6 bg-gray-50 rounded-lg">
							<div>
								<p className="text-gray-600 font-semibold">Title</p>
								<p className="text-gray-800">{formData.title}</p>
							</div>

							<div>
								<p className="text-gray-600 font-semibold">Categories</p>
								<p className="text-gray-800">
									{formData.categoryIds
										.map((id) => categories.find((c) => c.id === id)?.name)
										.join(", ")}
								</p>
							</div>

							<div>
								<p className="text-gray-600 font-semibold">Description</p>
								<p className="text-gray-800">{formData.description}</p>
							</div>

							<div>
								<p className="text-gray-600 font-semibold">Selling Price</p>
								<p className="text-gray-800">${formData.purchasePrice}</p>
							</div>

							{formData.rentalPrice && (
								<div>
									<p className="text-gray-600 font-semibold">Rental Price</p>
									<p className="text-gray-800">
										${formData.rentalPrice} per{" "}
										{formData.rentUnit.toLowerCase()}
									</p>
								</div>
							)}
						</div>

						<div className="flex justify-between gap-3">
							<button
								onClick={handleBack}
								className="px-6 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition-colors"
							>
								Back
							</button>
							<button
								onClick={handleSubmit}
								disabled={createLoading}
								className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors disabled:opacity-50"
							>
								{createLoading ? "Publishing..." : "Publish"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
