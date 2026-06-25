export const integrationCourse = {
  slug: 'integration-test-course',
  title: 'Integration Test Course',
  module: 'Integration Test Module',
  firstLesson: 'Integration Test Lesson',
  firstLessonSlug: 'integration-test-lesson',
  secondLesson: 'Integration Next Lesson',
}

export const e2ePassword = 'StrongPass!123'

export type E2EUser = {
  name: string
  email: string
  password: string
}

export const createE2EUser = (scope = 'learner'): E2EUser => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return {
    name: `E2E ${scope}`,
    email: `e2e+${scope}+${suffix}@example.com`,
    password: e2ePassword,
  }
}
