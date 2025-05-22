import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function SmartBotLayout() {
  return (
    <BaseLayout initialMenu={PathEnum.SmartBot}>
      <Outlet />
    </BaseLayout>
  );
}
