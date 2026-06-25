import { expect, test } from '@playwright/test'
import { integrationCourse } from './helpers/test_data'

test('lista de cursos carrega dados reais da API', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.getByTestId(`course-card-${integrationCourse.slug}`)).toBeVisible()
  await expect(page.getByRole('heading', { name: integrationCourse.title })).toBeVisible()
  await expect(page.getByTestId(`course-card-${integrationCourse.slug}`).getByRole('link', { name: 'View course' }))
    .toHaveAttribute('href', `/courses/${integrationCourse.slug}`)
})
