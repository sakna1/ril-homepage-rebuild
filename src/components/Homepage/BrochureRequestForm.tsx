import { useState, type FormEvent } from 'react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'loading' | 'success' | 'error'

export function BrochureRequestForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/request-brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'We could not send the brochure right now.')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'We could not send the brochure right now.')
    }
  }

  if (status === 'success') {
    return (
      <p className="figma-brochure-success" role="status">
        Thank you. Your private brochure is on its way to <strong>{email.trim()}</strong>.
      </p>
    )
  }

  return (
    <form className="figma-brochure-form" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        aria-label="Your email address"
        placeholder="Your email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        aria-invalid={status === 'error'}
        aria-describedby={status === 'error' ? 'brochure-form-error' : undefined}
        disabled={status === 'loading'}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Request Brochure'}
      </button>
      {status === 'error' ? (
        <p className="figma-brochure-error" id="brochure-form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  )
}
