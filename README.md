# Web Application Template

> A web application template with opinionated utils, libraries and frameworks for faster development.

## Features

- Basic web shop functionality
- User authentication & authorization
- Stripe integration for payments
- CRUD operations for products, orders and users between frontend and backend
- Admin dashboard

## Quick Start

Most web applications have a similar structure. They have a frontend (client) which is what the user sees and interacts with. They also have a backend (server) which is what the frontend communicates with to get data and perform actions. The backend is also responsible for storing data in a database - it's pretty much the brain of the application.

The aim of this repository is to provide an end-to-end template for a web application that includes a set of opinionated utils, libraries and frameworks which I, the author, find useful for faster development. The template is designed to be used as a starting point for a new web application and can also be stripped down to only include the parts that are needed (i.e. only the frontend or only the backend).

Both, the frontend and backend, are written in TypeScript and use the same package manager (PNPM). The frontend uses the Vue frontend framework which is enhanced with Nuxt, a opinionated frontend framework for Vue. The backend uses Express, a web application framework for Node.js and Mongoose to interact with MongoDB, a non-relational database.

## Usage

Pre-requisites:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [PNPM](https://pnpm.io/) (v8 or higher)

```bash
# clone the repository with clean history
npx degit this-oliver/template new-project

# enter the project directory
cd new-project
```

Once your have cloned the repository, you'll need to **(1)** install dependencies and **(2)** configure the environment variables.

### Frontend

```bash
# enter the frontend directory
cd frontend

# install dependencies
pnpm install

# create a .env file
cp .env.example .env

# configure the environment variables
nano .env

# start the development server
pnpm dev
```

### Backend

```bash
# enter the backend directory
cd backend

# install dependencies
pnpm install

# create a .env file
cp .env.example .env

# configure the environment variables
nano .env

# start the development server
pnpm dev
```
