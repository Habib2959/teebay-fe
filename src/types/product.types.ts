// Types for product-related pages
export interface FormData {
	title: string;
	description: string;
	categoryIds: string[];
	purchasePrice: string;
	rentalPrice: string;
	rentUnit: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
}
