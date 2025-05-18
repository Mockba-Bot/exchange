import { MetaFunction } from "@remix-run/node";
import { OverviewModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.TradingBot]) }];
};

export default function TradingBotPage() {
  return <OverviewModule.OverviewPage />;
}