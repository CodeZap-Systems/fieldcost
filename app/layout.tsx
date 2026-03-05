import './globals.css';
import AppNav from './components/AppNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="js-focus-visible" data-js-focus-visible="" suppressHydrationWarning>
      <body>
        <div className="workspace-shell">
          <AppNav />
          <main className="workspace-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
