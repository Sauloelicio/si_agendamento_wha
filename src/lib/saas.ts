import { generateSlots, toMin, type BusinessSettings } from './slots';
export const LEGACY_ID = '00000000-0000-0000-0000-000000000001';
export const PLANS = [
  { id: 'solo', name: 'Básico / Solo', price: 49, audience: 'Para quem faz acontecer por conta própria.', features: ['Página exclusiva de agendamento', 'Serviços e horários personalizados', 'Confirmação pelo WhatsApp', 'Painel da sua agenda'] },
  { id: 'pro', name: 'Profissional / Salão', price: 89, audience: 'Uma agenda organizada para toda a equipe.', features: ['Tudo do Básico / Solo', 'Agenda por profissional', 'Equipe sem cobrança adicional', 'Personalização do negócio'] },
  { id: 'classes', name: 'Academia & Turmas', price: 149, audience: 'Para academias e estúdios coletivos.', features: ['Tudo do Profissional / Salão', 'Agendamentos individuais', 'Serviços e equipe organizados', 'Turmas coletivas em breve'] },
] as const;
export const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
export const trialDays = (end: string, now = new Date()) => Math.max(0, Math.ceil((new Date(end).getTime() - now.getTime()) / 86400000));
export const freeSlots = (settings: BusinessSettings, date: Date, duration: number, occupied: { time: string; duration: number }[]) => generateSlots({ ...settings, service_minutes: duration }, date).filter(t => !occupied.some(o => toMin(t) < toMin(o.time) + o.duration && toMin(t) + duration > toMin(o.time)));
export const SUGGESTIONS: Record<string, { name: string; duration: number; price: number }[]> = {
  Barbearia: [{ name: 'Corte de cabelo', duration: 40, price: 40 }, { name: 'Corte + barba', duration: 60, price: 65 }],
  Salão: [{ name: 'Manicure', duration: 60, price: 35 }, { name: 'Gel na tips', duration: 90, price: 100 }],
  'Pet Shop': [{ name: 'Banho', duration: 60, price: 50 }, { name: 'Banho e tosa', duration: 90, price: 85 }],
  Estética: [{ name: 'Limpeza de pele', duration: 60, price: 100 }],
  Academia: [{ name: 'Avaliação física', duration: 60, price: 80 }],
  Outros: [{ name: 'Atendimento', duration: 60, price: 0 }],
};