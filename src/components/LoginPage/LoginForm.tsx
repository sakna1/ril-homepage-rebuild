import { useId, useState, type FormEvent } from 'react'
import { ArrowIcon } from '../ArrowIcon'

type LoginFormFields = {
  email: string
  password: string
  remember: boolean
}

type LoginFieldErrors = Partial<Record<'email' | 'password', string>>

function validate(fields: LoginFormFields): LoginFieldErrors {
  const errors: LoginFieldErrors = {}

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

type LoginFormProps = {
  variant: 'traveller' | 'admin'
  submitLabel: string
}

export function LoginForm({ variant, submitLabel }: LoginFormProps) {
  const formId = useId()
  const [fields, setFields] = useState<LoginFormFields>({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState<LoginFieldErrors>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof LoginFormFields>(key: K, value: LoginFormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
  }

  function handleBlur(key: 'email' | 'password') {
    setTouched((current) => ({ ...current, [key]: true }))
    setErrors(validate(fields))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(fields)
    setErrors(nextErrors)
    setTouched({ email: true, password: true })

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="login-success" aria-live="polite">
        <div className="login-success__mark" aria-hidden="true">
          ✦
        </div>
        <h2>Details received.</h2>
        <p>
          Sign-in isn&apos;t connected to an account system yet, so nothing was authenticated or stored. Once the{' '}
          {variant === 'admin' ? 'admin' : 'traveller'} login is wired up to the backend, this same form will sign you
          in.
        </p>
      </section>
    )
  }

  const emailErrorId = `${formId}-email-error`
  const passwordErrorId = `${formId}-password-error`

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-field">
        <label className="login-field-label" htmlFor={`${formId}-email`}>
          Email <span className="login-field-required" aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          name="email"
          value={fields.email}
          onChange={(event) => updateField('email', event.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="your@email.com"
          autoComplete="email"
          required
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
        />
        {touched.email && errors.email ? (
          <p className="login-field-error" id={emailErrorId} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="login-field">
        <label className="login-field-label" htmlFor={`${formId}-password`}>
          Password <span className="login-field-required" aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-password`}
          type="password"
          name="password"
          value={fields.password}
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() => handleBlur('password')}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(touched.password && errors.password)}
          aria-describedby={touched.password && errors.password ? passwordErrorId : undefined}
        />
        {touched.password && errors.password ? (
          <p className="login-field-error" id={passwordErrorId} role="alert">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div className="login-field-row">
        <label className="login-remember">
          <input
            type="checkbox"
            checked={fields.remember}
            onChange={(event) => updateField('remember', event.target.checked)}
          />
          Remember me
        </label>
        <span className="login-forgot-note">Password reset will be available once accounts are connected.</span>
      </div>

      <div className="login-form-actions">
        <button type="submit" className="login-button">
          {submitLabel}
          <ArrowIcon />
        </button>
        <p className="login-form-note">
          This form is not yet connected to an account system — no credentials are sent or stored.
        </p>
      </div>
    </form>
  )
}
