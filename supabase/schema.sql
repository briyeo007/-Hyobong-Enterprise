-- 효봉기업 공실 관리 스키마
-- Supabase 대시보드 → SQL Editor 에 전체 붙여넣고 Run (여러 번 실행해도 안전)

-- 1) 공실 테이블
create table if not exists public.vacancies (
  id             text primary key,
  building       text not null check (building in ('hyobong8', 'bisan', 'hyobong-enterprise')),
  sort_order     integer not null default 0,
  floor          text not null default '',
  unit           text not null default '',
  summary        text not null default '',
  area_contract  numeric not null default 0,
  area_actual    numeric not null default 0,
  deposit        text not null default '',
  rent           text not null default '',
  maintenance    text not null default '',
  available_date date,                                   -- null = 즉시 입주
  status         text not null default 'vacant' check (status in ('vacant', 'in_progress', 'leased')),
  tags           text[] not null default '{}',
  detail_specs   jsonb not null default '[]'::jsonb,
  images         text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists vacancies_building_sort_idx on public.vacancies (building, sort_order);

-- 2) 변경 이력 (수정·삭제 직전 값을 자동 보관 → 실수로 바꾼 내용 복구용)
create table if not exists public.vacancies_history (
  history_id  bigserial primary key,
  vacancy_id  text not null,
  action      text not null,          -- UPDATE / DELETE
  old_row     jsonb not null,
  changed_at  timestamptz not null default now()
);

create index if not exists vacancies_history_vacancy_idx on public.vacancies_history (vacancy_id, changed_at desc);

create or replace function public.vacancies_keep_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.vacancies_history (vacancy_id, action, old_row)
  values (old.id, tg_op, to_jsonb(old));
  return coalesce(new, old);
end;
$$;

drop trigger if exists vacancies_history_trg on public.vacancies;
create trigger vacancies_history_trg
  before update or delete on public.vacancies
  for each row execute function public.vacancies_keep_history();

-- 3) 보안: RLS 활성화 + 정책 없음 = 외부(anon/authenticated) 접근 전면 차단.
--    홈페이지·관리자 서버만 service_role(secret) 키로 접근합니다.
alter table public.vacancies enable row level security;
alter table public.vacancies_history enable row level security;
revoke all on public.vacancies, public.vacancies_history from anon, authenticated;

-- 4) 사진 저장소: 공개 읽기 버킷 (쓰기·삭제는 서버의 service_role만 가능)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vacancy-images', 'vacancy-images', true, 5242880, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
