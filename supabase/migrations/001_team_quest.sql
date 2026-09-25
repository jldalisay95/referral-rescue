create table if not exists public.team_quest_config (
  id boolean primary key default true check (id = true),
  enabled boolean not null default true,
  max_active_sessions integer not null default 50 check (max_active_sessions > 0),
  max_sessions_24h integer not null default 1000 check (max_sessions_24h > 0),
  updated_at timestamptz not null default now()
);

insert into public.team_quest_config (id) values (true) on conflict (id) do nothing;

create table if not exists public.team_sessions (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-Z2-9]{6}$'),
  host_id uuid not null,
  mode text not null check (mode in ('individual', 'team')),
  question_ids text[] not null check (cardinality(question_ids) in (6, 12, 18)),
  current_index integer not null default 0 check (current_index >= 0),
  status text not null default 'lobby' check (status in ('lobby', 'active', 'reveal', 'complete', 'expired')),
  question_started_at timestamptz,
  deadline_at timestamptz,
  reveal jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create table if not exists public.team_players (
  session_id uuid not null references public.team_sessions(id) on delete cascade,
  user_id uuid not null,
  player_id text not null,
  team_name text not null default '',
  joined_at timestamptz not null default now(),
  score integer not null default 0,
  correct integer not null default 0,
  answered integer not null default 0,
  response_ms integer not null default 0,
  primary key (session_id, user_id),
  unique (session_id, player_id)
);

create table if not exists public.team_answers (
  session_id uuid not null references public.team_sessions(id) on delete cascade,
  question_id text not null,
  user_id uuid not null,
  option_index integer not null check (option_index between 0 and 2),
  answered_at timestamptz not null default now(),
  correct boolean not null,
  score integer not null default 0,
  response_ms integer not null default 0,
  primary key (session_id, question_id, user_id)
);

create table if not exists public.team_scorecards (
  session_id uuid primary key references public.team_sessions(id) on delete cascade,
  scorecard jsonb not null,
  completed_at timestamptz not null default now()
);

create index if not exists team_sessions_expiry_idx on public.team_sessions (expires_at);
create index if not exists team_answers_session_idx on public.team_answers (session_id, question_id);

alter table public.team_quest_config enable row level security;
alter table public.team_sessions enable row level security;
alter table public.team_players enable row level security;
alter table public.team_answers enable row level security;
alter table public.team_scorecards enable row level security;

create or replace function public.team_quest_member(target_session uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.team_sessions s
    where s.id = target_session and s.expires_at > now()
      and (s.host_id = auth.uid() or exists (
        select 1 from public.team_players p where p.session_id = s.id and p.user_id = auth.uid()
      ))
  );
$$;

create policy team_sessions_member_read on public.team_sessions for select to authenticated
  using (public.team_quest_member(id));
create policy team_players_member_read on public.team_players for select to authenticated
  using (public.team_quest_member(session_id));
create policy team_answers_own_read on public.team_answers for select to authenticated
  using (public.team_quest_member(session_id) and user_id = auth.uid());
create policy team_scorecards_member_read on public.team_scorecards for select to authenticated
  using (public.team_quest_member(session_id));

create or replace function public.cleanup_expired_team_quest()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare removed integer;
begin
  delete from public.team_sessions where expires_at <= now();
  get diagnostics removed = row_count;
  return removed;
end;
$$;

-- pg_cron is available on Supabase projects. The guarded block keeps the migration
-- usable when an administrator has not enabled the extension yet; the Edge Function
-- still rejects expired rooms immediately.
do $$
begin
  begin
    create extension if not exists pg_cron with schema extensions;
  exception when others then
    null;
  end;
  if to_regclass('cron.job') is not null then
    execute 'select cron.unschedule(jobid) from cron.job where jobname = ''team-quest-expiry-cleanup''';
    perform cron.schedule('team-quest-expiry-cleanup', '15 * * * *', 'select public.cleanup_expired_team_quest();');
  end if;
end;
$$;

alter publication supabase_realtime add table public.team_sessions;
alter publication supabase_realtime add table public.team_players;
alter publication supabase_realtime add table public.team_scorecards;
