import { expect, test } from '@playwright/test'
import { logout, signIn, signUp } from './helpers/auth'
import { createE2EUser } from './helpers/test_data'

test('signup e signin funcionam', async ({ page }) => {
  const user = createE2EUser('auth')

  await page.goto('/')
  await signUp(page, user)
  await logout(page)
  await signIn(page, user)

  await expect(page.getByRole('link', { name: user.name })).toBeVisible()
})
