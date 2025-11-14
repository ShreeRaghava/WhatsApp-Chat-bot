// index.js
import fetch from 'node-fetch';

// Helper: safe JSON response
const send = (res, code, body) => res.status(code).json(body);

/**
 * Cloud Function entry point: getOrderStatus
 * Expects POST JSON body: { order_id: string, phone_number?: string, customer_name?: string }
 * Responds with: { status: 'ok'|'not_found'|'error', order?: {...}, error_code?: string, error_message?: string }
 */
export async function getOrderStatus(req, res) {
  try {
    const { order_id, phone_number, customer_name } = req.body || {};
    if (!order_id || typeof order_id !== 'string') {
      return send(res, 400, { status: 'error', error_code: 'INVALID_INPUT', error_message: 'Missing or invalid order_id' });
    }

    const API_URL = process.env.ORDER_API_URL || '{{ORDER_API_URL}}';
    const API_KEY = process.env.ORDER_API_KEY || 'REPLACE_ME';
    if (!API_URL || !API_KEY) {
      return send(res, 500, { status: 'error', error_code: 'CONFIG_ERROR', error_message: 'Missing ORDER_API_URL or ORDER_API_KEY' });
    }

    const url = `${API_URL.replace(/\/+$/, '')}/${encodeURIComponent(order_id)}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (resp.status === 404) {
      return send(res, 200, { status: 'not_found', error_code: 'ORDER_NOT_FOUND', error_message: 'Order not found' });
    }

    if (!resp.ok) {
      const text = await resp.text();
      return send(res, 502, { status: 'error', error_code: 'BACKEND_ERROR', error_message: `Upstream error: ${resp.status} ${text}` });
    }

    const order = await resp.json();

    // Optional verification - check last4 of phone if provided
    if (phone_number && order.customer_phone) {
      const providedLast4 = phone_number.replace(/[^0-9]/g, '').slice(-4);
      const orderLast4 = (order.customer_phone || '').replace(/[^0-9]/g, '').slice(-4);
      if (providedLast4 && orderLast4 && providedLast4 !== orderLast4) {
        return send(res, 200, { status: 'not_found', error_code: 'VERIFICATION_MISMATCH', error_message: 'Provided phone does not match order' });
      }
    }

    const structured = {
      id: order.id || order.order_id || order_id,
      status: order.status || 'Unknown',
      estimated_delivery: order.estimated_delivery || null,
      last_update: order.last_update || null,
      items: Array.isArray(order.items) ? order.items.map(i => ({ name: i.name, qty: i.qty || i.quantity || 1 })) : [],
      shipping: {
        carrier: order.shipping?.carrier || null,
        tracking_number: order.shipping?.tracking_number || null,
        tracking_url: order.shipping?.tracking_url || null
      },
      customer_name: order.customer_name || customer_name || null
    };

    return send(res, 200, { status: 'ok', order: structured });
  } catch (err) {
    console.error('getOrderStatus error', err);
    return send(res, 500, { status: 'error', error_code: 'UNHANDLED_EXCEPTION', error_message: String(err) });
  }
}
