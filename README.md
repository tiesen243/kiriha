# Kiriha

A robust attendance system integrating Next.js, tRPC, Drizzle ORM, and ESP8266 hardware with RC522 RFID for fast, reliable, and automated attendance tracking.

## Overview

Kiriha streamlines attendance management using modern web technologies and IoT hardware. It offers a full-stack solution for educational and organizational environments.

## Tech Stack

### Frontend

- **Next.js** – React framework for production
- **shadcn/ui** – Beautifully designed components built with Radix UI and Tailwind CSS

### Backend

- **tRPC** – End-to-end typesafe APIs
- **Drizzle ORM** – Type-safe database ORM with PostgreSQL

### Shared

- **Zod** – TypeScript-first schema declaration and validation library for form validation and API input validation

### Hardware

- **ESP8266 NodeMCU** – Microcontroller for IoT applications
- **RFID RC522** – RFID reader module for attendance tracking

### Build Tools

- **Turbo** – High-performance build system for JavaScript and TypeScript
- **TypeScript** – JavaScript with syntax for types
- **ESLint** – Linting utility for JavaScript and TypeScript
- **Prettier** – Opinionated code formatter
- **Bun** – Package manager
- **Arduino IDE** – Development environment for programming microcontrollers

## Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:tiesen243/kiriha.git
   cd kiriha
   ```
2. **Install dependencies**
   ```bash
   bun install
   ```
3. **Set up your environment variables**
   ```bash
   cp .env.example .env
   ```
4. **Set up the database**
   - Ensure you have Docker installed and running.
   - Start the PostgreSQL database using Docker Compose and run the database migrations:
     ```bash
     docker compose up -d
     ```
   - Push the database schema:
     ```bash
     cd packages/db
     bun run db:push
     ```
5. Start the development server:
   ```bash
   bun run dev:web
   # or
   bun run dev:mobile
   ```
6. **Hardware setup**
   - Refer to the Proteus schematic for correct pin connections between ESP8266 and RC522.
   - Configure WiFi and server info in `packages/firmware/config.cpp`:
     ```bash
     cp packages/firmware/config.example.cpp packages/firmware/config.cpp
     ```
   - Open the `firmware` folder in Arduino IDE.
   - Connect your ESP8266 device and upload the firmware.

## Project Structure

```text
kiriha/
├── apps/            # Web and mobile applications
│   ├── mobile/      # Expo app
│   └── web/         # Next.js web app
├── packages/        # Shared code and logic
│   ├── api/         # tRPC API
│   ├── auth/        # Authentication logic
│   ├── db/          # Database models and migrations
│   ├── firmware/    # ESP8266 firmware for hardware
│   ├── ui/          # Shared UI components
│   └── validators/  # Validation schemas
├── tools/           # Configurations for linting, formatting, types
├── turbo.json       # Turbo repo config
└── package.json     # Root dependencies
```

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify it as per the license terms.
