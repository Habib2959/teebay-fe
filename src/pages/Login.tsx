import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginInput } from "../types/index";

export const Login: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>();
	const { login, isLoading } = useAuth();
	const navigate = useNavigate();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const onSubmit = async (data: LoginInput) => {
		try {
			setSubmitError(null);
			await login(data.email, data.password);
			navigate("/");
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: "Login failed. Please try again."
			);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 px-5">
			<div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md">
				<h1 className="text-center text-gray-800 text-2xl font-semibold mb-7 tracking-wide">
					SIGN IN
				</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1">
						<input
							type="email"
							placeholder="Email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							})}
							className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
								errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
							}`}
						/>
						{errors.email && (
							<span className="text-red-500 text-xs font-medium">
								{errors.email.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<input
							type="password"
							placeholder="Password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters",
								},
							})}
							className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
								errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
							}`}
						/>
						{errors.password && (
							<span className="text-red-500 text-xs font-medium">
								{errors.password.message}
							</span>
						)}
					</div>

					{submitError && (
						<div className="bg-red-100 border-l-4 border-red-500 text-red-700 text-sm p-3 rounded">
							{submitError}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="mt-2 px-5 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-md text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isLoading ? "LOGGING IN..." : "LOGIN"}
					</button>
				</form>

				<div className="text-center mt-5 text-sm text-gray-700">
					<span>Don't have an account?</span>
					<Link
						to="/signup"
						className="ml-1 text-indigo-600 font-semibold transition-colors duration-300 hover:text-indigo-700 hover:underline"
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};
