import { useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { getSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

export function useNav() {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }

      const lang = parseI18nLang(i18n.language);

      if (option.href === "/") {
        const symbol = getSymbol();
        navigate(`/${lang}${PathEnum.Perp}/${symbol}`);
        return;
      }

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path = routeMap[option.href] || option.href;

      navigate(`/${lang}${path}`);
    },
    [navigate]
  );

  return { onRouteChange };
}
