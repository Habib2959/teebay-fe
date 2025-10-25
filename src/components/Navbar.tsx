import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
				{/* Logo/Brand */}
				<div className="flex items-center">
					<h1
						className="text-indigo-600 text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
						onClick={() => navigate("/")}
					>
						TEEBAY
					</h1>
				</div>

				{/* Navigation Links */}
				<div className="flex items-center gap-8">
					{isAuthenticated ? (
						<>
							<button
								onClick={() => navigate("/")}
								className={`font-semibold transition-colors ${
									isActive("/")
										? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
										: "text-gray-700 hover:text-indigo-600"
								}`}
							>
								Products
							</button>
							<button
								onClick={() => navigate("/my-transactions")}
								className={`font-semibold transition-colors ${
									isActive("/my-transactions")
										? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
										: "text-gray-700 hover:text-indigo-600"
								}`}
							>
								My Transactions
							</button>
							<button
								onClick={handleLogout}
								className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => navigate("/login")}
								className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
							>
								Login
							</button>
							<button
								onClick={() => navigate("/signup")}
								className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
							>
								Sign Up
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
