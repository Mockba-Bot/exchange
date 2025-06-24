import { FC } from "react";
import { Scaffold, ScaffoldProps } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useNav } from "@/hooks/useNav";
import { PathEnum } from "@/constant";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, initialMenu, classNames }) => {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();

  return (
    <div className="relative oui-h-screen oui-w-screen">
      <div className="oui-h-full oui-flex oui-flex-col overflow-hidden">
        {/* Scrollable area inside Scaffold */}
        <Scaffold
          mainNavProps={{
            ...config.scaffold.mainNavProps,
            initialMenu: initialMenu || PathEnum.Root,
          }}
          footerProps={config.scaffold.footerProps}
          routerAdapter={{ onRouteChange }}
          classNames={{
            ...classNames,
            container: "oui-h-full oui-flex oui-flex-col",
            content: "oui-h-full oui-flex oui-flex-col",
          }}
        >
          <div className="oui-flex-1 oui-overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
            {children}
          </div>
        </Scaffold>
      </div>
    </div>
  );
};
