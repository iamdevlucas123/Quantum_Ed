import { useState, type FormEvent } from 'react'

import { useAuth } from '../../context/auth_store'

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup'
type PasswordRequirement = {
  id: 'length' | 'lowercase' | 'uppercase' | 'special'
  label: string
  isMet: boolean
}

const getPasswordRequirements = (password: string): PasswordRequirement[] => {
  return [
    {
      id: 'length',
      label: 'At least 8 characters',
      isMet: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: '1 lowercase letter',
      isMet: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: '1 uppercase letter',
      isMet: /[A-Z]/.test(password),
    },
    {
      id: 'special',
      label: '1 special character',
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ]
}

const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const metRequirements = getPasswordRequirements(password).filter((requirement) => requirement.isMet).length

  if (metRequirements <= 1) {
    return 'weak'
  }

  if (metRequirements <= 3) {
    return 'medium'
  }

  return 'strong'
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Gets the auth actions from the Zustand auth store.
  const { signIn, signUp } = useAuth()
  
  // Controls whether the modal is in login or signup mode.
  const [mode, setMode] = useState<AuthMode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Stores the latest form error message.
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Indicates whether the current form mode is signup.
  const isSignUp = mode === 'signup'
  const passwordRequirements = getPasswordRequirements(password)
  const passwordStrength = getPasswordStrength(password)

  // Sends the login form data to the auth store.
  const submitSignIn = async (): Promise<void> => {
    await signIn({ email, password })
  }

  // Sends the signup form data to the auth store.
  const submitSignUp = async (): Promise<void> => {
    await signUp({
      name: name.trim() || undefined,
      email,
      password,
    })
  }

  // Submits either login or signup and handles UI feedback.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (isSignUp) {
        await submitSignUp()
      } else {
        await submitSignIn()
      }

      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Switches between login and signup modes.
  const switchMode = (nextMode: AuthMode): void => {
    setMode(nextMode)
    setError(null)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button className="auth-modal__backdrop" type="button" aria-label="Close login modal" onClick={onClose} />
      <div className="auth-modal__panel">
        <div className="auth-modal__header">
          <h2 id="auth-modal-title">{isSignUp ? 'Create account' : 'Log in'}</h2>
          <button className="auth-modal__close" type="button" aria-label="Close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="auth-modal__tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signin' ? 'is-active' : ''}
            onClick={() => switchMode('signin')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {isSignUp && (
            <div className="auth-modal__password-feedback" aria-live="polite">
              <div className="auth-modal__strength">
                <span>Password strength</span>
                <strong className={`auth-modal__strength-value auth-modal__strength-value--${passwordStrength}`}>
                  {passwordStrength}
                </strong>
              </div>
              <ul className="auth-modal__password-rules">
                {passwordRequirements.map((requirement) => (
                  <li
                    key={requirement.id}
                    className={requirement.isMet ? 'is-met' : ''}
                  >
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="auth-modal__error">{error}</p>}

          <button className="auth-modal__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait' : isSignUp ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
