create table if not exists user_stats (
  user_id uuid references auth.users primary key,
  streak integer default 1,
  total_sessions integer default 0,
  updated_at timestamp default now()
);
