import type { RegisterInput } from "./auth.types";

// Types for registration page
export interface RegisterFormInput extends RegisterInput {
	password_confirm?: string;
}
