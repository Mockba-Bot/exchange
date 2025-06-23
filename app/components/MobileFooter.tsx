import { useIsMobile } from "@/hooks/useIsMobile";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useLocation, Link } from "@remix-run/react";
import {
  BotMessageSquare,
  User,
  ChartNoAxesCombined,
  ChartCandlestick,
  Award,
} from "lucide-react";
import { useTranslation } from "@orderly.network/i18n";
import { PathEnum } from "@/constant";

// Icon mapping for each route
const iconMap: Record<string, JSX.Element> = {
  [PathEnum.SmartBot]: <BotMessageSquare className="oui-w-5 oui-h-5" />,
  [PathEnum.Root]: <ChartCandlestick className="oui-w-5 oui-h-5" />,
  [PathEnum.Portfolio]: <User className="oui-w-5 oui-h-5" />,
  [PathEnum.Markets]: <ChartNoAxesCombined className="oui-w-5 oui-h-5" />,
  [PathEnum.Leaderboard]: <Award className="oui-w-5 oui-h-5" />,
};

export function MobileFooter() {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();
  const { scaffold } = useOrderlyConfig();
  const location = useLocation();

  if (!isMobile) return null;

  const lang = i18n.language || "en";
  const currentPath = location.pathname;

  // Explicitly define the ordered paths we want in the footer
  const orderedHrefs = [
    PathEnum.SmartBot,
    PathEnum.Root,
    PathEnum.Portfolio,
    PathEnum.Markets,
    PathEnum.Leaderboard,
  ];

  // Safely map and filter menu items with fallbacks for translations
  const menus = orderedHrefs
    .map((href) => {
      switch (href) {
        case PathEnum.SmartBot:
          return { name: t("common.smartBot") || "Smart", href };
        case PathEnum.Root:
          return { name: t("common.trading") || "Trade", href };
        case PathEnum.Portfolio:
          return { name: t("common.portfolio") || "Portfolio", href };
        case PathEnum.Markets:
          return { name: t("common.markets") || "Markets", href };
        case PathEnum.Leaderboard:
          return { name: t("tradingLeaderboard.leaderboard") || "Leaderboard", href };
        default:
          return null;
      }
    })
    .filter((m): m is { name: string; href: string } => !!m);


  const cleanPath = (path: string) => path.replace(/\/+$/, "");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50
                oui-h-16 oui-bg-base-7 oui-border-t oui-border-base-4
                oui-flex oui-justify-evenly oui-items-center px-2">
      {menus.map((menu) => {
        const isRoot = menu.href === PathEnum.Root;

        const symbol = isRoot
          ? localStorage.getItem("orderly-current-symbol") || ""
          : "";

        const fullPath = isRoot
          ? symbol
            ? `/${lang}/perp/${symbol}`
            : `/${lang}/`
          : `/${lang}${menu.href}`.replace(/\/+$/, "") || "/";

        const isActive = cleanPath(currentPath) === cleanPath(fullPath);

        return (
          <Link
            key={menu.href}
            to={fullPath}
            className={`oui-flex oui-h-16 oui-flex-col oui-items-center oui-justify-center
                        oui-text-2xs oui-font-bold oui-gap-1 oui-flex-shrink-0 oui-basis-1/5 oui-pt-2 oui-pb-1
                        oui-cursor-pointer
                        ${isActive ? "oui-text-white" : "oui-text-base-contrast-36 hover:oui-text-white"}`}
          >
            {iconMap[menu.href] || <div className="oui-w-5 oui-h-5" />}
            <span className="oui-font-bold">{menu.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
