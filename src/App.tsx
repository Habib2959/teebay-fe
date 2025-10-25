import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { AddProduct } from "./pages/AddProduct";
import { EditProduct } from "./pages/EditProduct";
import { ProductDetail } from "./pages/ProductDetail";
import { MyTransactions } from "./pages/MyTransactions";
import { client } from "./apollo/client";

function App() {
	return (
		<ApolloProvider client={client}>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Register />} />
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Products />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/add-product"
							element={
								<ProtectedRoute>
									<AddProduct />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/products/:id/edit"
							element={
								<ProtectedRoute>
									<EditProduct />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/products/:id"
							element={
								<ProtectedRoute>
									<ProductDetail />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/my-transactions"
							element={
								<ProtectedRoute>
									<MyTransactions />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<Home />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</AuthProvider>
			</Router>
		</ApolloProvider>
	);
}

export default App;
