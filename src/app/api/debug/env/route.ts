import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or specific environments
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEBUG) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const envCheck: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL, 
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      // Show partial values for debugging (masked for security)
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...',
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL,
    },
    prisma: {
      canImport: true,
      clientGenerated: false,
    }
  };

  try {
    const { prisma } = await import('@/lib/prisma');
    envCheck.prisma.clientGenerated = true;
    
    // Test database connection
    await prisma.$connect();
    await prisma.$disconnect();
    envCheck.checks.DATABASE_CONNECTION = true;
  } catch (error) {
    envCheck.checks.DATABASE_CONNECTION = false;
    envCheck.checks.DATABASE_ERROR = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(envCheck);
}