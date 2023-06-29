import { test, expect } from '@playwright/test'
import { get } from '../lib/database'

test('should navigate to the about page', async ({ page }) => {
  await page.goto('http://localhost:3000/dictionary?q=%E5%86%B7%E9%9D%99')

  await page.getByRole('button', { name: 'Add' }).first().click()

  await expect(page.getByPlaceholder('text')).toBeVisible()

  await page.getByRole('button', { name: 'Save' }).first().click()
})

test('test title', async () => {
  const db = await get()
  expect(db).toEqual(2)
})
