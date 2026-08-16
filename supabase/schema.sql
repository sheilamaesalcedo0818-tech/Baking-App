-- Baking App schema (fresh install)
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('pastries', 'bread', 'cake')),
  name text not null,
  base_weight numeric not null check (base_weight > 0),
  created_at timestamptz not null default now()
);

create table if not exists ingredient_sections (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null default 'Ingredients',
  position int not null default 0
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references ingredient_sections(id) on delete cascade,
  name text not null,
  quantity numeric not null check (quantity >= 0),
  unit text not null,
  position int not null default 0
);

create index if not exists sections_recipe_id_idx on ingredient_sections(recipe_id);
create index if not exists ingredients_section_id_idx on ingredients(section_id);
create index if not exists recipes_category_idx on recipes(category);

alter table recipes enable row level security;
alter table ingredient_sections enable row level security;
alter table ingredients enable row level security;

create policy "anon all recipes" on recipes for all using (true) with check (true);
create policy "anon all sections" on ingredient_sections for all using (true) with check (true);
create policy "anon all ingredients" on ingredients for all using (true) with check (true);
