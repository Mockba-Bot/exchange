import { MetaFunction } from "@remix-run/node";
import { AssetsModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Assets]) }];
};

export default function FeeTierPage() {
  return <AssetsModule.AssetsPage />;
}
