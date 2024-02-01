# Web Application Template

> A web application template with opinionated utils, libraries and frameworks for faster development.

Most web applications have a similar structure (frontend and backend). The aim of this repo is to provide an **opinionated** end-to-end template for quickly testing out ideas and building web applications.

**Features**:

- Basic web shop functionality
- User authentication & authorization
- Stripe integration for payments
- CRUD operations for products, orders and users between frontend and backend
- Admin dashboard

## Installation

Pre-requisites:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [PNPM](https://pnpm.io/) (v8 or higher)

```bash
# clone the repo with clean history
npx degit this-oliver/template new-project

# enter the project directory
cd new-project
```

For local development, you'll need to setup the frontend and backend separately. Below, you'll find the instructions for each of them:

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)

## Usage

Pre-requisites:

- setup backend environment variables (see [backend/.env.example](backend/.env.example))
- setup frontend environment variables (see [frontend/.env.example](frontend/.env.example))

```bash
# run docker-compose
pnpm docker:run

# (alternatively)
docker compose up --build
```

## Design Decisions

> the less decisions you have to make, the better.

The entire application is written in TypeScript and leverages **performant npm** (**PNPM**). This makes it easy to share code throughout the application. The frontend is built with [Nuxt](https://nuxt.com/), a opinionated frontend framework for Vue. Nuxt is chosen because it is popular, well-documented and opinionated so that I don't have to make too many architectural decisions. The backend uses [Express](https://expressjs.com/), a web application framework for Node.js and [Mongoose](https://mongoosejs.com/) to interact with MongoDB, a non-relational database.

The frontend and backend make up the application. The frontend is responsible for the user interface and the backend is responsible for the business logic. The frontend and backend communicate with each other through a REST API (see [backend routes](./backend/src/router/index.ts)).
