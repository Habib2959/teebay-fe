// Category type (can be used for products, filters, etc.)
export interface Category {
	id: string;
	name: string;
	createdAt: string;
}

// Product type with all related fields
export interface Product {
	id: string;
	title?: string;
	description?: string;
	categories: Category[];
	purchasePrice?: number;
	rentalPrice?: number;
	rentUnit?: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
	status: "DRAFT" | "PUBLISHED";
	userId: string;
	createdAt: string;
	updatedAt: string;
	isBought?: boolean;
	isCurrentlyRented?: boolean;
}
