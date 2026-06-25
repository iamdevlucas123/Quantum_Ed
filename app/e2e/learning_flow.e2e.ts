import { expect, test } from '@playwright/test'
import { logout, signUp } from './helpers/auth'
import { createE2EUser, integrationCourse } from './helpers/test_data'

test('usuario autenticado acessa curso, lesson viewer, marca progresso, edita profile e faz logout', async ({ page }) => {
  const user = createE2EUser('learning')
  const bio = `E2E test bio ${Date.now()}`

  await page.goto('/')
  await signUp(page, user)

  await page.goto(`/courses/${integrationCourse.slug}`)
  await expect(page.getByRole('heading', { name: integrationCourse.title })).toBeVisible()
  await expect(page.getByRole('heading', { name: integrationCourse.module })).toBeVisible()

  await page.getByRole('link', { name: new RegExp(integrationCourse.firstLesson) }).click()
  await expect(page).toHaveURL(new RegExp(`/courses/${integrationCourse.slug}/lessons/${integrationCourse.firstLessonSlug}$`))
  await expect(page.getByRole('heading', { name: integrationCourse.firstLesson })).toBeVisible()

  await page.getByTestId('lesson-complete-toggle').click()
  await expect(page.getByTestId('lesson-complete-toggle')).toHaveText('Lesson completed')
  await page.reload()
  await expect(page.getByText('Completed').first()).toBeVisible()

  await page.goto('/profile')
  await expect(page).toHaveURL(/\/profile$/)
  await page.getByRole('button', { name: 'Update Bio' }).click()
  await page.getByLabel('Profile bio').fill(bio)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText(bio).first()).toBeVisible()

  await page.getByTestId('profile-avatar-input').setInputFiles('public/assets/icons/google_image_auth.jpg')
  await expect(page.getByAltText(`${user.name} profile`)).toBeVisible()
  await page.reload()
  await expect(page.getByText(bio).first()).toBeVisible()
  await expect(page.getByAltText(`${user.name} profile`)).toBeVisible()

  await logout(page)
  await page.goto('/profile')
  await expect(page.getByTestId('auth-open-button')).toBeVisible()
})
