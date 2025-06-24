import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { useIsMobile } from "@/hooks/useIsMobile"; // ✅ Add this
import { MobileFooter } from "@/components/MobileFooter"; // ✅ Add this

export default function PerpLayout() {
  const isMobile = useIsMobile(); // ✅
  return (
    <BaseLayout>
      <div className="oui-flex oui-flex-col oui-h-screen">
        <div className="oui-flex-1 oui-overflow-auto">
          <Outlet />
        </div>
        {isMobile && (
          <div className="oui-fixed oui-bottom-0 oui-w-full oui-z-50">
            <MobileFooter />
          </div>
        )}
      </div>
    </BaseLayout>

  );
}
