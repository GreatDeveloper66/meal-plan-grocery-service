# Meal Plan Grocery Service

> Part of the Meal Planning App — a full-stack, microservice-based application that generates personalized weekly meal plans and surfaces nearby grocery stores based on the user's nutritional profile.

---

## Overview

The Meal Plan Grocery Service calls google apis to find grocery stores in a radius from a given location. It responds to requests with information concerning each grocery store including hours, address and other data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Deployment | Vercel |
| Auth | JSON Web Tokens (JWT) |
| API | Google Places API |

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

**This service:** This service is called by front end after dashboard is rendered to provide user with a choice of grocery stores.

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|-----|--------------------|-----------------------|
| GET | `/api/get-stores/` | Find stores in radius |

---

## Data Model

```typescript

                placeId: any
                name: string
                displayName: string
                latitude: number
                longitude: number
                types: place
                formattedAddress: string
                businessStatus: string
                regularOpeningHours: any
                currentOpeningHours: any
                rating: any
                userRatingCount: any
                // Include the processed photos with URLs
                photos: photos
                // Also include count of available photos
                photoCount: number
                priceLevel: any
                phoneNumber: string
                website: string
                // Computed hours status
                hoursStatus: {
                    isOpen: boolean
                    message: string
                    hoursUntilClose: number
                    hoursUntilOpen: number
                    nextCloseTime: number
                    nextOpenTime: any
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

[MIT]

---
