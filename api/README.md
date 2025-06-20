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

Authentication is handled via JSON Web Tokens (JWT). A token can be obtained by registering or logging in. The token must be included in the `Authorization` header of subsequent requests as a **Bearer token**.

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
  - **Request Body**:

    ```json
    {
      "email": "user@example.com",
      "password": "yoursecurepassword",
      "first_name": "John",
      "last_name": "Doe",
      "birth_date": "1990-01-01T00:00:00.000Z",
      "phone_number": "1234567890"
    }
    ```

- `POST /auth/login`: Login an existing user.

  - **Access**: Public
  - **Request Body**:

    ```json
    {
      "email": "user@example.com",
      "password": "yoursecurepassword"
    }
    ```

### Users

- `GET /users`: Get all users.
  - **Access**: Public (Unprotected)
- `GET /users/:id`: Get a single user.
  - **Access**: Public (Unprotected)
- `POST /users`: Create a new user.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "birth_date": "1990-01-01T00:00:00.000Z",
      "email": "john.doe@example.com",
      "phone_number": "0123456789",
      "password": "a_very_strong_password"
    }
    ```

- `PUT /users/:id`: Update a user.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "birth_date": "1990-01-01T00:00:00.000Z",
      "email": "john.doe@example.com",
      "phone_number": "0123456789",
      "password": "a_new_very_strong_password"
    }
    ```

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
  - **Request Body**:

    ```json
    {
      "user_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "image": "/path/to/image.jpg",
      "address_id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "color_ids": ["..."],
      "style_ids": ["..."],
      "payment_method": "credit_card",
      "beer_level": 5
    }
    ```

- `PUT /user-details/:id`: Update user details.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "image": "/path/to/new_image.jpg",
      "payment_method": "paypal",
      "beer_level": 6
    }
    ```

- `DELETE /user-details/:id`: Delete user details.
  - **Access**: Public (Unprotected)

### Addresses

- `GET /addresses`: Get all addresses.
  - **Access**: Public (Unprotected)
- `GET /addresses/:id`: Get a single address.
  - **Access**: Public (Unprotected)
- `POST /addresses`: Create a new address.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "line_1": "123 Main Street",
      "line_2": "Apt 4B",
      "postal_code": 12345,
      "city": "Anytown",
      "country": "USA"
    }
    ```

- `PUT /addresses/:id`: Update an address.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "line_1": "456 Oak Avenue"
    }
    ```

- `DELETE /addresses/:id`: Delete an address.
  - **Access**: Public (Unprotected)

### Breweries

- `GET /breweries`: Get all breweries.
  - **Access**: Public (Unprotected)
- `GET /breweries/:id`: Get a single brewery.
  - **Access**: Public (Unprotected)
- `POST /breweries`: Create a new brewery.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "name": "Crafty Brews",
      "RIB": "FR7630001007941234567890185",
      "siren": "123456789",
      "address_id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "brewery_owner_id": "f1e2d3c4-b5a6-f7e8-d9c0-b1a2f3e4d5c6"
    }
    ```

- `PUT /breweries/:id`: Update a brewery.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "name": "The Crafty Brewer"
    }
    ```

- `DELETE /breweries/:id`: Delete a brewery.
  - **Access**: Public (Unprotected)

### Brewery Details

- `GET /brewery-details`: Get all brewery details.
  - **Access**: Public (Unprotected)
- `GET /brewery-details/:id`: Get a single brewery detail.
  - **Access**: Public (Unprotected)
- `POST /brewery-details`: Create a new brewery detail.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "brewery_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "has_taproom": true,
      "image": "/path/to/image.jpg",
      "logo": "/path/to/logo.png",
      "description": "A great place for craft beer.",
      "social_link": "https://twitter.com/craftybrews",
      "phone_number": "123-456-7890",
      "email": "contact@craftybrews.com",
      "opening_hours": { "monday": "10-22", "tuesday-saturday": "10-23" }
    }
    ```

