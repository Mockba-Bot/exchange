import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";
import { useIsMobile } from "@/hooks/useIsMobile"; // ✅ Add this
import { MobileFooter } from "@/components/MobileFooter"; // ✅ Add this

export default function SmartBotLayout() {
  const isMobile = useIsMobile(); // ✅
  return (
    <BaseLayout initialMenu={PathEnum.SmartBot}>
      <Outlet />
      {/* ✅ Add MobileFooter explicitly */}
      <div className="oui-bottom-0 oui-w-full oui-fixed">
        {isMobile && <MobileFooter />}
      </div>
    </BaseLayout>
  );
}
