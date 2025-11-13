import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log del webhook recibido (útil para debugging)
    console.log('Farcaster webhook received:', body);

    // Aquí puedes procesar eventos de Farcaster si los necesitas
    // Por ahora, simplemente respondemos con éxito

    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Endpoint de verificación para Farcaster
  return NextResponse.json({
    status: 'ok',
    app: 'Vesting Scheduler',
    version: '1.0.0'
  });
}
