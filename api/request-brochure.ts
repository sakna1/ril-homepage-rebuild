import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BROCHURE_PATH = path.join(process.cwd(), 'api', '_assets', 'royale-isles-lanka-private-brochure.pdf')
const FROM_ADDRESS = process.env.BROCHURE_FROM_EMAIL ?? 'Royale Isles Lanka <brochure@royaleisleslanka.com>'

function buildBrochureEmailHtml() {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d1f17;padding:40px 0;font-family:Georgia,'Times New Roman',serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fbf9f5;">
          <tr>
            <td style="padding:48px 48px 32px;text-align:center;border-bottom:1px solid rgba(197,160,89,0.35);">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c5a059;">
                Royale Isles Lanka
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 48px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c5a059;">
                Private Sri Lanka Briefing
              </p>
              <h1 style="margin:0 0 24px;font-size:30px;font-weight:400;line-height:1.25;color:#1a1a1a;">
                Your private brochure has arrived.
              </h1>
              <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#4a4a4a;">
                Thank you for your interest in Sri Lanka, held privately. Attached is a considered introduction for
                private families, principals, and thoughtful travellers: quiet residences, trusted hosts, protected
                timing, and private moments arranged with discretion rather than display.
              </p>
              <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#4a4a4a;">
                This briefing was sent to you directly, without an automated itinerary or mailing-list noise. If
                anything here draws you further, simply reply to this email and we will begin a personal conversation.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 48px 48px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a8a8a;">
                With discretion,<br />The Royale Isles Lanka Private Office
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;background:#0d1f17;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:1px;color:rgba(251,249,245,0.5);">
                © Royale Isles Lanka · Sent privately in response to your request
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : ''
  const email = rawEmail.trim()

  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured')
    return res.status(500).json({ error: 'Brochure delivery is not configured yet. Please try again later.' })
  }

  try {
    const pdfBuffer = readFileSync(BROCHURE_PATH)
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Your Private Sri Lanka Briefing — Royale Isles Lanka',
      html: buildBrochureEmailHtml(),
      attachments: [
        {
          filename: 'Royale-Isles-Lanka-Private-Brochure.pdf',
          content: pdfBuffer,
        },
      ],
    })

    if (error) {
      console.error('Resend error', error)
      return res.status(502).json({ error: 'We could not send the brochure right now. Please try again shortly.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Brochure send failed', err)
    return res.status(500).json({ error: 'Something went wrong while sending the brochure.' })
  }
}
