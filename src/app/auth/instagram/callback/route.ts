import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/dashboard/profile?error=instagram_denied', request.url))
  }

  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID!
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI!

    // Exchange code for short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('Token exchange failed')

    // Exchange for long-lived token
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`
    )
    const longToken = await longTokenRes.json()

    // Fetch profile
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,account_type&access_token=${longToken.access_token || tokenData.access_token}`
    )
    const igProfile = await profileRes.json()

    // Store in Supabase
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + (longToken.expires_in || 5184000))

    await supabase.from('instagram_accounts').upsert({
      user_id: user!.id,
      instagram_user_id: igProfile.id,
      username: igProfile.username,
      full_name: igProfile.name,
      bio: igProfile.biography,
      followers_count: igProfile.followers_count,
      following_count: igProfile.follows_count,
      media_count: igProfile.media_count,
      profile_picture_url: igProfile.profile_picture_url,
      account_type: igProfile.account_type,
      access_token: longToken.access_token || tokenData.access_token,
      token_expires_at: expiresAt.toISOString(),
      last_synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.redirect(new URL('/dashboard/profile?connected=true', request.url))
  } catch (err) {
    console.error('Instagram callback error:', err)
    return NextResponse.redirect(new URL('/dashboard/profile?error=instagram_error', request.url))
  }
}
