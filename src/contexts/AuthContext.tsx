import React, { createContext, useCallback, useEffect, useState } from "react";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import { AuthContextType, RegisterInput, User } from "../types/index";
import { client } from "../apollo/client";

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize from localStorage
	useEffect(() => {
		const initializeAuth = async () => {
			const storedToken = localStorage.getItem("authToken");
			if (storedToken) {
				setToken(storedToken);
				try {
					// Fetch current user to restore session
					const { data } = await client.query({
						query: GET_ME,
					});
					if ((data as any)?.me) {
						setUser((data as any).me);
					}
				} catch (error) {
					console.error("Failed to restore session:", error);
					localStorage.removeItem("authToken");
					setToken(null);
				}
			}
			setIsLoading(false);
		};
		initializeAuth();
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		try {
			setIsLoading(true);
			const { data } = await client.mutate({
				mutation: LOGIN_MUTATION,
				variables: {
					email,
					password,
				},
			});

			const { user: userData, token: newToken } = (data as any).login;
			setToken(newToken);
			setUser(userData);
			localStorage.setItem("authToken", newToken);

			// Write user to cache
			client.cache.writeQuery({
				query: GET_ME,
				data: {
					me: userData,
				},
			});
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const register = useCallback(async (data: RegisterInput) => {
		try {
			setIsLoading(true);
			const { data: responseData } = await client.mutate({
				mutation: REGISTER_MUTATION,
				variables: {
					data,
				},
			});

			const { user: userData, token: newToken } = (responseData as any)
				.register;
			setToken(newToken);
			setUser(userData);
			localStorage.setItem("authToken", newToken);

			// Write user to cache
			client.cache.writeQuery({
				query: GET_ME,
				data: {
					me: userData,
				},
			});
		} catch (error) {
			console.error("Registration failed:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("authToken");

		// Clear user from cache
		client.cache.evict({ fieldName: "me" });
		client.cache.gc();
	}, []);

	const value: AuthContextType = {
		user,
		token,
		isLoading,
		isAuthenticated: !!token && !!user,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
