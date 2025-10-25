import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { client } from "../apollo/client";
import {
	GET_MY_BUYS,
	GET_MY_SALES,
	GET_MY_RENTALS,
	GET_MY_LENDINGS,
} from "../graphql/queries";

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

			const [buysResult, salesResult, rentalsResult, lendingsResult] =
				await Promise.all([
					client.query({
						query: GET_MY_BUYS,
						variables: { status: null },
					}),
					client.query({
						query: GET_MY_SALES,
					}),
					client.query({
						query: GET_MY_RENTALS,
						variables: { status: null },
					}),
					client.query({
						query: GET_MY_LENDINGS,
					}),
				]);

			setBoughtProducts((buysResult.data as any).myBuys || []);
			setSoldProducts((salesResult.data as any).mySales || []);
			setRentedProducts((rentalsResult.data as any).myRentals || []);
			setLentProducts((lendingsResult.data as any).myLendings || []);
		} catch (err) {
			setError("Failed to load transactions. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
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
				<ProductCard
					key={item.id}
					product={product.product as any}
					showActions={false}
				/>
			);
		} else {
			const rental = item as RentedProduct | LentProduct;
			return (
				<ProductCard
					key={item.id}
					product={rental.product as any}
					showActions={false}
					period={{
						startDate: rental.startDate,
						endDate: rental.endDate,
						status: rental.status,
					}}
				/>
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
