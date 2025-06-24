import { Outlet } from "@remix-run/react";
import { BaseLayout } from "@/components/baseLayout";

export default function PerpLayout() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}
