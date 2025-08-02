![README COVER](./img/Cover.jpg)
[![Run Unit Tests](https://github.com/Casmei/trip-planner-api/actions/workflows/run-unit-tests.yml/badge.svg)](https://github.com/Casmei/trip-planner/actions/workflows/run-unit-tests.yml)
![Unit Testing Coverage](badge.svg)
[![Monitor Status](https://kuma.kontact.com.br/api/badge/1/uptime)](https://kuma.kontact.com.br/status)
[![Download Insomnia](https://img.shields.io/badge/Insomnia-black?logo=insomnia&logoColor=5849BE)](https://github.com/Casmei/trip-planner/raw/main/insomnia.yaml)

# Trip Planner
A simple API for creating trips, inviting participants, and organizing travel activities.

## What it does
- Create and manage trips with destination and schedule
- Invite participants by email
- Confirm trip participation
- Register and list activities during the trip
- Share useful links (e.g., maps, locations)
- View participant information
- Queue background jobs using BullMQ (e.g., email delivery)

## Technical highlights
- Clean architecture with clear separation of concerns
- BullMQ for handling asynchronous jobs
- Type-safe backend with Fastify and TypeScript
- Prisma as ORM with PostgreSQL
- Redis for job queues
- Unit tested with Vitest and in-memory repositories
- Ready-to-use Insomnia collection for testing endpoints
- Structured use cases with repository and factory patterns
