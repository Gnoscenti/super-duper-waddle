export type PlanType = 'SINGLE' | 'SUBSCRIPTION';

export async function createCheckoutSession(_plan: PlanType) {
  // TODO: Stage 2 – instantiate Stripe SDK with STRIPE_SECRET_KEY and return Checkout Session URL.
  throw new Error('Stripe checkout not implemented yet.');
}

export async function verifyWebhookSignature(_rawBody: Buffer, _signature: string) {
  // TODO: Stage 2 – verify Stripe signature using STRIPE_WEBHOOK_SECRET and return event payload.
  throw new Error('Stripe webhook verification not implemented yet.');
}
