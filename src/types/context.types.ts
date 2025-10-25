import type { User } from "./user.types";
import type { RegisterInput } from "./auth.types";

// API response types
export interface AuthPayload {
	user: User;
	token: string;
}

// Context type
export interface AuthContextType {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (data: RegisterInput) => Promise<void>;
	logout: () => void;
}
