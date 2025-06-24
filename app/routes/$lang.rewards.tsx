import { Outlet } from "@remix-run/react";
import { TradingRewardsLayoutWidget } from "@orderly.network/trading-rewards";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useNav } from "@/hooks/useNav";
import { PathEnum } from "@/constant";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { Dashboard, ReferralProvider } from "@orderly.network/affiliate";

export default function TradingRewardsLayout() {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

  const { onRouteChange } = useNav();

  return (
    <TradingRewardsLayoutWidget
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: PathEnum.Rewards,
      }}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: path,
      }}
    >
      <Dashboard.AffiliatePage />
      <Outlet />
    </TradingRewardsLayoutWidget>
  );
}
