import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function MarketsLayout() {
  return (
    <BaseLayout initialMenu={PathEnum.Markets}>
      <Outlet />
    </BaseLayout>
  );
}
