// scripts/test-unit-filtering.js
// Test the unit filtering normalization logic
// Usage: node scripts/test-unit-filtering.js

const UNIT_MAPPING = {
  'deals': 'Deals',
  'dq-delivery-accounts': 'DQ Delivery (Accounts)',
  'dq-delivery-deploys': 'DQ Delivery (Deploys)',
  'dq-delivery-designs': 'DQ Delivery (Designs)',
  'finance': 'Finance',
  'hra': 'HRA',
  'intelligence': 'Intelligence',
  'products': 'Products',
  'secdevops': 'SecDevOps',
  'solutions': 'Solutions',
  'stories': 'Stories'
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Test cases
console.log('Testing unit filtering normalization:\n')

for (const [filterId, dbValue] of Object.entries(UNIT_MAPPING)) {
  const normalizedDbValue = slugify(dbValue)
  const match = normalizedDbValue === filterId
  
  console.log(`Filter ID: "${filterId}"`)
  console.log(`  DB Value: "${dbValue}"`)
  console.log(`  Normalized: "${normalizedDbValue}"`)
  console.log(`  Match: ${match ? '✓' : '✗'}`)
  console.log()
}

// Test with actual database values
const testDbValues = [
  'Deals',
  'DQ Delivery (Accounts)',
  'DQ Delivery (Deploys)',
  'DQ Delivery (Designs)',
  'Finance',
  'HRA',
  'Intelligence',
  'Products',
  'SecDevOps',
  'Solutions',
  'Stories'
]

console.log('Testing with actual database values:\n')
for (const dbValue of testDbValues) {
  const normalized = slugify(dbValue)
  let matched = false
  let matchedId = null
  
  for (const [filterId] of Object.entries(UNIT_MAPPING)) {
    if (normalized === filterId) {
      matched = true
      matchedId = filterId
      break
    }
  }
  
  console.log(`"${dbValue}" -> "${normalized}" ${matched ? `✓ matches "${matchedId}"` : '✗ no match'}`)
}

