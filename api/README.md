# Crafted to Go - API Documentation

This document provides a detailed overview of the Crafted to Go API, including its endpoints, authentication, and other necessary information for development and integration.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the API](#running-the-api)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Auth](#auth)
  - [Users](#users)
  - [User Details](#user-details)
  - [Addresses](#addresses)
  - [Breweries](#breweries)
  - [Brewery Details](#brewery-details)
  - [Brewery Owners](#brewery-owners)
  - [Beers](#beers)
  - [Beer Colors](#beer-colors)
  - [Beer Styles](#beer-styles)
  - [Orders](#orders)
  - [Order Details](#order-details)
  - [Favorite Beers](#favorite-beers)
  - [Favorite Breweries](#favorite-breweries)
  - [Test](#test)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker and Docker Compose
- A running PostgreSQL database

### Installation

1. Clone the repository.
2. Navigate to the `api` directory: `cd api`
3. Install dependencies: `npm install`

### Running the API

- **Development:** `npm run dev`
- **Production:** `npm start`
- **Tests:** `npm run test`

The API will be available at `http://localhost:3000`.

## Authentication

Authentication is handled via JSON Web Tokens (JWT). A token can be obtained by registering or logging in. The token must be included in the `Authorization` header of subsequent requests as a Bearer token.

**`authMiddleware`**

The project includes an `authMiddleware` that can be used to protect endpoints. It verifies the JWT and attaches the user's information to the request object.

**Example Usage:**

```typescript
import { authMiddleware } from "../middlewares/auth.middleware";

// ...

fastify.post("/some-protected-route", { preHandler: authMiddleware }, async (request, reply) => {
  // ... route logic
});
```

**IMPORTANT:** Currently, most endpoints are **unprotected**. In a near futur development step, all endpoints excluding `auth/login` and `auth/register` will be **protected**

## API Endpoints

### Health Check

- `GET /`: Redirects to `/health`.
- `GET /health`: Returns the status of the API.
  - **Access**: Public

### Auth

- `POST /auth/register`: Register a new user.
  - **Access**: Public
  - **Request Body**: `email`, `password`, `first_name`, `last_name`, `birth_date`, `phone_number`
- `POST /auth/login`: Login an existing user.
  - **Access**: Public
  - **Request Body**: `email`, `password`

### Users

- `GET /users`: Get all users.
  - **Access**: Public (Unprotected)
- `GET /users/:id`: Get a single user.
  - **Access**: Public (Unprotected)
- `POST /users`: Create a new user.
  - **Access**: Public (Unprotected)
- `PUT /users/:id`: Update a user.
  - **Access**: Public (Unprotected)
- `DELETE /users/:id`: Delete a user.
  - **Access**: Public (Unprotected)

### User Details

- `GET /user-details`: Get all user details.
  - **Access**: Public (Unprotected)
- `GET /user-details/:id`: Get a single user detail.
  - **Access**: Public (Unprotected)
- `GET /user-details/user/:userId`: Get details for a specific user.
  - **Access**: Public (Unprotected)
- `POST /user-details`: Create new user details.
  - **Access**: Public (Unprotected)
- `PUT /user-details/:id`: Update user details.
  - **Access**: Public (Unprotected)
- `DELETE /user-details/:id`: Delete user details.
  - **Access**: Public (Unprotected)

### Addresses

- `GET /addresses`: Get all addresses.
  - **Access**: Public (Unprotected)
- `GET /addresses/:id`: Get a single address.
  - **Access**: Public (Unprotected)
- `POST /addresses`: Create a new address.
  - **Access**: Public (Unprotected)
- `PUT /addresses/:id`: Update an address.
  - **Access**: Public (Unprotected)
- `DELETE /addresses/:id`: Delete an address.
  - **Access**: Public (Unprotected)

### Breweries

- `GET /breweries`: Get all breweries.
  - **Access**: Public (Unprotected)
- `GET /breweries/:id`: Get a single brewery.
  - **Access**: Public (Unprotected)
- `POST /breweries`: Create a new brewery.
  - **Access**: Public (Unprotected)
- `PUT /breweries/:id`: Update a brewery.
  - **Access**: Public (Unprotected)
- `DELETE /breweries/:id`: Delete a brewery.
  - **Access**: Public (Unprotected)

### Brewery Details

- `GET /brewery-details`: Get all brewery details.
  - **Access**: Public (Unprotected)
- `GET /brewery-details/:id`: Get a single brewery detail.
  - **Access**: Public (Unprotected)
- `POST /brewery-details`: Create a new brewery detail.
  - **Access**: Public (Unprotected)
- `PUT /brewery-details/:id`: Update a brewery detail.
  - **Access**: Public (Unprotected)
- `DELETE /brewery-details/:id`: Delete a brewery detail.
  - **Access**: Public (Unprotected)

### Brewery Owners

- `GET /brewery-owners`: Get all brewery owners.
  - **Access**: Public (Unprotected)
- `GET /brewery-owners/:id`: Get a single brewery owner.
  - **Access**: Public (Unprotected)
- `POST /brewery-owners`: Create a new brewery owner.
  - **Access**: Public (Unprotected)
- `PUT /brewery-owners/:id`: Update a brewery owner.
  - **Access**: Public (Unprotected)
- `DELETE /brewery-owners/:id`: Delete a brewery owner.
  - **Access**: Public (Unprotected)

### Beers

- `GET /beers`: Get all beers.
  - **Access**: Public (Unprotected)
- `GET /beers/:id`: Get a single beer.
  - **Access**: Public (Unprotected)
- `POST /beers`: Create a new beer.
  - **Access**: Public (Unprotected)
- `PUT /beers/:id`: Update a beer.
  - **Access**: Public (Unprotected)
- `DELETE /beers/:id`: Delete a beer.
  - **Access**: Public (Unprotected)

### Beer Colors

- `GET /beer-colors`: Get all beer colors.
  - **Access**: Public (Unprotected)

### Beer Styles

- `GET /beer-styles`: Get all beer styles.
  - **Access**: Public (Unprotected)

### Orders

- `GET /orders`: Get all orders.
  - **Access**: Public (Unprotected)
- `GET /orders/:id`: Get a single order.
  - **Access**: Public (Unprotected)
- `POST /orders`: Create a new order.
  - **Access**: Public (Unprotected)
- `PUT /orders/:id`: Update an order.
  - **Access**: Public (Unprotected)
- `DELETE /orders/:id`: Delete an order.
  - **Access**: Public (Unprotected)

### Order Details

- `GET /order-details`: Get all order details.
  - **Access**: Public (Unprotected)
- `GET /order-details/:id`: Get a single order detail.
  - **Access**: Public (Unprotected)
- `GET /order-details/order/:orderId`: Get details for a specific order.
  - **Access**: Public (Unprotected)
- `POST /order-details`: Create new order details.
  - **Access**: Public (Unprotected)
- `PUT /order-details/:id`: Update order details.
  - **Access**: Public (Unprotected)
- `DELETE /order-details/:id`: Delete order details.
  - **Access**: Public (Unprotected)

### Favorite Beers

- `GET /favorite-beers/:userId`: Get all favorite beers for a user.
  - **Access**: Public (Unprotected)
- `POST /favorite-beers`: Create a new favorite beer.
  - **Access**: Public (Unprotected)
- `DELETE /favorite-beers/:id`: Delete a favorite beer.
  - **Access**: Public (Unprotected)

### Favorite Breweries

- `GET /favorite-breweries/:userId`: Get all favorite breweries for a user.
  - **Access**: Public (Unprotected)
- `POST /favorite-breweries`: Create a new favorite brewery.
  - **Access**: Public (Unprotected)
- `DELETE /favorite-breweries/:id`: Delete a favorite brewery.
  - **Access**: Public (Unprotected)

### Test

- `GET /test`: Get test data.
  - **Access**: Public
- `POST /test`: Create test data.
  - **Access**: Protected (Requires authentication)

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## prisma Orm

<https://www.prisma.io/docs/getting-started/prisma-postgres/from-the-cli>

npx prisma migrate dev --name init
npx prisma studio

npm run caching

## 1. Define your database schema

Open the schema.prisma file and define your first models.
