# Supabase Backend Setup Plan

This document outlines the plan for integrating Supabase as the backend for the ME Asset Investments investor portal.

## Overview

**Supabase** will handle:
- User authentication (login, signup, password reset)
- User profile data storage
- Session management

**Current Status:** Frontend integration complete. Awaiting Supabase project setup.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              DigitalOcean App Platform                      │
│                  (React Frontend)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    Auth     │  │  PostgreSQL │  │   Storage (future)  │ │
│  │             │  │   Database  │  │                     │ │
│  │ - Login     │  │             │  │  - Documents        │ │
│  │ - Signup    │  │ - profiles  │  │  - Reports          │ │
│  │ - Password  │  │ - user data │  │                     │ │
│  │   Reset     │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| Monthly Active Users | 50,000 |
| Database Size | 500 MB |
| File Storage | 1 GB |
| Bandwidth | 2 GB |
| Auth Emails | 4/hour/user |

More than sufficient for an investor portal.

## Implementation Steps

### Phase 1: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down: Project URL, Anon Key

2. **Configure Authentication**
   - Enable Email/Password provider
   - Set up email templates (optional, uses built-in)
   - Configure redirect URLs for password reset

3. **Create Database Tables**

```sql
-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  company text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Phase 2: Frontend Integration

1. **Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

2. **Create Supabase Client** (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

3. **Environment Variables** (`.env`)

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Create Auth Context** (`src/contexts/AuthContext.tsx`)

```typescript
// Provides: user, session, signIn, signUp, signOut, resetPassword
```

5. **Update Login Modal**
   - Replace simulated API calls with Supabase auth
   - Handle auth errors and display messages

### Phase 3: Post-Login Features (Future)

- Investor dashboard page
- Profile management
- Document access
- Investment reports

## Email Configuration

**Built-in Email (Current Plan)**
- Rate limit: 4 emails/hour/user
- Handles: Password reset, email confirmation
- Sufficient for low-traffic investor portal

**Custom Email Provider (If Needed Later)**
- Resend: 100 emails/day free
- Better branding, custom templates
- Higher rate limits

## Security Considerations

### Password Security (Handled by Supabase)
- **Hashing:** Passwords are hashed using bcrypt before storage
- **Salting:** Each password gets a unique salt (built into bcrypt)
- **No raw passwords:** Raw passwords never stored in the database
- **Transport:** All API calls are over HTTPS (encrypted in transit)
- **Rate limiting:** Built-in protection against brute force attacks

### Database Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API keys are anon (safe for frontend)
- Sensitive operations use service_role key (server-side only)

## DigitalOcean Deployment

Environment variables to add in App Platform:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Timeline

| Phase | Status |
|-------|--------|
| Login Modal UI | Complete |
| Sign Up UI | Complete (hidden) |
| Frontend Integration | Complete |
| Supabase Project Setup | Pending |
| Database Schema | Pending |
| Testing | Pending |
| Deployment | Pending |

## Files Created/Modified

```
src/
├── lib/
│   └── supabase.ts          # Supabase client [CREATED]
├── contexts/
│   └── AuthContext.tsx      # Auth state management [CREATED]
├── components/
│   └── ui/
│       └── InvestorLoginModal.tsx  # Updated with Supabase auth [MODIFIED]
├── App.tsx                  # Wrapped with AuthProvider [MODIFIED]
└── pages/
    └── Dashboard.tsx        # Future: investor dashboard

.env.example                 # Environment variables template [CREATED]
```

## Notes

- Sign up is currently hidden in the modal (re-enable when ready)
- The Tab type and signup-related code is commented out
- Search for `TODO: Re-enable` in codebase for disabled features