- `PUT /brewery-details/:id`: Update a brewery detail.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "description": "The best place for craft beer."
    }
    ```

- `DELETE /brewery-details/:id`: Delete a brewery detail.
  - **Access**: Public (Unprotected)

### Brewery Owners

- `GET /brewery-owners`: Get all brewery owners.
  - **Access**: Public (Unprotected)
- `GET /brewery-owners/:id`: Get a single brewery owner.
  - **Access**: Public (Unprotected)
- `POST /brewery-owners`: Create a new brewery owner.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "first_name": "Brew",
      "last_name": "Master",
      "address_id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "birth_date": "1980-05-15T00:00:00.000Z",
      "phone_number": "9876543210",
      "email": "brew.master@example.com",
      "password": "a_secure_password"
    }
    ```

- `PUT /brewery-owners/:id`: Update a brewery owner.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "email": "brew.master@newdomain.com"
    }
    ```

- `DELETE /brewery-owners/:id`: Delete a brewery owner.
  - **Access**: Public (Unprotected)

### Beers

- `GET /beers`: Get all beers.
  - **Access**: Public (Unprotected)
- `GET /beers/:id`: Get a single beer.
  - **Access**: Public (Unprotected)
- `POST /beers`: Create a new beer.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "name": "Hoppy IPA",
      "beer_color_id": "d0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5",
      "brewery_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "beer_style_ids": "b5a6f7e8-d9c0-b1a2-f3e4-d5c6b7a8f9e0",
      "abv_rate": 6.5,
      "ibu_rate": 60,
      "quantity": 100,
      "price": 5.99
    }
    ```

- `PUT /beers/:id`: Update a beer.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "price": 6.49,
      "is_public": true
    }
    ```

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
  - **Request Body**:

    ```json
    {
      "user_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "brewery_id": "f1e2d3c4-b5a6-f7e8-d9c0-b1a2f3e4d5c6",
      "final_price": 59.99,
      "status": "pending",
      "pickup_day": "2024-07-20T00:00:00.000Z",
      "pickup_time": "18:00",
      "payment_method": "stripe"
    }
    ```

- `PUT /orders/:id`: Update an order.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "status": "confirmed"
    }
    ```

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
  - **Request Body**:

    ```json
    {
      "order_id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "beer_id": "d0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5",
      "quantity": 6,
      "price": 35.94
    }
    ```

- `PUT /order-details/:id`: Update order details.

  - **Access**: Public (Unprotected)
  - **Request Body**: (all fields are optional)

    ```json
    {
      "is_ready": true
    }
    ```

- `DELETE /order-details/:id`: Delete order details.
  - **Access**: Public (Unprotected)

### Favorite Beers

- `GET /favorite-beers/:userId`: Get all favorite beers for a user.
  - **Access**: Public (Unprotected)
- `POST /favorite-beers`: Create a new favorite beer.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "user_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "beer_id": "d0e1f2a3-b4c5-d6e7-f8a9-b0c1d2e3f4a5",
      "liked_at": "2024-07-19T10:00:00.000Z"
    }
    ```

- `DELETE /favorite-beers/:id`: Delete a favorite beer.
  - **Access**: Public (Unprotected)

### Favorite Breweries

- `GET /favorite-breweries/:userId`: Get all favorite breweries for a user.
  - **Access**: Public (Unprotected)
- `POST /favorite-breweries`: Create a new favorite brewery.

  - **Access**: Public (Unprotected)
  - **Request Body**:

    ```json
    {
      "user_id": "c6a9b4d0-1f2e-3d4c-5b6a-7e8f9d0c1b2a",
      "brewery_id": "f1e2d3c4-b5a6-f7e8-d9c0-b1a2f3e4d5c6",
      "liked_at": "2024-07-19T10:05:00.000Z"
    }
    ```

- `DELETE /favorite-breweries/:id`: Delete a favorite brewery.
  - **Access**: Public (Unprotected)

### Test

- `GET /test`: Get test data.
  - **Access**: Public
- `POST /test`: Create test data.

  - **Access**: Protected (Requires authentication)
  - **Request Body**:

    ```json
    {
      "first_name": "Testy",
      "last_name": "McTestFace"
    }
    ```

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## prisma Orm

<https://www.prisma.io/docs/getting-started/prisma-postgres/from-the-cli>

npx prisma migrate dev --name init
npx prisma studio

npm run caching

## 1. Define your database schema

Open the schema.prisma file and define your first models.
