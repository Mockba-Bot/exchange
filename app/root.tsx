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
import "./styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const localePath = getLocalePathFromPathname(location.pathname);

  if (localePath && localePath !== i18n.language) {
    i18n.changeLanguage(localePath);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
      </head>
      <body>
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
