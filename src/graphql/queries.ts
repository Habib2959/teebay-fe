import { gql } from "@apollo/client";

export const GET_ME = gql`
	query GetMe {
		me {
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

export const GET_USER = gql`
	query GetUser($id: ID!) {
		user(id: $id) {
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

export const GET_ALL_PRODUCTS = gql`
	query GetAllProducts($limit: Int, $offset: Int, $status: ProductStatus) {
		allProducts(limit: $limit, offset: $offset, status: $status) {
			success
			products {
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
				isBought
				isCurrentlyRented
			}
			total
		}
	}
`;

export const GET_USER_PRODUCTS = gql`
	query GetUserProducts($userId: String!) {
		getUserProducts(userId: $userId) {
			success
			products {
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
			total
		}
	}
`;

export const GET_PRODUCT = gql`
	query GetProduct($id: String!) {
		product(id: $id) {
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
			isBought
			isCurrentlyRented
		}
	}
`;

export const GET_CATEGORIES = gql`
	query GetCategories {
		categories {
			id
			name
			createdAt
		}
	}
`;

export const GET_MY_BUYS = gql`
	query GetMyBuys($status: BuyStatus) {
		myBuys(status: $status) {
			id
			product {
				id
				title
				description
				categories {
					id
					name
				}
				purchasePrice
				createdAt
			}
			price
			status
			createdAt
		}
	}
`;

export const GET_MY_SALES = gql`
	query GetMySales {
		mySales {
			id
			product {
				id
				title
				description
				categories {
					id
					name
				}
				purchasePrice
				createdAt
			}
			price
			status
			createdAt
		}
	}
`;

export const GET_MY_RENTALS = gql`
	query GetMyRentals($status: RentStatus) {
		myRentals(status: $status) {
			id
			product {
				id
				title
				description
				categories {
					id
					name
				}
				rentalPrice
				rentUnit
				createdAt
			}
			startDate
			endDate
			rentalPrice
			status
			createdAt
		}
	}
`;

export const GET_MY_LENDINGS = gql`
	query GetMyLendings {
		myLendings {
			id
			product {
				id
				title
				description
				categories {
					id
					name
				}
				rentalPrice
				rentUnit
				createdAt
			}
			startDate
			endDate
			rentalPrice
			status
			createdAt
		}
	}
`;
