import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { order_id, amount, currency } = await req.json();
    const merchant_id = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_SECRET;

    if (!merchant_id || !merchant_secret) {
      return NextResponse.json({ error: 'Missing PayHere credentials' }, { status: 500 });
    }

    // PayHere Hash generation logic:
    // md5(merchant_id + order_id + amount_format + currency + md5(merchant_secret))
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    
    // Amount must be completely formatted to 2 decimals without commas
    const amountFormatted = parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
    
    const hashString = merchant_id + order_id + amountFormatted + currency + hashedSecret;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    console.log("=== PayHere Hash Debug ===");
    console.log("Merchant ID:", merchant_id);
    console.log("Order ID:", order_id);
    console.log("Generated Amount String:", amountFormatted);
    console.log("Raw Hash String (Before MD5):", hashString);
    console.log("Final Uppercase Hash:", hash);
    console.log("==========================");

    return NextResponse.json({ hash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
