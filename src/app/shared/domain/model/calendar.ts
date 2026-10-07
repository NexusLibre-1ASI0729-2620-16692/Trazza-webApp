export const todayIso = (): string => new Date().toLocaleDateString('en-CA');

export const currentMonthIso = (): string => todayIso().slice(0, 7);
