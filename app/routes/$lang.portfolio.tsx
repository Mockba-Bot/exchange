import { useMemo } from "react";
import { Outlet } from "@remix-run/react";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@orderly.network/portfolio";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileFooter } from "@/components/MobileFooter";
import { PathEnum } from "@/constant";

export default function PortfolioLayout() {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const isMobile = useIsMobile();
  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (path.endsWith(PathEnum.FeeTier))
      return PortfolioLeftSidebarPath.FeeTier;

    if (path.endsWith(PathEnum.ApiKey)) return PortfolioLeftSidebarPath.ApiKey;

    return path;
  }, [path]);

  return (
    <div className="oui-h-full oui-flex oui-flex-col">
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
        <div className="oui-flex-1 oui-overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
          <Outlet />
        </div>
      </PortfolioLayoutWidget>

      {isMobile && (
        <div className="oui-bottom-0 oui-w-full oui-fixed">
          <MobileFooter />
        </div>
      )}
    </div>
  );
}
