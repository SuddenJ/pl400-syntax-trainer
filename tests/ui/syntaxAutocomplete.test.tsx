import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SyntaxAutocompleteInput } from '../../src/components/SyntaxAutocompleteInput'

function Harness() {
  const [value, setValue] = useState('')
  return (
    <SyntaxAutocompleteInput
      id="answer"
      value={value}
      onChange={setValue}
      aria-label="Your answer"
    />
  )
}

describe('SyntaxAutocompleteInput', () => {
  it('shows suggestions while typing and widens on backspace', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByLabelText(/Your answer/i)
    await user.click(input)
    await user.type(input, 'IPl')

    const list = await screen.findByRole('listbox', { name: /Syntax suggestions/i })
    expect(list).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'IPluginExecutionContext' })).toBeInTheDocument()

    await user.type(input, '{Backspace}')
    // Still showing I-prefix matches; list remains
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    const optionsAfter = screen.getAllByRole('option')
    expect(optionsAfter.length).toBeGreaterThan(0)
  })

  it('inserts a tapped suggestion into the input', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByLabelText(/Your answer/i)
    await user.type(input, 'IPl')
    await user.click(await screen.findByRole('option', { name: 'IPluginExecutionContext' }))
    expect(input).toHaveValue('IPluginExecutionContext')
  })
})
