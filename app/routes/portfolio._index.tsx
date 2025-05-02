import { MetaFunction } from "@remix-run/node";
import { OverviewModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Portfolio]) }];
};

export default function PortfolioPage() {
  return <OverviewModule.OverviewPage />;
}
