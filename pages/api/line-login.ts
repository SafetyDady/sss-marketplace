import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// ใช้ require แทน import!
const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')

/*
  File: /pages/api/line-login.ts
  Version: 2.1 | 2025-06-01
  Note: Fix import firebase-admin & serviceAccount for Next.js 15.x
*/

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const channelId = '2007212106'
const channelSecret = '9b2030cbca481172a9402dee1627a37b'
const redirectUri = 'http://localhost:3000/auth/line-callback'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string
  if (!code) {
    res.status(400).json({ error: 'No code' })
    return
  }

  try {
    // 1. แลก access_token กับ LINE
    const tokenRes = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    const accessToken = tokenRes.data.access_token

    // 2. ดึง profile user จาก LINE
    const profileRes = await axios.get('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const lineUserId = profileRes.data.userId
    const displayName = profileRes.data.displayName

    // 3. ออก Firebase Custom Token
    const customToken = await admin.auth().createCustomToken(lineUserId, {
      provider: 'LINE',
      displayName,
    })

    res.status(200).json({ token: customToken })
  } catch (err: any) {
    console.error('LINE LOGIN ERROR:', err)
    res.status(500).json({ error: err.message || 'LINE login failed' })
  }
}
