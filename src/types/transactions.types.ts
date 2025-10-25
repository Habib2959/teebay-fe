// Types for transaction-related pages
export interface BoughtProduct {
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

export interface SoldProduct {
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

export interface RentedProduct {
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

export interface LentProduct {
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

export type TabType = "bought" | "sold" | "borrowed" | "lent";
