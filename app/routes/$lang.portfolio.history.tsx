import { MetaFunction } from "@remix-run/node";
import { HistoryModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]) }];
};

export default function HistoryPage() {
  return <HistoryModule.HistoryPage />;
}