<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Event Management System for Running Events

This is a Next.js application for managing running events with the following features:

## Technology Stack
- Next.js 14+ with App Router
- Vercel Postgres for database
- Tailwind CSS for styling
- TypeScript for type safety

## Features

### Admin Role
- Create events with standard registration forms
- Admin dashboard for registration management
- Create attendance tracking for routine activities
- Create attendance tracking for event re-registration

### User Role
- Dashboard showing list of events created by admin
- Event registration functionality
- Attendance tracking for admin-created activities

## Project Structure
- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database configuration
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Development Guidelines
- Use TypeScript for all files
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper authentication and authorization
- Use server actions for form submissions
- Implement proper error handling and validation