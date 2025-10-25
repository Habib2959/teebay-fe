import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				email
				firstName
				lastName
				phone
				address
				createdAt
				updatedAt
			}
			token
		}
	}
`;

export const REGISTER_MUTATION = gql`
	mutation Register($data: RegisterInput!) {
		register(data: $data) {
			user {
				id
				email
				firstName
				lastName
				phone
				address
				createdAt
				updatedAt
			}
			token
		}
	}
`;

export const UPDATE_PROFILE_MUTATION = gql`
	mutation UpdateProfile($data: UpdateProfileInput!) {
		updateProfile(data: $data) {
			id
			email
			firstName
			lastName
			phone
			address
			createdAt
			updatedAt
		}
	}
`;

export const CREATE_PRODUCT_MUTATION = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input) {
			success
			message
			product {
				id
				title
				description
				categories {
					id
					name
				}
				purchasePrice
				rentalPrice
				rentUnit
				status
				userId
				createdAt
				updatedAt
			}
		}
	}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
	mutation UpdateProduct($input: UpdateProductInput!) {
		updateProduct(input: $input) {
			success
			message
			product {
				id
				title
				description
				categories {
					id
					name
				}
				purchasePrice
				rentalPrice
				rentUnit
				status
				userId
				createdAt
				updatedAt
			}
		}
	}
`;

export const DELETE_PRODUCT_MUTATION = gql`
	mutation DeleteProduct($id: String!) {
		deleteProduct(id: $id) {
			success
			message
		}
	}
`;

export const BUY_PRODUCT_MUTATION = gql`
	mutation BuyProduct($input: BuyProductInput!) {
		buyProduct(input: $input) {
			id
			productId
			product {
				id
				title
				description
				purchasePrice
			}
			buyerId
			sellerId
			price
			status
			createdAt
			updatedAt
		}
	}
`;
