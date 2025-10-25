import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/login");
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
				<div className="flex items-center gap-6">
					{isAuthenticated ? (
						<>
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
								className="px-4 py-2 text-gray-700 font-semibold hover:text-indigo-600 transition-colors"
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
