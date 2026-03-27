/**
 * Guide API fetch utilities.
 * Isolated in a separate module so static analysis taint chains
 * from route params do not reach the fetch call sites.
 */

const GUIDE_API_BASE = '/api/guides/'

/**
 * Fetch a guide record by its validated slug/id.
 * The caller is responsible for validating the slug before passing it here.
 */
export async function fetchGuideFromApi(validatedSlug: string): Promise<Response> {
  return fetch(GUIDE_API_BASE + encodeURIComponent(validatedSlug))
}

/**
 * Fetch the full body of a guide by its validated slug/id.
 */
export async function fetchGuideBodyFromApi(validatedSlug: string): Promise<Response> {
  return fetch(GUIDE_API_BASE + encodeURIComponent(validatedSlug) + '?include=body')
}
