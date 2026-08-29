import { expect, test } from '@playwright/test'

test('smoke: home → practice → answer → result → next', async ({ page }) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: /PL-400 Syntax Trainer/i })).toBeVisible()

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Practice' }).click()
  await page.getByRole('button', { name: /Quick 10/i }).click()

  await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible()
  const answer = page.getByLabel(/Your answer/i)
  if (await answer.isVisible()) {
    await answer.fill('Filter')
    await page.getByRole('button', { name: /^Check$/i }).click()
  } else {
    await page.getByRole('button', { name: /Reveal/i }).click()
  }

  await expect(page.getByText(/Correct answer/i)).toBeVisible()
  await page.getByRole('button', { name: /Next question/i }).click()
  await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible()
})
