import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { client } from "../apollo/client";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { GET_PRODUCT, GET_CATEGORIES } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import { TextInput } from "../components/TextInput";
import { TextArea } from "../components/TextArea";
import { Select } from "../components/Select";
import { MultiSelect } from "../components/MultiSelect";
import { FormError } from "../components/FormError";

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
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			title: "",
			description: "",
			categoryIds: [],
			purchasePrice: "",
			rentalPrice: "",
			rentUnit: "DAILY",
		},
		mode: "onBlur",
	});
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
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
				reset({
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

	const onSubmit = async (data: FormData) => {
		if (!data.title.trim()) {
			alert("Please enter a product title");
			return;
		}
		if (data.categoryIds.length === 0) {
			alert("Please select at least one category");
			return;
		}
		if (!data.description.trim()) {
			alert("Please enter a product description");
			return;
		}
		if (!data.purchasePrice) {
			alert("Please enter a purchase price");
			return;
		}

		try {
			const response = await client.mutate({
				mutation: UPDATE_PRODUCT_MUTATION,
				variables: {
					input: {
						id,
						title: data.title,
						description: data.description,
						categoryIds: data.categoryIds,
						purchasePrice: parseFloat(data.purchasePrice) || null,
						rentalPrice: data.rentalPrice ? parseFloat(data.rentalPrice) : null,
						rentUnit: data.rentalPrice ? data.rentUnit : null,
					},
				},
			});

			if ((response.data as any)?.updateProduct?.success) {
				alert("Product updated successfully!");
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
					<form onSubmit={handleSubmit(onSubmit)}>
						{/* Title */}
						<div className="mb-6">
							<label className="block text-gray-700 font-semibold mb-2">
								Title
							</label>
							<Controller
								name="title"
								control={control}
								rules={{ required: "Title is required" }}
								render={({ field }) => (
									<>
										<TextInput
											placeholder="Enter product title"
											value={field.value}
											onChange={field.onChange}
										/>
										<FormError error={errors.title} />
									</>
								)}
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
								<>
									<Controller
										name="categoryIds"
										control={control}
										rules={{
											required: "Please select at least one category",
										}}
										render={({ field }) => (
											<MultiSelect
												label=""
												placeholder="Select one or more categories..."
												value={field.value}
												onChange={field.onChange}
												options={categories.map((cat) => ({
													value: cat.id,
													label: cat.name,
												}))}
											/>
										)}
									/>
									<FormError error={errors.categoryIds} />
								</>
							)}
						</div>

						{/* Description */}
						<div className="mb-6">
							<label className="block text-gray-700 font-semibold mb-2">
								Description
							</label>
							<Controller
								name="description"
								control={control}
								rules={{ required: "Description is required" }}
								render={({ field }) => (
									<>
										<TextArea
											placeholder="Enter product description"
											value={field.value}
											onChange={field.onChange}
											rows={6}
										/>
										<FormError error={errors.description} />
									</>
								)}
							/>
						</div>

						{/* Price and Rent */}
						<div className="mb-6 grid grid-cols-2 gap-6">
							{/* Purchase Price */}
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									Price
								</label>
								<Controller
									name="purchasePrice"
									control={control}
									rules={{ required: "Price is required" }}
									render={({ field }) => (
										<>
											<TextInput
												type="number"
												placeholder="0.00"
												value={field.value}
												onChange={field.onChange}
											/>
											<FormError error={errors.purchasePrice} />
										</>
									)}
								/>
							</div>

							{/* Rental Price */}
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									Rent
								</label>
								<div className="flex gap-3">
									<div className="flex-1">
										<Controller
											name="rentalPrice"
											control={control}
											render={({ field }) => (
												<>
													<TextInput
														type="number"
														placeholder="0.00"
														value={field.value}
														onChange={field.onChange}
													/>
													<FormError error={errors.rentalPrice} />
												</>
											)}
										/>
									</div>
									<div className="w-32">
										<Controller
											name="rentUnit"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value}
													onChange={field.onChange}
													options={[
														{ value: "HOURLY", label: "per hr" },
														{ value: "DAILY", label: "per day" },
														{ value: "WEEKLY", label: "per week" },
														{ value: "MONTHLY", label: "per month" },
													]}
												/>
											)}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Edit Product Button */}
						<div className="flex justify-end">
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Updating..." : "Edit Product"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
