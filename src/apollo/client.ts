import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({
	uri: import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000/graphql",
	credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem("authToken");

	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : "",
		},
	});

	return forward(operation);
});

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				me: {
					merge(_existing: any, incoming: any) {
						return incoming;
					},
				},
				user: {
					merge(_existing: any, incoming: any) {
						return incoming;
					},
				},
			},
		},
		User: {
			keyFields: ["id"],
		},
	},
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
});
