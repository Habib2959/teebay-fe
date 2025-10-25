import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ProtectedRouteProps } from "../types/component.types";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};
