import { FC } from "react";
import { Scaffold, ScaffoldProps } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useNav } from "@/hooks/useNav";
import { PathEnum } from "@/constant";
import { MobileFooter } from "@/components/MobileFooter";
import { useIsMobile } from "@/hooks/useIsMobile";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, initialMenu, classNames }) => {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  const isMobile = useIsMobile();

  return (
    <div className="oui-h-screen oui-w-screen oui-flex oui-flex-col">
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
         {/* Main content area with padding to avoid overlapping footer */}
        <div className="oui-relative oui-flex-1 oui-overflow-y-auto oui-pb-16">
          {children}
        </div>
      </Scaffold>
       {/* Fixed footer stays in view */}
        {isMobile && (
            <MobileFooter />
        )}
      
    </div>
  );
};
