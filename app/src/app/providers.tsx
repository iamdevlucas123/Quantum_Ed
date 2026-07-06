'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../context/auth_store'

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const refreshSession = useAuthStore((state) => state.refreshSession)

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  return children
}
