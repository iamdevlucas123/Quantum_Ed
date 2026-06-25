import { expect, test } from '@playwright/test'

test('home carrega', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Train for the next frontier of engineering.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Courses' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Mission tracks for high-signal learners' })).toBeVisible()
})
