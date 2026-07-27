import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
const GIS_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise: Promise<void> | null = null

function loadGis(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('GIS failed to load')))
      return
    }
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('GIS failed to load'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

type TravellerGoogleButtonProps = {
  onCredential: (credential: string) => Promise<void>
  onError?: (message: string) => void
}

export function TravellerGoogleButton({ onCredential, onError }: TravellerGoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false

    loadGis()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: { credential?: string }) => {
            if (response?.credential) {
              onCredential(response.credential).catch((err) =>
                onError?.(err instanceof Error ? err.message : 'Google sign-in failed.'),
              )
            }
          },
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'center',
        })

        setReady(true)
      })
      .catch(() => onError?.('Could not load Google sign-in.'))

    return () => {
      cancelled = true
    }
  }, [onCredential, onError])

  if (!GOOGLE_CLIENT_ID) return null

  return (
    <div className="traveller-google">
      <div className="traveller-divider">
        <span />
        <p>or</p>
        <span />
      </div>
      <div className="traveller-google__button" ref={buttonRef} />
      {!ready ? <p className="traveller-google__loading">Loading Google sign-in…</p> : null}
    </div>
  )
}
