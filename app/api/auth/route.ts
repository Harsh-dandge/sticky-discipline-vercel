import { NextRequest, NextResponse } from 'next/server';
import { login, loginWithGoogle, register, logout } from '@/services/auth';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, displayName } = await request.json();

    switch (action) {
      case 'login': {
        const user = await login(email, password);
        return NextResponse.json({ user });
      }
      case 'googleLogin': {
        const user = await loginWithGoogle();
        return NextResponse.json({ user });
      }
      case 'register': {
        const user = await register(email, password, displayName);
        return NextResponse.json({ user });
      }
      case 'logout': {
        await logout();
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: unknown }).message
          : undefined;

    return NextResponse.json(
      { error: typeof errorMessage === 'string' ? errorMessage : 'Unknown error' },
      { status: 401 }
    );
  }
}
