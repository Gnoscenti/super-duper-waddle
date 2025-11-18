export type CreditPlan = 'GUEST' | 'SINGLE' | 'SUBSCRIPTION';

export async function getRemainingCredits(_userId?: string): Promise<{ plan: CreditPlan; remaining: number }> {
  // TODO: Stage 2 – fetch real counts from Supabase plans/jobs tables.
  return { plan: 'GUEST', remaining: 2 };
}

export async function consumeCredit(_userId?: string) {
  // TODO: Stage 2 – decrement credit usage atomically in Supabase.
  throw new Error('consumeCredit not implemented.');
}
