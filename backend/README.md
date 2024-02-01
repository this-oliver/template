# Backend Template

> This template is still a work in progress.

This is a backend template for a REST API that provides a basic CRUD functionality for a personal todo list application with user authentication. It has the following components:

- Authentication (custom)
- Database (MongoDB)
- Data Models (Mongoose)
- File Uploads (Multer)
- Middleware and Routing (Express)
- Payment (Stripe)
- Storage (AWS S3, Google Cloud Storage, Custom)
- Testing (Mocha, Chai, Supertest)

## Installation

> checkout the [main-lite](https://github.com/this-oliver/template-backend/tree/main-lite) branch for a lightweight version of this template (without any database, data models or middleware).

You can use this template to quickly create a backend for your own application. To get started, you can clone this repository (with a clean git history) as follows:

```bash
# clone repo without git history
npx degit <repo-url> <project-name>

# (optional) clone specific branch in repo
npx degit <repo-url>#<branch-name> <project-name>

# enter project directory
cd <project-name>

# install dependencies
pnpm install
```

This will create a new directory called `<project-name>` with the contents of this repository (except for the `.git` directory). In other words, it allows you to start with a clean git history (i.e. no commits).

## Usage

In order to use this template, you need to complete some pre-requisites:

- setup a MongoDB database and get the `connection` string
- setup a Stripe account and get the `secret key`
- create a `.env` file in the root of the **backend** directory which implements the [.env.example](.env.example) file

```bash
# start server in development mode
pnpm dev
```

## Directory Structure

```bash
.
└─ src/   # source code
  ├─ config/  # configuration files
  ├─ data/  # data models and logic
  ├─ middleware/  # request handlers
  ├─ router/  # route handlers
  ├─ types/   # typescript types
  └─ utils/   # utility functions
```

You can find more information about the directory structure in the [docs](./docs/README.md).
