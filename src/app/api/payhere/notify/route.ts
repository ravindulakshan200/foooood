import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    
    // Extract PayHere response variables
    const merchant_id = data.get('merchant_id') as string;
    const order_id = data.get('order_id') as string;
    const payhere_amount = data.get('payhere_amount') as string;
    const payhere_currency = data.get('payhere_currency') as string;
    const status_code = data.get('status_code') as string;
    const md5sig = data.get('md5sig') as string;

    const merchant_secret = process.env.PAYHERE_SECRET || "";

    // 1. Generate local MD5
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const localMd5sig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    // 2. Compare matching MD5 payload to securely verify requests are genuinely coming from PayHere
    if (localMd5sig === md5sig) {
      if (status_code === '2') { // 2 = Success in PayHere
        // Update the order via Server-Side Supabase client
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', order_id);
      } else if (status_code === '-1' || status_code === '-2') {
        // Canceled / Failed
        // Log it, maybe update status to 'failed'
        await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order_id);
      }
    }

    // Always formally return 200 OK so PayHere doesn't keep retrying Webhook
    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
