import { describe, it, expect } from 'vitest'
import { validateFormField } from '@/utils/validation'

// ─── required ────────────────────────────────────────────────────────────────

describe('validateFormField — required', () => {
  const field = { label: 'Name', required: true }

  it('fails when value is empty string', () => {
    const result = validateFormField(field, '')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Name')
  })

  it('fails when value is whitespace only', () => {
    const result = validateFormField(field, '   ')
    expect(result.success).toBe(false)
  })

  it('passes when value is provided', () => {
    expect(validateFormField(field, 'John').success).toBe(true)
  })
})

// ─── minLength ────────────────────────────────────────────────────────────────

describe('validateFormField — minLength', () => {
  const field = { label: 'Bio', required: false, minLength: 10 }

  it('fails when value is shorter than minLength', () => {
    const result = validateFormField(field, 'Short')
    expect(result.success).toBe(false)
    expect(result.error).toContain('10')
  })

  it('passes when value meets minLength', () => {
    expect(validateFormField(field, 'Long enough text').success).toBe(true)
  })
})

// ─── maxLength ────────────────────────────────────────────────────────────────

describe('validateFormField — maxLength', () => {
  const field = { label: 'Code', required: false, maxLength: 5 }

  it('fails when value exceeds maxLength', () => {
    const result = validateFormField(field, 'TooLongValue')
    expect(result.success).toBe(false)
    expect(result.error).toContain('5')
  })

  it('passes when value is within maxLength', () => {
    expect(validateFormField(field, 'ABC').success).toBe(true)
  })
})

// ─── pattern ─────────────────────────────────────────────────────────────────

describe('validateFormField — pattern', () => {
  const field = {
    label: 'Email',
    required: false,
    pattern: '^[^@]+@[^@]+\\.[^@]+$',
    patternErrorMessage: 'Invalid email',
  }

  it('fails when value does not match pattern', () => {
    const result = validateFormField(field, 'not-an-email')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email')
  })

  it('passes when value matches pattern', () => {
    expect(validateFormField(field, 'user@example.com').success).toBe(true)
  })
})

// ─── number ──────────────────────────────────────────────────────────────────

describe('validateFormField — number type', () => {
  const field = { label: 'Age', required: false, type: 'number', min: 18, max: 65 }

  it('fails for non-numeric string', () => {
    const result = validateFormField(field, 'abc')
    expect(result.success).toBe(false)
    expect(result.error).toContain('number')
  })

  it('fails when below min', () => {
    const result = validateFormField(field, '10')
    expect(result.success).toBe(false)
    expect(result.error).toContain('18')
  })

  it('fails when above max', () => {
    const result = validateFormField(field, '70')
    expect(result.success).toBe(false)
    expect(result.error).toContain('65')
  })

  it('passes for valid number in range', () => {
    expect(validateFormField(field, '30').success).toBe(true)
  })

  it('passes for boundary min value', () => {
    expect(validateFormField(field, '18').success).toBe(true)
  })

  it('passes for boundary max value', () => {
    expect(validateFormField(field, '65').success).toBe(true)
  })
})

// ─── optional field ───────────────────────────────────────────────────────────

describe('validateFormField — optional field', () => {
  const field = { label: 'Notes', required: false }

  it('passes when value is empty and field is not required', () => {
    expect(validateFormField(field, '').success).toBe(true)
  })
})
