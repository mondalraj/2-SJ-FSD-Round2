# User & Posts API

## Overview
REST API for fetching users with their associated posts.

## Prerequisites
- Bun (or Node.js 18+)
- Docker (for PostgreSQL)

## Quick Start
```bash
cp .env.example .env
docker-compose up -d
bun install
bun run seed
bun run start:dev
```

> **Note:** PostgreSQL must be running before seeding/starting. Run `docker-compose up -d` to start it.

## Verify Your Fix
```bash
bun test
```

## Stack
- NestJS
- PostgreSQL
- Drizzle ORM
