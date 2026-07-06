'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { env } from '../../config/env'
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
  const searchParams = useSearchParams()
  
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
  const oauthError = searchParams?.get('oauth_error') ?? null

  useEffect(() => {
    if (!isOpen || !oauthError) {
      return
    }

    setMode('signin')
    setError(oauthError)
  }, [isOpen, oauthError])

  const getOAuthTargetPath = (): string => {
    const nextFromQuery = searchParams?.get('next') ?? null

    if (nextFromQuery && nextFromQuery.startsWith('/')) {
      return nextFromQuery
    }

    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete('login')
    currentUrl.searchParams.delete('oauth_error')
    const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`

    return currentPath || '/'
  }

  const startOAuth = (provider: 'google' | 'github'): void => {
    const nextPath = getOAuthTargetPath()
    window.location.assign(`${env.API_URL}/auth/${provider}?next=${encodeURIComponent(nextPath)}`)
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose()
      }
    }}>
      <DialogContent
        aria-label={isSignUp ? 'Create account' : 'Log in'}
        className="max-h-[min(44rem,calc(100vh-2rem))] overflow-y-auto sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle id="auth-modal-title">{isSignUp ? 'Create account' : 'Log in'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 rounded-md bg-muted p-1" role="tablist" aria-label="Authentication mode">
          <Button
            type="button"
            variant={mode === 'signin' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => switchMode('signin')}
          >
            Log in
          </Button>
          <Button
            type="button"
            variant={mode === 'signup' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => switchMode('signup')}
          >
            Sign up
          </Button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="auth-name">
              Name
              </Label>
              <Input
                id="auth-name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="auth-email">
            Email
            </Label>
            <Input
              id="auth-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auth-password">
            Password
            </Label>
            <Input
              id="auth-password"
              type="password"
              name="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="rounded-md border bg-muted/30 p-3 text-sm" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <span>Password strength</span>
                <strong className={cn(
                  'capitalize',
                  passwordStrength === 'strong' && 'text-emerald-700',
                  passwordStrength === 'medium' && 'text-amber-700',
                  passwordStrength === 'weak' && 'text-destructive'
                )}>
                  {passwordStrength}
                </strong>
              </div>
              <ul className="mt-3 grid gap-1 text-muted-foreground">
                {passwordRequirements.map((requirement) => (
                  <li
                    key={requirement.id}
                    className={cn(requirement.isMet && 'text-emerald-700')}
                  >
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <div className="grid gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => startOAuth('google')}
            >
              <img className="size-4 rounded-sm" alt="" aria-hidden="true" src="/assets/icons/google_image_auth.jpg" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => startOAuth('github')}
            >
              <img className="size-4 rounded-sm" alt="" aria-hidden="true" src="/assets/icons/github_image_auth.png" />
              Continue with GitHub
            </Button>
          </div>

          <Button
            data-testid={isSignUp ? 'auth-signup-submit' : 'auth-signin-submit'}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait' : isSignUp ? 'Create account' : 'Log in'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
