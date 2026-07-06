'use client'

import RequireAuth from '../../../../../components/require_auth'
import LessonsViewer from '../../../../../route_pages/lessons_viewer'

export default function LessonPage() {
  return (
    <RequireAuth>
      <LessonsViewer />
    </RequireAuth>
  )
}
