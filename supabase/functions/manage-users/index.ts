import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Authenticate the user calling this function
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    // Use service_role_key for ADMIN tasks
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Client to verify the calling user
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // SECURITY CHECK
    // const isAdmin = user.user_metadata?.role === 'admin'
    // if (!isAdmin) {}

    // Admin Client with service_role_key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    let body: any = {}
    if (req.method !== 'GET' && req.method !== 'OPTIONS') {
      try { body = await req.json() } catch(e) {}
    }
    const method = body.method || req.method

    if (method === 'GET') {
      // List users
      const { data: { users }, error } = await adminClient.auth.admin.listUsers()
      if (error) throw error
      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'POST') {
      // Create user
      const { email, password } = body as any
      if (!email || !password) throw new Error('Email and password required')
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (error) throw error
      return new Response(JSON.stringify({ user: data.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'DELETE') {
      // Delete user
      const { id } = body as any
      if (!id) throw new Error('User ID required')
      const { data, error } = await adminClient.auth.admin.deleteUser(id)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'PUT') {
      // Update password
      const { id, password } = body as any
      if (!id || !password) throw new Error('User ID and password required')
      const { data, error } = await adminClient.auth.admin.updateUserById(id, { password })
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Unsupported method')

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
