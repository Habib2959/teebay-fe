import {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	ApolloLink,
} from "@apollo/client";

// Determine the GraphQL URI based on the environment
const getGraphQLUri = (): string => {
	// If running in Node environment (SSR), use Docker service name
	if (typeof window === "undefined") {
		return "http://teebay-app:4000/graphql";
	}

	// If VITE_GRAPHQL_URI is explicitly set in browser, use it
	if (import.meta.env.VITE_GRAPHQL_URI) {
		console.log("Using VITE_GRAPHQL_URI:", import.meta.env.VITE_GRAPHQL_URI);
		return import.meta.env.VITE_GRAPHQL_URI;
	}

	// Default to localhost for browser access
	const uri = "http://localhost:4000/graphql";
	console.log("Using default GraphQL URI:", uri);
	return uri;
};

const httpLink = new HttpLink({
	uri: getGraphQLUri(),
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
