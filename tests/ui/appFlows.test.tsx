import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../../src/App'
import { STORAGE_KEY } from '../../src/services/storage'

describe('UI flows', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
  })

  it('loads the home page', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: /PL-400 Syntax Trainer/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10 Questions' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Syntax Scratchpad/i })).toBeInTheDocument()
  })

  it('starts a practice session and can reveal an answer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: '10 Questions' }))
    const reveal = await screen.findByRole('button', { name: /Reveal/i })
    await user.click(reveal)
    expect(await screen.findByText(/Correct answer/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Need practice/i }))
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
  })

  it('navigates to scratchpad', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: /Syntax Scratchpad/i }))
    expect(await screen.findByRole('heading', { name: /Syntax Scratchpad/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Scratchpad editor/i)).toBeInTheDocument()
  })

  it('persists progress after answering', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/practice'
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /Quick 10/i }))
    const answer = await screen.findByLabelText(/Your answer/i)
    await user.clear(answer)
    await user.type(answer, 'Items')
    await user.click(screen.getByRole('button', { name: /^Check$/i }))
    await user.click(await screen.findByRole('button', { name: /Got it/i }))
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(raw).toMatch(/questionStats/)
  })
})
