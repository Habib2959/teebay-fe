import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleGoToProducts = () => {
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-5">
			<div className="flex justify-between items-center max-w-4xl mx-auto mb-10 bg-white p-5 rounded-lg shadow-lg">
				<h1 className="text-gray-800 text-4xl font-semibold">
					Welcome to TeeBay
				</h1>
				<button
					onClick={handleLogout}
					className="px-6 py-3 bg-red-500 text-white rounded-md text-sm font-semibold transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5"
				>
					Logout
				</button>
			</div>

			{user && (
				<div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-8">
					<h2 className="text-gray-800 text-2xl font-semibold mb-6 border-b-2 border-indigo-600 pb-3">
						User Profile
					</h2>
					<div className="flex flex-col gap-4 mb-6">
						<div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
							<span className="font-semibold text-gray-700 min-w-24">
								Name:
							</span>
							<span className="text-gray-800">
								{user.firstName} {user.lastName}
							</span>
						</div>
						<div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
							<span className="font-semibold text-gray-700 min-w-24">
								Email:
							</span>
							<span className="text-gray-800">{user.email}</span>
						</div>
						<div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
							<span className="font-semibold text-gray-700 min-w-24">
								Phone:
							</span>
							<span className="text-gray-800">{user.phone}</span>
						</div>
						<div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
							<span className="font-semibold text-gray-700 min-w-24">
								Address:
							</span>
							<span className="text-gray-800">{user.address}</span>
						</div>
					</div>
					<button
						onClick={handleGoToProducts}
						className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
					>
						View My Products
					</button>
				</div>
			)}
		</div>
	);
};
