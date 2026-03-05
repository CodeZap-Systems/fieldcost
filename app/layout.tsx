import './globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="js-focus-visible" data-js-focus-visible="" suppressHydrationWarning>
      <body>
        <div className="workspace-shell">
          <Sidebar />
          <main className="workspace-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
