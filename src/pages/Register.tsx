import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RegisterInput } from "../types/index";

interface RegisterFormInput extends RegisterInput {
	password_confirm?: string;
}

export const Register: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<RegisterFormInput>();
	const { register: registerUser, isLoading } = useAuth();
	const navigate = useNavigate();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const password = watch("password");

	const onSubmit = async (data: RegisterFormInput) => {
		try {
			setSubmitError(null);
			// Remove password_confirm before sending to backend
			const { password_confirm, ...registerData } = data;
			await registerUser(registerData as RegisterInput);
			navigate("/");
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: "Registration failed. Please try again."
			);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 px-5 py-8">
			<div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h1 className="text-center text-gray-800 text-2xl font-semibold mb-7 tracking-wide">
					SIGN UP
				</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1">
							<input
								type="text"
								placeholder="First Name"
								{...register("firstName", {
									required: "First name is required",
								})}
								className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
									errors.firstName
										? "border-red-500 bg-red-50"
										: "border-gray-300"
								}`}
							/>
							{errors.firstName && (
								<span className="text-red-500 text-xs font-medium">
									{errors.firstName.message}
								</span>
							)}
						</div>

						<div className="flex flex-col gap-1">
							<input
								type="text"
								placeholder="Last Name"
								{...register("lastName", {
									required: "Last name is required",
								})}
								className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
									errors.lastName
										? "border-red-500 bg-red-50"
										: "border-gray-300"
								}`}
							/>
							{errors.lastName && (
								<span className="text-red-500 text-xs font-medium">
									{errors.lastName.message}
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<input
							type="text"
							placeholder="Address"
							{...register("address", {
								required: "Address is required",
							})}
							className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
								errors.address ? "border-red-500 bg-red-50" : "border-gray-300"
							}`}
						/>
						{errors.address && (
							<span className="text-red-500 text-xs font-medium">
								{errors.address.message}
							</span>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
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
								type="tel"
								placeholder="Phone Number"
								{...register("phone", {
									required: "Phone number is required",
									pattern: {
										value: /^[0-9+\-\s()]*$/,
										message: "Invalid phone number",
									},
								})}
								className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
									errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
								}`}
							/>
							{errors.phone && (
								<span className="text-red-500 text-xs font-medium">
									{errors.phone.message}
								</span>
							)}
						</div>
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

					<div className="flex flex-col gap-1">
						<input
							type="password"
							placeholder="Confirm Password"
							{...register("password_confirm", {
								required: "Please confirm your password",
								validate: (value) =>
									value === password || "Passwords do not match",
							})}
							className={`px-4 py-3 border rounded-md text-sm font-medium transition-all duration-300 bg-gray-50 text-black placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
								errors.password_confirm
									? "border-red-500 bg-red-50"
									: "border-gray-300"
							}`}
						/>
						{errors.password_confirm && (
							<span className="text-red-500 text-xs font-medium">
								{errors.password_confirm.message}
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
						{isLoading ? "REGISTERING..." : "REGISTER"}
					</button>
				</form>

				<div className="text-center mt-5 text-sm text-gray-700">
					<span>Already have an account?</span>
					<Link
						to="/login"
						className="ml-1 text-indigo-600 font-semibold transition-colors duration-300 hover:text-indigo-700 hover:underline"
					>
						Sign In
					</Link>
				</div>
			</div>
		</div>
	);
};
