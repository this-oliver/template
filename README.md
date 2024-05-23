# Web Application Template

> A web application template with opinionated utils, libraries and frameworks for faster development.

Most web applications have a **backend** which defines and manages the logic and a **frontend** which offers users a way graphical way to use the application. The aim of this repo is to provide an **opinionated** end-to-end template for quickly testing out ideas and building web applications.

Key features:

- Frontend built with Nuxt.js
- Backend built with Express.js
- Typescript support
- uses PNPM for faster package management

## Design Decisions

> the less decisions you have to make, the better.

The entire application is written in TypeScript and leverages **performant npm** (**PNPM**). This makes it easy to share code throughout the application. The frontend is built with [Nuxt](https://nuxt.com/), a opinionated frontend framework for Vue. Nuxt is chosen because it is popular, well-documented and opinionated so that I don't have to make too many architectural decisions. The backend uses [Express](https://expressjs.com/), a web application framework for Node.js and [Mongoose](https://mongoosejs.com/) to interact with MongoDB, a non-relational database.

The frontend and backend make up the application. The frontend is responsible for the user interface and the backend is responsible for the business logic. The frontend and backend communicate with each other through a REST API (see [backend routes](./backend/src/router/index.ts)).
