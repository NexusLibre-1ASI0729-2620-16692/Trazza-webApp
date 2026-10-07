export type Party = 'carrier' | 'merchant';

export const PARTIES: readonly Party[] = Object.freeze(['carrier', 'merchant']);

export const isParty = (value: string | null | undefined): value is Party => PARTIES.includes(value as Party);
