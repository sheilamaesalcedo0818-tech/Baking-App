-- Migration: introduce ingredient_sections. Safe to run on an existing DB
-- that has the original recipes + ingredients(recipe_id, ...) schema.

create table if not exists ingredient_sections (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null default 'Ingredients',
  position int not null default 0
);

alter table ingredients add column if not exists section_id uuid references ingredient_sections(id) on delete cascade;
alter table ingredients add column if not exists position int not null default 0;

-- Backfill: one "Ingredients" section per existing recipe, and point existing rows at it.
do $$
declare r record;
declare sid uuid;
begin
  for r in select id from recipes loop
    insert into ingredient_sections (recipe_id, name, position)
    values (r.id, 'Ingredients', 0)
    returning id into sid;

    update ingredients set section_id = sid where recipe_id = r.id;
  end loop;
end $$;

alter table ingredients alter column section_id set not null;
alter table ingredients drop column if exists recipe_id;

create index if not exists sections_recipe_id_idx on ingredient_sections(recipe_id);
create index if not exists ingredients_section_id_idx on ingredients(section_id);

alter table ingredient_sections enable row level security;
create policy "anon all sections" on ingredient_sections for all using (true) with check (true);
