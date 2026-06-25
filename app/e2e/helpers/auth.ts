import { expect, type Page } from '@playwright/test'
import type { E2EUser } from './test_data'

export const openAuthModal = async (page: Page): Promise<void> => {
  await page.getByTestId('auth-open-button').click()
  await expect(page.getByRole('dialog', { name: /log in|create account/i })).toBeVisible()
}

export const signUp = async (page: Page, user: E2EUser): Promise<void> => {
  await openAuthModal(page)
  const dialog = page.getByRole('dialog')

  await dialog.getByRole('button', { name: 'Sign up' }).click()
  await dialog.getByLabel('Name').fill(user.name)
  await dialog.getByLabel('Email').fill(user.email)
  await dialog.getByLabel('Password').fill(user.password)
  await dialog.getByTestId('auth-signup-submit').click()

  await expect(page.getByRole('link', { name: user.name })).toBeVisible()
}

export const signIn = async (page: Page, user: E2EUser): Promise<void> => {
  await openAuthModal(page)
  const dialog = page.getByRole('dialog')

  await dialog.getByRole('button', { name: 'Log in' }).click()
  await dialog.getByLabel('Email').fill(user.email)
  await dialog.getByLabel('Password').fill(user.password)
  await dialog.getByTestId('auth-signin-submit').click()

  await expect(page.getByRole('link', { name: user.name })).toBeVisible()
}

export const logout = async (page: Page): Promise<void> => {
  await page.getByTestId('logout-button').click()
  await expect(page.getByTestId('auth-open-button')).toBeVisible()
}
