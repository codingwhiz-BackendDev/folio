import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    if (!/^[a-z0-9_]{3,24}$/.test(username) || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Invalid account details.' }, { status: 400 })
    }

    const { data: existing } = await admin.from('profiles').select('id').eq('username', username).maybeSingle()
    if (existing) return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 })

    const email = `${username}@folio.page`
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    })
    if (error || !data.user) return NextResponse.json({ error: 'Could not create your account.' }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Could not create your account.' }, { status: 500 })
  }
}
