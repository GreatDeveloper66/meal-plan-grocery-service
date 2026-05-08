# [Service Name]

> Part of the Meal Planning App — a full-stack, microservice-based application that generates personalized weekly meal plans and surfaces nearby grocery stores based on the user's nutritional profile.

---

## Overview

[1–2 sentences describing what this specific service does and its role in the overall system. Example: "The User Authorization Service handles user registration, login, and JWT-based authentication. It is the identity foundation for the entire application — every other service depends on the token this service generates at login."]

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | MongoDB |
| Deployment | Vercel |
| Auth | JSON Web Tokens (JWT) |
| Other | [e.g. bcrypt, CORS, OpenAI SDK, Google Places API] |

---

## Architecture Context

This service is one of six components in the meal planning application:

```
React / TypeScript Frontend (Render)
        |
        v
Backend for Frontend — BFF (Vercel)   ← Single entry point
        |
        v
┌───────────────────────────────────────────────┐
│              Vercel Microservices              │
│                                               │
│  User Auth   Diet Profile   AI Meal Planner   │
│  Meal Plan Storage   Grocery Locator          │
└───────────────────────────────────────────────┘
```

**This service:** [Highlight where this service sits — e.g. "User Auth is the first service called at login. The JWT it generates is passed to all other services via the BFF."]

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/[resource]/register` | Register a new user |
| POST | `/api/[resource]/login` | Login and receive JWT |
| POST | `/api/[resource]/logout` | Logout user |

### Protected Routes
> Requires a valid JWT token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/[resource]/profile` | Get current user data |
| PUT | `/api/[resource]/profile` | Update user data |
| DELETE | `/api/[resource]/[id]` | Delete record |

---

## Data Model

```typescript
// [Model Name] — MongoDB Document
{
  _id: ObjectId,         // Auto-generated — used as shared userId across services
  firstName: string,
  lastName: string,
  email: string,         // Unique
  phone: string,
  password: string,      // Hashed via bcrypt — never stored in plain text
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables

Create a `.env` file in the root of this service with the following variables:

```bash
PORT=           # Local development port
MONGO_URI=      # MongoDB connection string
JWT_SECRET=     # Secret key for signing JWT tokens
NODE_ENV=       # development | production
```

> ⚠️ Never commit your `.env` file. It is included in `.gitignore`.

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/[repo-name].git

# Navigate into the project directory
cd [repo-name]

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Then fill in your values

# Start the development server
npm run dev
```

---

## JWT Token Flow

This service generates a JWT token at login containing the `userId` and an expiration time. That token is passed via the BFF to all downstream services, where it is decoded to identify the requesting user without requiring a direct call back to this service.

```
Login → JWT generated (userId + expiration)
      → Token passed via BFF to downstream services
      → Each service decodes token to retrieve userId
      → userId used as shared key across all MongoDB databases
```

---

## Related Services

| Service | Repository | Description |
|---|---|---|
| BFF | [link] | Routes and aggregates all frontend requests |
| Diet Profile | [link] | Stores user nutritional profile |
| AI Meal Planner | [link] | Generates meal plans and images via OpenAI |
| Meal Plan Storage | [link] | Caches generated meal plans per user |
| Grocery Locator | [link] | Returns nearby grocery stores via Google Places |
| Frontend | [link] | React / TypeScript user interface |

---

## Deployment

This service is deployed to **Vercel**. Each service is deployed independently as a standalone Node.js serverless application.

```bash
# Deploy via Vercel CLI
vercel --prod
```

Ensure all environment variables are configured in the Vercel project dashboard before deploying.

---

## License

[MIT / ISC / Your preferred license]

---

*Part of a multi-service meal planning application. See the [main project README or article series link] for full architecture documentation.*