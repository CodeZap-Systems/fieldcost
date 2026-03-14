import './globals.css';
import ClientNavWrapper from './components/ClientNavWrapper';
import { AuthErrorBoundary } from './components/AuthErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="js-focus-visible" data-js-focus-visible="" suppressHydrationWarning>
      <body className="flex h-screen bg-gray-50">
        <AuthErrorBoundary>
          <ClientNavWrapper />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </AuthErrorBoundary>
      </body>
    </html>
  );
}
