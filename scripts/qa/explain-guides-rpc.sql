-- Example EXPLAIN ANALYZE for rpc_guides_search
explain analyze select * from public.rpc_guides_search(
  'digital',
  ARRAY['Digital Workspace']::text[],
  ARRAY['SOP']::text[],
  ARRAY[]::text[],
  'Approved',
  'updated',
  24,
  null
);

explain analyze select * from public.rpc_guides_search(
  null,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Approved',
  'downloads',
  24,
  null
);

