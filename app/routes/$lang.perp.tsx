import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { useIsMobile } from "@/hooks/useIsMobile"; // ✅ Add this
import { MobileFooter } from "@/components/MobileFooter"; // ✅ Add this

export default function PerpLayout() {
  const isMobile = useIsMobile(); // ✅
  return (
    <BaseLayout>
      <Outlet />
      {/* ✅ Add MobileFooter explicitly */}
      <div className="oui-bottom-0 oui-w-full oui-fixed">
        {isMobile && <MobileFooter />}
      </div>
    </BaseLayout>
  );
}
