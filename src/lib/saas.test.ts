import { describe, expect, it } from 'bun:test';
import { PLANS, trialDays, freeSlots } from './saas';
import { DEFAULT_SETTINGS } from './slots';
describe('SaaS rules', () => {
  it('Solo costs 49 monthly', () => expect(PLANS[0].price).toBe(49));
  it('Salão costs 89 monthly', () => expect(PLANS[1].price).toBe(89));
  it('Academia costs 149 monthly', () => expect(PLANS[2].price).toBe(149));
  it('trial lasts five days', () => expect(trialDays('2026-11-15T12:00:00Z', new Date('2026-11-10T12:00:00Z'))).toBe(5));
  it('expired trial has no remaining days', () => expect(trialDays('2026-11-15T12:00:00Z', new Date('2026-11-16T12:00:00Z'))).toBe(0));
  it('overlapping appointment cannot be offered', () => expect(freeSlots({ ...DEFAULT_SETTINGS, slot_interval_minutes: 30 }, new Date(2026, 10, 16), 60, [{ time: '09:00', duration: 60 }])).not.toContain('09:30'));
  it('different professional free schedule remains available', () => expect(freeSlots(DEFAULT_SETTINGS, new Date(2026, 10, 16), 60, [])).toContain('09:00'));
});