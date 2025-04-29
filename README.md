# Blood Nexus - Blood Donation Platform

Blood Nexus is a modern web application built with Next.js that connects blood donors with those in need. The platform facilitates blood donation requests and matches donors based on location and blood type compatibility.

---

## Features

- User authentication with email/phone and password
- OAuth integration for social login
- OTP verification for phone numbers and email addresses
- Password reset functionality
- Location-based donor search using Google Maps and Places API
- Real-time donor matching
- Responsive design for all devices
- reCAPTCHA integration for security
- Rich form validation and user-friendly UI
- Admin and user dashboards
- Blog and educational content
- Email notifications for requests and confirmations

---

## Tech Stack

- **Frontend:** Next.js 14, React 18, Material UI, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **APIs:** Google Maps/Places API
- **Container:** Docker
- **Type Safety:** TypeScript
- **Form Handling:** React Hook Form, Zod, Yup
- **Styling:** TailwindCSS, Material UI
- **Testing:** Jest, ts-jest, Supertest

---

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL
- Google Maps API key
- reCAPTCHA API keys

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

**Database**
```
DATABASE_URL="postgresql://postgres:giovess@localhost:5432/blood_nexus?schema=public"
```

**NextAuth**
```
NEXTAUTH_SECRET="e8b5d2f1a7c6e4b0d9f3a2c5e7b1d4f6a9c3e5d8b2f4a1c6e9d3b5f8a2c4e7d1b3"
NEXTAUTH_URL="http://localhost:3000" 
```

**Google**
```
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
```

**Email (for OTP)**
```
NO_REPLY_EMAIL="noreply@yourdomain.com"
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
```

---

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/GIOVESS/blood-nexus.git
    cd blood-nexus
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the PostgreSQL database:**
    ```bash
    docker-compose up -d
    ```

4. **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

5. **Seed the database:**
    ```bash
    npm run prisma:seed
    ```

6. **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/app/components` - Reusable React components (UI, forms, maps, etc.)
- `/src/app/auth` - Authentication actions and configuration
- `/src/app/account` - User account and profile management
- `/src/app/blogs` - Blog and educational content
- `/src/app/blood-donation-request` - Blood donation request forms and logic
- `/src/schema` - Zod/Yup validation schemas
- `/src/utils` - Helper functions and utilities (distance, normalization, etc.)
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/src/tests` - Automated tests (unit, integration)

---

## Testing

- **Test Runner:** Jest (with ts-jest for TypeScript)
- **Test Location:** All test files are in `/src/tests`
- **How to Run Tests:**
    ```bash
    npm test
    ```
- **Test Coverage:** Database logic, referential integrity, and (optionally) API and component logic.

---

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build production application
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier
- `npm run prisma:seed` — Seed the database
- `npm test` — Run all tests

---

## Notes

- **Location Data:** The platform uses Google Maps and Places APIs for all location-based features. If you are deploying in a region other than Kenya, update the administrative region data accordingly.
- **Customization:** Update the `/src/data/kenya-geo.ts` or equivalent for your region’s administrative boundaries.
- **Security:** Ensure all environment variables are set securely in production.

---

**Contributions and feedback are welcome!**


