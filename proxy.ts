import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// 1. Създаваме middleware-a на next-intl както преди
const intlMiddleware = createMiddleware({
  defaultLocale: 'bg',
  locales: ['bg', 'en'],
  localePrefix: 'always',
  localeDetection: false
});

// 2. Създаваме функцията 'proxy', която Next.js очаква
export function proxy(request: NextRequest) {
  // 3. Изпълняваме next-intl middleware-a вътре в нея
  return intlMiddleware(request);
}

// 4. Оставяме config-а, за да ИГНОРИРАМЕ 'simpletest'
export const config = {
  matcher: ['/((?!api|_next|_vercel|simpletest|.*\\..*).*)']
};