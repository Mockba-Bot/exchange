import { MetaFunction } from "@remix-run/node";
import { FeeTierModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]) }];
};

export default function FeeTierPage() {
  return <FeeTierModule.FeeTierPage />;
}
