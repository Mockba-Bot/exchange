import { MetaFunction } from "@remix-run/node";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import SmartBotMarketsPage from "@/components/smartbot/SmartBotMarketsPage";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.SmartBot]) }];
};

export default function TradingBotPage() {
  return <SmartBotMarketsPage />;
}
