create extension if not exists "uuid-ossp";

create table if not exists team_invites (
  id uuid default uuid_generate_v4() primary key,
  purchaser_email text,
  member_email text,
  redeemed boolean default false,
  created_at timestamp default now()
);

create table if not exists user_subscriptions (
  user_id uuid references auth.users primary key,
  subscription_type text default 'free',
  created_at timestamp default now()
);

create unique index if not exists team_invites_unique_email
  on team_invites (lower(purchaser_email), lower(member_email));
