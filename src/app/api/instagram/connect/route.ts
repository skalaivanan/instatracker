import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback'

  if (!clientId) {
    return NextResponse.redirect(
      new URL('/dashboard/profile?error=instagram_not_configured', request.url)
    )
  }

  const authUrl = new URL('https://api.instagram.com/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'user_profile,user_media')
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}
