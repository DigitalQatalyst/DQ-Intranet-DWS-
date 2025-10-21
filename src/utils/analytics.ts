type EventName = 'Guides.ViewList' | 'Guides.Search' | 'Guides.FilterChanged' | 'Guides.SortChanged' | 'Guides.CardClick' | 'Guides.CTA'

export const track = (name: EventName, payload: Record<string, any>) => {
  try {
    // Hook here to your analytics provider. For now, log once per action.
    console.info('[analytics]', name, payload)
  } catch {}
}

