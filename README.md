# meal-plan-grocery-service

A microservice that discovers nearby grocery stores based on a user's location and search radius using the Google Places API. Part of the Meal Plan & Grocery Discovery application — a full-stack microservice architecture for personalized meal planning and local grocery store discovery.

---

## Overview

This service accepts a geographic coordinate and search radius, then queries the Google Places API to return a structured list of nearby grocery stores. Each result includes store details such as name, address, hours of operation, ratings, and contact information — giving users everything they need to plan a shopping trip around their generated meal plan.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **External API:** Google Places API

---

## Features

- Finds grocery stores within a configurable radius from a given location
- Returns rich store data including hours, address, ratings, and contact info
- Real-time open/closed status per store
- Structured weekly hours and next open time

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/stores/nearby` | Find grocery stores near a given location and radius |

---

## Request Schema

```typescript
{
  location: {
    latitude: number
    longitude: number
  }
  radius: number  // in meters
}
```

## Response Schema

```typescript
{
  stores: [
    {
      placeId: string
      name: string
      formattedAddress: string
      phoneNumber: string
      rating: number
      userRatingCount: number
      businessStatus: string
      regularOpeningHours: {
        openNow: boolean
        weekdayDescriptions: string[]
        nextOpenTime: string
      }
      hoursStatus: {
        isOpen: boolean
        message: string
        hoursUntilOpen: number
        nextOpenTime: string
      }
    }
  ]
}
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3005
GOOGLE_PLACES_API_KEY=your_google_places_api_key
JWT_SECRET=your_jwt_secret
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Google Places API key with Places API enabled

### Installation

```bash
git clone https://github.com/yourusername/meal-plan-grocery-service.git
cd meal-plan-grocery-service
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## Known Limitations

- Store photo retrieval is currently in development
- Results are limited to grocery store category types

---

## Project Architecture

This service is one of six components in the Meal Plan & Grocery Discovery application:

| Service | Responsibility |
|---------|---------------|
| user-auth-service | Authentication & JWT management |
| meal-plan-diet-profile-service | Diet profile storage & management |
| ai-meal-planner-backend | AI-powered meal plan generation |
| meal-planner-user-meal-plan-service | User meal plan storage |
| **meal-plan-grocery-service** | Grocery store discovery via Google API |
| meal-plan-frontend | React frontend |
| meal-planner-backend-for-frontend | BFF orchestration layer |
