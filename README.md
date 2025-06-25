# Product Showcase Backend

Backend API for product showcase, built with Node.js, Express, and MongoDB.

---

## Description

This project provides a REST API for managing and displaying products for a showcase application.

The API supports basic CRUD operations and includes security features such as rate limiting, CORS, and Helmet.

---

## Technologies

- Node.js (>=18)
- Express
- MongoDB (official `mongodb` driver)
- dotenv for environment variables
- Helmet for HTTP security
- express-rate-limit for request throttling
- Jest and Supertest for automated testing

---

## Available Scripts

- `npm run start` — starts the app in production mode
- `npm run dev` — starts the app in development mode with nodemon
- `npm run test` — runs tests (test environment)
- `npm run test:watch` — runs tests in watch mode
- `npm run lint` — runs ESLint with auto-fix
- `npm run seed` — seeds the database with initial data

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/product-showcase-backend.git
   cd product-showcase-backend
   ```
