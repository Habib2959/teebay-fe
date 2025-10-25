export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	name: string;
	createdAt: string;
}

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

export interface AuthPayload {
	user: User;
	token: string;
}

export interface RegisterInput {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface UpdateProfileInput {
	firstName?: string;
	lastName?: string;
	phone?: string;
	address?: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (data: RegisterInput) => Promise<void>;
	logout: () => void;
}
