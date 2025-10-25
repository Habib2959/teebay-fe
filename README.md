# TeeBay Frontend

A modern React + TypeScript + Vite frontend application for TeeBay, featuring Apollo Client for GraphQL state management, React Hook Form for form handling, and comprehensive authentication.

## Features

- **Apollo Client Integration**: In-memory caching with automatic cache management
- **Authentication**: Protected routes with JWT token management
- **React Hook Form**: Efficient form validation and submission
- **TypeScript**: Full type safety across the application
- **Responsive Design**: Mobile-friendly UI components
- **Cache Management**: Automatic cache eviction and garbage collection

## Project Structure

```
src/
├── apollo/
│   └── client.ts              # Apollo Client configuration with in-memory cache
├── components/
│   └── ProtectedRoute.tsx      # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx         # Authentication context provider
├── graphql/
│   ├── queries.ts             # GraphQL queries
│   └── mutations.ts           # GraphQL mutations
├── hooks/
│   └── useAuth.ts             # Custom auth hook
├── pages/
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Registration page
│   ├── Home.tsx               # Home page
│   ├── Auth.css               # Auth pages styling
│   └── Home.css               # Home page styling
├── types/
│   └── index.ts               # TypeScript type definitions
├── App.tsx                    # Main App component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (create `.env` file):

```
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Architecture

### Authentication Flow

1. User logs in or registers
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via authLink
5. User data cached in Apollo Client
6. Protected routes verify authentication

### Cache Management

- **In-Memory Cache**: All user data stored in Apollo Client cache
- **Automatic Eviction**: Cache entries removed when data is deleted
- **Garbage Collection**: Unused cache entries cleaned up automatically
- **Type Policies**: Query merge strategies configured for proper cache updates

### Form Handling

- **React Hook Form**: Minimalist approach to form state management
- **Validation**: Both client-side and server-side validation
- **Error Handling**: User-friendly error messages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Apollo Client** - GraphQL client with caching
- **React Hook Form** - Form management
- **React Router** - Client-side routing
- **GraphQL** - Query language
