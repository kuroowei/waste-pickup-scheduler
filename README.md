# WastePickup - Waste Pickup Scheduler

A full-stack waste management platform for Kuro-soft Tech, connecting residents, administrators, and pickup truck drivers in one system.

Live app: https://waste-pickup-scheduler-web.vercel.app
Live API: https://waste-pickup-scheduler.onrender.com

## Overview

WastePickup replaces ad-hoc waste collection scheduling with a role-based platform serving three kinds of users:

- Residents schedule pickups, track their status, rate completed jobs, file complaints, and receive real-time notifications and announcements.
- Admins manage users, review and schedule pickup requests, moderate complaints and feedback, publish announcements, oversee the truck fleet, and onboard new drivers.
- Drivers log in to see only the pickups assigned to them, update job status as they work, and leave completion notes that flow back to the admin.

## Features

### Resident
- Register / log in / log out, with forgot-password email flow
- Schedule a pickup (waste type, date, time, address, notes)
- View upcoming pickups and cancel if needed
- View pickup history with status tracking
- Rate and leave feedback on completed pickups
- File complaints, optionally tied to a specific pickup
- View admin-published announcements
- Receive in-app notifications on pickup status changes and new announcements, with an unread-count badge

### Admin
- Dashboard overview (residents, today's pickups, pending/completed/cancelled counts)
- Manage users
- View and update pickup status (Pending, Scheduled, In Progress, Completed, Cancelled, Skipped)
- Automatic truck assignment: moving a pickup from Pending to Scheduled auto-assigns the next available truck on a fair rotation and notifies that truck's driver
- Review complaints and update their status (Open, In Review, Resolved)
- Review resident ratings and feedback
- Publish and delete announcements, which notify every resident
- Fleet management: view all trucks, their assigned driver, live status, and current active pickup count
- Driver onboarding: create a driver account directly from the Fleet tab and link it to any truck without one, no self-registration needed
- Receive in-app notifications when a driver starts or completes a pickup

### Driver
- Log in with an admin-issued account
- See only pickups assigned to their truck (resident name, phone, address, waste type, notes)
- Mark a pickup as started, then completed or skipped, with an optional note for the admin
- View pickup history
- Truck automatically returns to Available status when a job is completed, cancelled, or skipped

## Tech Stack

Frontend (apps/web): React 19 + TypeScript built with Vite, Tailwind CSS, React Router for role-based route protection, TanStack Query for data fetching and mutations, Axios with an interceptor-based token refresh flow, Lucide React icons.

Backend (apps/server): Node.js + Express 5 + TypeScript, Prisma ORM (v7, TypeScript-native client) over PostgreSQL via the @prisma/adapter-pg driver adapter, JWT authentication with a short-lived access token and httpOnly refresh-token cookie, bcrypt for password hashing, Resend for transactional email, Helmet and CORS for security hardening.

Infrastructure: Neon for managed PostgreSQL shared by local development and production, Render for backend hosting, Vercel for frontend hosting with SPA rewrite rules, npm workspaces plus Turborepo for the monorepo.

## Architecture

The frontend and backend are deployed as fully separate services on different domains, communicating over a CORS-restricted REST API. Authentication uses a short-lived JWT access token kept in memory on the client, paired with a long-lived refresh token stored in an httpOnly, cross-site-safe cookie, refreshed silently on page load and on 401 responses.

Three protected route trees exist in the frontend: /dashboard for residents, /admin for admins, and /driver for drivers, each gated by a shared ProtectedRoute component that checks the logged-in user's role before rendering.

### Truck assignment logic

When an admin moves a pickup from Pending to Scheduled, the backend finds the truck with status AVAILABLE that was least recently assigned a job, or never assigned, prioritized first. This is a self-balancing round-robin that needs no separate counter and stays fair even as trucks go in and out of service. It assigns that truck to the pickup, flips its status to ON_ROUTE, and notifies the truck's driver in-app. When the driver later marks the job Completed, Cancelled, or Skipped, the truck automatically returns to AVAILABLE, ready for the next rotation.

## Data Model

Core entities, see apps/server/prisma/schema.prisma for the full schema:

- User: Residents, Admins, and Drivers, one table, distinguished by role
- Truck: Fleet vehicle, name, plate number, status, linked one-to-one to a driver User
- WasteType: Categories of waste (General Household, Recyclables, Organic, Electronic, Bulky)
- PickupRequest: A scheduled pickup, resident, waste type, date/time, address, status, optionally linked to a Truck
- Feedback: A resident's rating and comment on a completed pickup
- Complaint: A resident-filed issue, optionally tied to a pickup
- Notification: An in-app notification for a specific user
- Announcement: An admin broadcast visible to all residents

## Project Structure

apps/server holds the Express and TypeScript API: prisma folder with schema, seed script, and migrations; src folder with config, controllers, services, routes, middleware, and utils, one set per domain (auth, pickup, admin, driver, feedback, complaint, announcement, notification, wasteType); tsconfig.json used by ts-node-dev for development, tsconfig.build.json used by tsc for production builds.

apps/web holds the React and TypeScript frontend: src folder with api (one file per domain wrapping axios calls), hooks (TanStack Query hooks, one per domain), components (shared and domain-specific UI), pages (Login, Register, Dashboard, AdminDashboard, DriverDashboard, and more), context (AuthContext for session state), and types (shared TypeScript types).

## Getting Started

Prerequisites: Node.js 24 or later, a PostgreSQL database (this project uses Neon), and a Resend account for password reset emails.

Clone the repo, run npm install from the project root, then create apps/server/.env (see Environment Variables below).

Set up the database from apps/server: run npx prisma migrate dev, then npx prisma db seed. This creates all tables and seeds 5 waste types plus 10 demo trucks with driver accounts (see Test Accounts below).

To run the app, use two terminals. In apps/server run npm run dev, which starts the backend at http://localhost:5000. In apps/web run npm run dev, which starts the frontend at http://localhost:5173.

## Environment Variables

apps/server/.env needs: DATABASE_URL (PostgreSQL connection string), JWT_ACCESS_SECRET and JWT_REFRESH_SECRET (token signing secrets), NODE_ENV (development locally, production when deployed, controls cookie security flags), CLIENT_URL (frontend origin, used for reference), PORT (defaults to 5000), RESEND_API_KEY, and EMAIL_FROM.

apps/web needs: VITE_API_URL, the base URL of the backend API, for example http://localhost:5000/api locally or the deployed Render URL in production.

## Available Scripts

From the project root, npm run dev starts both apps in development mode, npm run build builds both for production, and npm run lint lints both.

Backend-specific, from apps/server: npm run dev runs ts-node-dev with hot reload, npm run build compiles TypeScript using the production config, npm start runs the compiled build, npx prisma studio opens a visual database browser, npx prisma migrate dev creates and applies a migration, and npx prisma db seed runs the seed script.

Frontend-specific, from apps/web: npm run dev starts the Vite dev server, npm run build creates a production build, and npm run preview previews that build locally.

## Deployment

Backend on Render builds with the command npm install with the include-dev flag, then npx prisma generate, then npm run build, and starts with npm start. NODE_ENV must be set to production for secure cross-site cookies to work correctly with the Vercel frontend.

Frontend on Vercel has its root directory set to apps/web, and includes a vercel.json rewrite rule that serves index.html for all paths, so client-side routing survives page refreshes and direct navigation.

The database on Neon is a single Postgres instance shared between local development and both deployed environments.

## Test Accounts

The seed script creates 10 driver accounts, one per truck, all sharing the password Driver@1234:

- emmanuel.ogoni@kurosofttech.com, Truck 1, plate BYT-101-YN
- samuel.ateke@kurosofttech.com, Truck 2, plate BYT-102-YN
- david.ebiere@kurosofttech.com, Truck 3, plate BYT-103-YN
- friday.amakiri@kurosofttech.com, Truck 4, plate BYT-104-YN
- godwin.tarela@kurosofttech.com, Truck 5, plate BYT-105-YN
- preye.diseye@kurosofttech.com, Truck 6, plate BYT-106-YN
- ibinabo.korubo@kurosofttech.com, Truck 7, plate BYT-107-YN
- anthony.douye@kurosofttech.com, Truck 8, plate BYT-108-YN
- christopher.igoni@kurosofttech.com, Truck 9, plate BYT-109-YN
- moses.warder@kurosofttech.com, Truck 10, plate BYT-110-YN

Admin and resident accounts are created through the normal registration flow. An admin account can be promoted from RESIDENT to ADMIN directly in the database, for example via npx prisma studio, since there is no self-service path to becoming an admin, by design.

## Known Limitations

Password reset email delivery: Resend is configured in sandbox mode with no custom domain verified, so reset emails only deliver to the email address that owns the Resend account. Verifying a domain would lift this restriction for all users.

No location pinning yet: pickup addresses are free text. The schema has latitude and longitude fields reserved for a future map-based location picker, which would require a Google Maps API key and billing account.

Fleet size is fixed at setup: trucks themselves are seeded, not created through the admin UI. Only driver assignment to an existing, driverless truck is supported from the UI.

No automated test suite at this stage. Testing has been manual and thorough throughout development.

## Notable Engineering Decisions

A few non-obvious choices worth knowing if extending this project:

Split TypeScript configs, tsconfig.json versus tsconfig.build.json, resolve a conflict between the dev runner ts-node-dev, which needs dot-ts extensions in the generated Prisma client's internal imports, and the production compiler tsc, which needs those same imports rewritten to dot-js. The build-only config adds the rewriteRelativeImportExtensions option.

Cross-site cookies: the refresh-token cookie uses sameSite none in production, required because the frontend and backend live on different domains, and lax in development, paired with a secure flag tied to NODE_ENV.

Round-robin truck assignment is stateless by design. Instead of a counter that can drift out of sync, it always picks whichever available truck was least recently used or never used, so it self-corrects automatically as trucks are added or taken offline for maintenance.

Drivers are User records, not a separate table, so the existing authentication, JWT, and notification systems work for them without any new code paths.
