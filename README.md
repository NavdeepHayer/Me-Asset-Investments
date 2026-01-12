# ME Asset Management

A modern web application for ME Asset Management, a discretionary investment firm specializing in income-producing real estate assets across hotels, student housing, and commercial properties.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Build Tool**: Vite
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Animations**: Framer Motion
- **Deployment**: DigitalOcean App Platform

## Features

### Public Website
- Company information and investment philosophy
- Project portfolio showcase
- Team section
- Mailing list subscription

### Admin Panel (`/admin`)
- **User Management**: Invite users via email, manage admin roles, reset passwords, delete users
- **Project Management**: Add, edit, and manage property projects
- **Content Management**: Edit site content directly from the database

### Authentication
- Email/password authentication via Supabase
- User invitation flow with email verification
- Password reset functionality
- Role-based access control (admin/user)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── admin/        # Admin panel components
│   ├── sections/     # Page sections (Hero, Projects, Team, etc.)
│   └── ui/           # Reusable UI components
├── content/          # Static site content
├── contexts/         # React contexts (Auth)
├── hooks/            # Custom React hooks
├── lib/              # Supabase client setup
├── pages/            # Page components (Home, Admin, SetPassword)
└── assets/           # Images and static assets
```

## Supabase Setup

### Required Tables
- `profiles` - User profiles with `is_admin` flag
- `site_content` - Editable site content (key-value pairs)
- `projects` - Property projects data
- `mailing_list` - Newsletter subscriptions

### Edge Functions
- `admin-user-management` - Handles user invitations, password resets, and admin operations

### URL Configuration
Add these to your Supabase Redirect URLs:
- `https://your-domain.com/`
- `https://your-domain.com/set-password`
- `http://localhost:5173/` (for development)
- `http://localhost:5173/set-password` (for development)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

Private - All rights reserved.
