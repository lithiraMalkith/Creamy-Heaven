/**
 * Email service using Brevo (transactional email API).
 * All functions are fire-and-forget — call with .catch() to prevent blocking.
 *
 * Currently stubbed to console.log until Brevo API key is configured.
 */

interface OrderEmailData {
  orderRef: string
  customer: { name: string; email: string; phone: string }
  items: { productName: string; quantity: number; price: number }[]
  total: number
  fulfilmentType: 'delivery' | 'pickup'
  status?: string
  cancellationReason?: string
}

export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<void> {
  if (!process.env.BREVO_API_KEY) {
    console.log(`[EMAIL STUB] Order confirmation for ${order.orderRef} → ${order.customer.email}`)
    return
  }

  // TODO: Implement Brevo API call
  console.log(`[EMAIL] Sending order confirmation for ${order.orderRef} to ${order.customer.email}`)
}

export async function sendNewOrderAlertEmail(order: OrderEmailData): Promise<void> {
  if (!process.env.BREVO_API_KEY) {
    console.log(`[EMAIL STUB] New order alert for ${order.orderRef}`)
    return
  }

  // TODO: Implement Brevo API call
  console.log(`[EMAIL] Sending new order alert for ${order.orderRef}`)
}

export async function sendOrderStatusUpdateEmail(order: OrderEmailData): Promise<void> {
  if (!process.env.BREVO_API_KEY) {
    console.log(`[EMAIL STUB] Status update for ${order.orderRef} → ${order.status}`)
    return
  }

  // TODO: Implement Brevo API call
  console.log(`[EMAIL] Sending status update for ${order.orderRef}`)
}

export async function sendOrderCancellationEmail(order: OrderEmailData): Promise<void> {
  if (!process.env.BREVO_API_KEY) {
    console.log(`[EMAIL STUB] Cancellation for ${order.orderRef}: ${order.cancellationReason}`)
    return
  }

  // TODO: Implement Brevo API call
  console.log(`[EMAIL] Sending cancellation email for ${order.orderRef}`)
}
