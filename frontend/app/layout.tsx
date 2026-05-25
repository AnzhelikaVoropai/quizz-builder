import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizPlatform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <header className="header">
          <nav className="header__nav">
            <a href="/" className="header__logo">
              QuizPlatform
            </a>
            <div className="header__links">
              <a href="/">Квізи</a>
              <a href="/create">Створити</a>
            </div>
          </nav>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
