import { MetaFunction } from "@remix-run/node";
import { MarketsHomePage } from "@orderly.network/markets";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Markets]) }];
};

export default function MarketsPage() {
  return <MarketsHomePage />;
}
