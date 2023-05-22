import { NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  const redirectTo = request.cookies.get('redirectTo')?.value
  const redirectURL = redirectTo ?? new URL('/', request.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30 // 1 Month

  const redirect = NextResponse.redirect(redirectURL)

  redirect.cookies.set('token', token, {
    path: '/',
    maxAge: cookieExpiresInSeconds,
  })

  redirect.cookies.delete('redirectTo')

  return redirect
}
