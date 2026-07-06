'use client'

import RequireAuth from '../../components/require_auth'
import Profile from '../../route_pages/profile'

export default function ProfilePage() {
  return (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  )
}
