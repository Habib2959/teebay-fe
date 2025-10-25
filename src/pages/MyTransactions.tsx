import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { client } from "../apollo/client";
import { GET_ME } from "../graphql/queries";

interface BoughtProduct {
	id: string;
	product: {
		id: string;
		title: string;
		description: string;
		categories: { id: string; name: string }[];
		purchasePrice: number;
		createdAt: string;
	};
	price: number;
	createdAt: string;
}

interface SoldProduct {
	id: string;
	product: {
		id: string;
		title: string;
		description: string;
		categories: { id: string; name: string }[];
		purchasePrice: number;
		createdAt: string;
	};
	price: number;
	createdAt: string;
}

interface RentedProduct {
	id: string;
	product: {
		id: string;
		title: string;
		description: string;
		categories: { id: string; name: string }[];
		rentalPrice: number;
		rentUnit: string;
		createdAt: string;
	};
	startDate: string;
	endDate: string;
	rentalPrice: number;
	status: string;
	createdAt: string;
}

interface LentProduct {
	id: string;
	product: {
		id: string;
		title: string;
		description: string;
		categories: { id: string; name: string }[];
		rentalPrice: number;
		rentUnit: string;
		createdAt: string;
	};
	startDate: string;
	endDate: string;
	rentalPrice: number;
	status: string;
	createdAt: string;
}

type TabType = "bought" | "sold" | "borrowed" | "lent";

export const MyTransactions: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("bought");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [boughtProducts, setBoughtProducts] = useState<BoughtProduct[]>([]);
	const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
	const [rentedProducts, setRentedProducts] = useState<RentedProduct[]>([]);
	const [lentProducts, setLentProducts] = useState<LentProduct[]>([]);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}
		fetchTransactions();
	}, [user, navigate]);

	const fetchTransactions = async () => {
		try {
			setIsLoading(true);
			setError("");

			// TODO: Implement GraphQL queries to fetch transaction data
			// For now, we'll set empty arrays as placeholder
			setBoughtProducts([]);
			setSoldProducts([]);
			setRentedProducts([]);
			setLentProducts([]);
		} catch (err) {
			setError("Failed to load transactions. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const formatPrice = (price?: number) => {
		if (!price) return "-";
		return `$${price.toFixed(2)}`;
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatRentalPrice = (price?: number, unit?: string) => {
		if (!price || !unit) return "-";
		const unitLabel = unit.toLowerCase();
		return `$${price} per ${unitLabel}`;
	};

	const renderEmptyState = (tabName: string) => (
		<div className="text-center py-16">
			<p className="text-gray-500 text-lg">No {tabName} products yet</p>
		</div>
	);

	const renderProductCard = (
		item: BoughtProduct | SoldProduct | RentedProduct | LentProduct,
		type: "buy" | "sell" | "rent"
	) => {
		if (type === "buy" || type === "sell") {
			const product = item as BoughtProduct | SoldProduct;
			return (
				<div key={item.id} className="border border-gray-300 rounded p-4 mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						{product.product.title}
					</h3>
					<p className="text-sm text-gray-600 mt-1">
						Categories:{" "}
						<span className="font-medium">
							{product.product.categories.map((c) => c.name).join(", ") || "-"}
						</span>
					</p>
					<p className="text-sm text-gray-600 mt-1">
						Price:{" "}
						<span className="font-medium">{formatPrice(product.price)}</span>
					</p>
					<p className="text-gray-700 text-sm mt-3 line-clamp-2">
						{product.product.description}
					</p>
					<button
						onClick={() => navigate(`/product/${product.product.id}`)}
						className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
					>
						More Details →
					</button>
				</div>
			);
		} else {
			const rental = item as RentedProduct | LentProduct;
			return (
				<div key={item.id} className="border border-gray-300 rounded p-4 mb-4">
					<h3 className="text-lg font-semibold text-gray-800">
						{rental.product.title}
					</h3>
					<p className="text-sm text-gray-600 mt-1">
						Categories:{" "}
						<span className="font-medium">
							{rental.product.categories.map((c) => c.name).join(", ") || "-"}
						</span>
					</p>
					<p className="text-sm text-gray-600 mt-1">
						Rental Price:{" "}
						<span className="font-medium">
							{formatRentalPrice(
								rental.product.rentalPrice,
								rental.product.rentUnit
							)}
						</span>
					</p>
					<p className="text-sm text-gray-600 mt-1">
						Period: {formatDate(rental.startDate)} -{" "}
						{formatDate(rental.endDate)}
					</p>
					<p className="text-sm text-gray-600 mt-1">
						Status:{" "}
						<span
							className={`font-medium ${
								rental.status === "ACTIVE"
									? "text-orange-600"
									: rental.status === "COMPLETED"
									? "text-green-600"
									: "text-gray-600"
							}`}
						>
							{rental.status}
						</span>
					</p>
					<p className="text-gray-700 text-sm mt-3 line-clamp-2">
						{rental.product.description}
					</p>
					<button
						onClick={() => navigate(`/product/${rental.product.id}`)}
						className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
					>
						More Details →
					</button>
				</div>
			);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="max-w-4xl mx-auto py-8 px-4">
				{/* Tabs */}
				<div className="bg-white border-b border-gray-300 rounded-t">
					<div className="flex">
						<button
							onClick={() => setActiveTab("bought")}
							className={`px-6 py-3 font-medium transition-colors border-b-2 ${
								activeTab === "bought"
									? "text-indigo-600 border-indigo-600"
									: "text-gray-600 border-transparent hover:text-indigo-600"
							}`}
						>
							Bought
						</button>
						<button
							onClick={() => setActiveTab("sold")}
							className={`px-6 py-3 font-medium transition-colors border-b-2 ${
								activeTab === "sold"
									? "text-indigo-600 border-indigo-600"
									: "text-gray-600 border-transparent hover:text-indigo-600"
							}`}
						>
							Sold
						</button>
						<button
							onClick={() => setActiveTab("borrowed")}
							className={`px-6 py-3 font-medium transition-colors border-b-2 ${
								activeTab === "borrowed"
									? "text-indigo-600 border-indigo-600"
									: "text-gray-600 border-transparent hover:text-indigo-600"
							}`}
						>
							Borrowed
						</button>
						<button
							onClick={() => setActiveTab("lent")}
							className={`px-6 py-3 font-medium transition-colors border-b-2 ${
								activeTab === "lent"
									? "text-indigo-600 border-indigo-600"
									: "text-gray-600 border-transparent hover:text-indigo-600"
							}`}
						>
							Lent
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="bg-white rounded-b shadow-lg p-6 mb-8">
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					{isLoading ? (
						<div className="text-center py-16">
							<p className="text-gray-500">Loading transactions...</p>
						</div>
					) : (
						<>
							{activeTab === "bought" &&
								(boughtProducts.length > 0
									? boughtProducts.map((item) => renderProductCard(item, "buy"))
									: renderEmptyState("bought"))}

							{activeTab === "sold" &&
								(soldProducts.length > 0
									? soldProducts.map((item) => renderProductCard(item, "sell"))
									: renderEmptyState("sold"))}

							{activeTab === "borrowed" &&
								(rentedProducts.length > 0
									? rentedProducts.map((item) =>
											renderProductCard(item, "rent")
									  )
									: renderEmptyState("borrowed"))}

							{activeTab === "lent" &&
								(lentProducts.length > 0
									? lentProducts.map((item) => renderProductCard(item, "rent"))
									: renderEmptyState("lent"))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};
