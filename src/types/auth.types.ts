// Authentication input types
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
