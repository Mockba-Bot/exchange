import { useState, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import { getLocalePathFromPathname, i18n } from "@orderly.network/i18n";
import TermsModal from "@/components/smartbot/TermsModal";
import "./styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const localePath = getLocalePathFromPathname(location.pathname);
  const [showTerms, setShowTerms] = useState(false);
  const [isClient, setIsClient] = useState(false); // SSR-safe check

  useEffect(() => {
    setIsClient(true); // Marks this as client-side
    const termsAccepted = localStorage.getItem('terms');
    if (!termsAccepted) {
      setShowTerms(true);
    }
  }, []);

  if (localePath && localePath !== i18n.language) {
    i18n.changeLanguage(localePath);
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
      </head>
      <body id="root" className="h-full m-0 p-0">
        {isClient && (
          <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
        )}
        <OrderlyProvider>{children}</OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App() {
  return <Outlet />;
}
