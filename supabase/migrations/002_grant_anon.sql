-- Grant table privileges to anon so the Supabase JS client (using the anon key)
-- can read/write. RLS policies are already permissive; this fixes the underlying
-- "permission denied for table ..." Postgres error.

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on recipes, ingredient_sections, ingredients to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;
