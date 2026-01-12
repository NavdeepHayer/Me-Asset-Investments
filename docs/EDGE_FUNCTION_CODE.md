# Edge Function: admin-user-management

Copy this entire code block into your Supabase Edge Function.

## Setup Instructions

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **Create a new function**
3. Name it: `admin-user-management`
4. Paste the code below
5. Click **Deploy**

## Add Secret

1. Go to **Project Settings** → **Edge Functions**
2. Click **Add new secret**
3. Name: `SERVICE_ROLE_KEY`
4. Value: Your service role key from **Settings** → **API**

---

## Function Code

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's token to verify they're admin
    const supabaseUser = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get the calling user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { action, email, userId } = await req.json()

    let result

    switch (action) {
      case 'invite':
        // Invite a new user (they'll get an email to set password)
        if (!email) {
          return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get redirect URL from request origin or use default
        const origin = req.headers.get('origin') || 'https://yourdomain.com'
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/set-password`,
        })

        if (inviteError) {
          return new Response(
            JSON.stringify({ error: inviteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: `Invitation sent to ${email}`, user: inviteData.user }
        break

      case 'reset-password':
        // Send password reset email to existing user
        if (!email) {
          return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: email,
        })

        if (resetError) {
          // Fallback to regular reset if admin method fails
          const { error: fallbackError } = await supabaseAdmin.auth.resetPasswordForEmail(email)
          if (fallbackError) {
            return new Response(
              JSON.stringify({ error: fallbackError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        result = { success: true, message: `Password reset email sent to ${email}` }
        break

      case 'list-users':
        // List all users (admin only)
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

        if (usersError) {
          return new Response(
            JSON.stringify({ error: usersError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get profiles to merge with user data
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, is_admin')

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

        const users = usersData.users.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          full_name: profileMap.get(u.id)?.full_name || u.user_metadata?.full_name || '',
          is_admin: profileMap.get(u.id)?.is_admin || false,
        }))

        result = { success: true, users }
        break

      case 'toggle-admin':
        // Toggle admin status for a user
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get current admin status
        const { data: currentProfile } = await supabaseAdmin
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single()

        const newAdminStatus = !currentProfile?.is_admin

        const { error: toggleError } = await supabaseAdmin
          .from('profiles')
          .update({ is_admin: newAdminStatus })
          .eq('id', userId)

        if (toggleError) {
          return new Response(
            JSON.stringify({ error: toggleError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, is_admin: newAdminStatus }
        break

      case 'delete-user':
        // Delete a user (use with caution!)
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Prevent self-deletion
        if (userId === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete yourself' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (deleteError) {
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: 'User deleted' }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## CORS Shared File

You also need to create a shared CORS file. In Supabase, create a folder `_shared` in your functions directory with a file `cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**Note:** If using the web dashboard, the CORS headers are usually handled automatically. If you get CORS errors, you may need to deploy via CLI to include the shared file.

---

## Alternative: Inline CORS (No Shared File Needed)

If you can't create shared files in the web dashboard, use this version instead:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's token to verify they're admin
    const supabaseUser = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get the calling user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { action, email, userId } = await req.json()

    let result

    switch (action) {
      case 'invite':
        // Invite a new user (they'll get an email to set password)
        if (!email) {
          return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get redirect URL from request origin or use default
        const origin = req.headers.get('origin') || 'https://yourdomain.com'
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/set-password`,
        })

        if (inviteError) {
          return new Response(
            JSON.stringify({ error: inviteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: `Invitation sent to ${email}`, user: inviteData.user }
        break

      case 'reset-password':
        // Send password reset email to existing user
        if (!email) {
          return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: email,
        })

        if (resetError) {
          // Fallback to regular reset if admin method fails
          const { error: fallbackError } = await supabaseAdmin.auth.resetPasswordForEmail(email)
          if (fallbackError) {
            return new Response(
              JSON.stringify({ error: fallbackError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        result = { success: true, message: `Password reset email sent to ${email}` }
        break

      case 'list-users':
        // List all users (admin only)
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

        if (usersError) {
          return new Response(
            JSON.stringify({ error: usersError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get profiles to merge with user data
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, is_admin')

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

        const users = usersData.users.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          full_name: profileMap.get(u.id)?.full_name || u.user_metadata?.full_name || '',
          is_admin: profileMap.get(u.id)?.is_admin || false,
        }))

        result = { success: true, users }
        break

      case 'toggle-admin':
        // Toggle admin status for a user
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get current admin status
        const { data: currentProfile } = await supabaseAdmin
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single()

        const newAdminStatus = !currentProfile?.is_admin

        const { error: toggleError } = await supabaseAdmin
          .from('profiles')
          .update({ is_admin: newAdminStatus })
          .eq('id', userId)

        if (toggleError) {
          return new Response(
            JSON.stringify({ error: toggleError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, is_admin: newAdminStatus }
        break

      case 'delete-user':
        // Delete a user (use with caution!)
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Prevent self-deletion
        if (userId === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete yourself' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (deleteError) {
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: 'User deleted' }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## Testing the Function

After deployment, test with curl:

```bash
# Replace YOUR_PROJECT_REF and YOUR_ACCESS_TOKEN
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/admin-user-management' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"action": "list-users"}'
```

## Available Actions

| Action | Required Fields | Description |
|--------|-----------------|-------------|
| `list-users` | none | Get all users with admin status |
| `invite` | `email` | Send invitation email to new user |
| `reset-password` | `email` | Send password reset email |
| `toggle-admin` | `userId` | Toggle is_admin status |
| `delete-user` | `userId` | Delete user (cannot delete self) |
