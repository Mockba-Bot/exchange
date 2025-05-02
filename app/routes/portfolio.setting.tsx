import { MetaFunction } from "@remix-run/node";
import { SettingModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Setting]) }];
};

export default function SettingsPage() {
  return <SettingModule.SettingPage />;
}
