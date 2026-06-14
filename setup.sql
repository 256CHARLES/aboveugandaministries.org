-- Run this in Supabase SQL Editor
-- Table: messages (contact form submissions)
create table if not exists messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Table: subscribers (newsletter signups)
create table if not exists subscribers (
  id bigint generated always as identity primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Table: posts (blog posts)
create table if not exists posts (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  created_at timestamptz default now()
);

-- Table: gallery (photos)
create table if not exists gallery (
  id bigint generated always as identity primary key,
  url text not null,
  cap text not null,
  cat text not null,
  created_at timestamptz default now()
);

-- Table: stats (site stats)
create table if not exists stats (
  id bigint generated always as identity primary key,
  children int default 69,
  meals int default 2070,
  years int default 5,
  pct int default 100,
  founded text default '2019',
  district text default 'Bugiri District, Eastern Uganda',
  founder text default 'Katerega Mayanja',
  email text default 'aboveugandaministries@gmail.com',
  phone text default '+256 757 519162',
  gofundme text default 'https://www.gofundme.com/f/aboveugandaministries',
  updated_at timestamptz default now()
);

-- Insert default stats row
insert into stats (children) values (69) on conflict do nothing;

-- Allow public read/write (since we handle auth in the app itself)
alter table messages enable row level security;
alter table subscribers enable row level security;
alter table posts enable row level security;
alter table gallery enable row level security;
alter table stats enable row level security;

create policy "allow all messages" on messages for all using (true) with check (true);
create policy "allow all subscribers" on subscribers for all using (true) with check (true);
create policy "allow all posts" on posts for all using (true) with check (true);
create policy "allow all gallery" on gallery for all using (true) with check (true);
create policy "allow all stats" on stats for all using (true) with check (true);
