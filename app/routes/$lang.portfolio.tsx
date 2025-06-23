import { useMemo } from "react";
import { Outlet } from "@remix-run/react";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@orderly.network/portfolio";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { useIsMobile } from "@/hooks/useIsMobile"; // ✅ Add this
import { MobileFooter } from "@/components/MobileFooter"; // ✅ Add this
import { PathEnum } from "@/constant";

export default function PortfolioLayout() {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const isMobile = useIsMobile(); // ✅

  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (path.endsWith(PathEnum.FeeTier))
      return PortfolioLeftSidebarPath.FeeTier;

    if (path.endsWith(PathEnum.ApiKey)) return PortfolioLeftSidebarPath.ApiKey;

    return path;
  }, [path]);

  return (
    <>
      <PortfolioLayoutWidget
        footerProps={config.scaffold.footerProps}
        mainNavProps={{
          ...config.scaffold.mainNavProps,
          initialMenu: PathEnum.Portfolio,
        }}
        routerAdapter={{
          onRouteChange,
        }}
        leftSideProps={{
          current: currentPath,
        }}
      >
        <Outlet />
      </PortfolioLayoutWidget>

      {/* ✅ Add MobileFooter explicitly */}
      <div className="oui-bottom-0 oui-w-full oui-fixed">
        <MobileFooter />
      </div>
    </>
  );
}
