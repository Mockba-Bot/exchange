import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";
import { useScreen } from "@orderly.network/ui";
import { useIsMobile } from "@/hooks/useIsMobile"; // ✅ Add this
import { MobileFooter } from "@/components/MobileFooter"; // ✅ Add this

export default function LeaderboardLayout() {
  const { isDesktop } = useScreen();
  const isMobile = useIsMobile(); // ✅
  return (
    <BaseLayout
      initialMenu={PathEnum.Leaderboard}
      classNames={{
        root: isDesktop ? "oui-overflow-hidden" : undefined,
      }}
    >
      <Outlet />
      {/* ✅ Add MobileFooter explicitly */}
      <div className="oui-bottom-0 oui-w-full oui-fixed">
        {isMobile && <MobileFooter />}
      </div>
    </BaseLayout>
  );
}
