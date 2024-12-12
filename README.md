# Forum App

## Overview

Forum App is a full-stack web application that enables users to interact, share ideas, and engage in discussions. It provides robust features for authentication, user management, and content creation, along with real-time updates and notifications. The app leverages a combination of powerful back-end and front-end technologies to deliver a seamless user experience.

---

## Key Features

### Authentication and Authorization

- Sign up and sign in functionality.
- Authentication and authorization implemented using **Passport.js**.

### User Management

- View and update user profiles.
- Delete accounts.

### Post Management

- Create, edit, and delete posts.
- View a list of posts.
- View post details and the author’s profile.
- Search and filter functionality for posts.

### Comment System

- Multi-level comment threads.

### Likes and Notifications

- Like posts and comments.
- Receive notifications for:
  - Posts or comments being liked.
  - Comments added to a user’s post or comment.
- Mark notifications as read.

---

## Tech Stack

### Backend

#### **NestJS** (PostgreSQL)

- **TypeORM** for object-relational mapping.
- Native **SQL queries** for optimized database operations.

#### **Express.js** (MongoDB)

- **Mongoose** for schema-based modeling.
- MongoDB **aggregate queries** for complex data operations.

### Frontend

#### **Vite + React**

- Fast development environment powered by **Vite**.
- **React** for building reusable UI components.

#### Styling

- **Styled-components** for component-level styling.

#### State Management

- **TanStack Query** for server state management and API interactions.

---

## Installation and Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL**
- **MongoDB**
- **Docker Desktop**
- **npm** or **yarn** package manager

### Backend Setup

1. Clone the repository.
2. Navigate to the `server` directory for NestJS and Express servers.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables for both servers.

5. Set up PostgreSQL and pgAdmin using Docker.

```bash
docker-compose up -d
```

Access pgAdmin at http://localhost:8080.

6. Start the servers:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---
