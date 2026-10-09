-- =====================================================================
-- MR Pinturas — Schema do Supabase (tabela de contatos)
-- ---------------------------------------------------------------------
-- COMO USAR:
--   1. Crie um projeto em https://supabase.com (grátis)
--   2. Abra SQL Editor → New query → cole TUDO abaixo → Run
--   3. Pegue URL e chave "anon" em Project Settings → API
--   4. Cole os dois em assets/js/config.js
--
-- A tabela guarda WhatsApp, telefone e e-mail que o site exibe.
-- Para trocar o número no futuro: edite a linha no Table Editor do
-- Supabase (sem precisar republicar o site).
-- =====================================================================

create table if not exists public.contatos (
    id               uuid primary key default gen_random_uuid(),
    tipo             text not null check (tipo in ('whatsapp', 'telefone', 'email', 'rede_social')),
    label            text,                          -- nome interno, ex.: "WhatsApp Orçamentos"
    valor            text not null,                 -- como aparece no site: (31) 98376-0208
    link             text,                          -- https://wa.me/5531983760208 | tel:+55... | mailto:...
    mensagem_padrao  text,                          -- texto pré-preenchido do WhatsApp
    ativo            boolean not null default true,
    ordem            integer not null default 1,
    criado_em        timestamptz not null default now(),
    atualizado_em    timestamptz not null default now()
);

comment on table  public.contatos is 'Contatos oficiais exibidos no site MR Pinturas';
comment on column public.contatos.mensagem_padrao is 'Mensagem que abre pré-preenchida no WhatsApp do cliente';

-- Mantém atualizado_em automático
create or replace function public.atualizar_timestamp()
returns trigger language plpgsql as $$
begin
    new.atualizado_em = now();
    return new;
end $$;

drop trigger if exists trg_contatos_timestamp on public.contatos;
create trigger trg_contatos_timestamp
    before update on public.contatos
    for each row execute function public.atualizar_timestamp();

-- Segurança (RLS): qualquer visitante pode LER contatos ativos;
-- apenas você (logado no painel) pode inserir/editar.
alter table public.contatos enable row level security;

drop policy if exists "leitura publica de contatos ativos" on public.contatos;
create policy "leitura publica de contatos ativos"
    on public.contatos for select
    using (ativo = true);

-- Dados iniciais (edite à vontade no Table Editor depois)
insert into public.contatos (tipo, label, valor, link, mensagem_padrao, ordem) values
    ('whatsapp', 'WhatsApp Orçamentos', '(31) 98376-0208',
     'https://wa.me/5531983760208',
     'Olá! Gostaria de solicitar um orçamento para serviço de pintura.', 1),
    ('telefone', 'Telefone / WhatsApp', '(31) 98376-0208',
     'tel:+5531983760208', null, 2),
    ('email', 'E-mail comercial', 'mrpinturasemgerall@gmail.com',
     'mailto:mrpinturasemgerall@gmail.com', null, 3)
on conflict do nothing;
