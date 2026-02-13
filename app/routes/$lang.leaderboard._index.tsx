import { MetaFunction } from "@remix-run/node";
import { useMemo } from "react";
import { useScaffoldContext } from "@orderly.network/ui-scaffold";
import { Box, useScreen } from "@orderly.network/ui";
import {
  CampaignConfig,
  LeaderboardPage,
} from "@orderly.network/trading-leaderboard";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { PageTitleMap, PathEnum } from "@/constant";
import { getSymbol } from "@/storage";
import { generatePageTitle } from "@/utils";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Leaderboard]) }];
};

function getCampaigns() {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dateRange = [
    // ongoing
    { start_time: addDays(new Date(), -1).toISOString(), end_time: addDays(new Date(), 30).toISOString() },
    // future
    { start_time: addDays(new Date(), 1).toISOString(), end_time: addDays(new Date(), 30).toISOString() },
    // past
    { start_time: addDays(new Date(), -30).toISOString(), end_time: addDays(new Date(), -1).toISOString() },
  ];

  return dateRange.map(
    (date, index) =>
      ({
        campaign_id: index + 1,
        title: "RISE ABOVE. OUTTRADE THE REST",
        description:
          "A new era of traders is rising. Are you the one leading the charge? Compete for your share of $10K by climbing the ranks. Only the bold will make it to the top.",
        image: "/leaderboard/campaign.jpg",
        href: "https://orderly.network/",
        ...date,
      } as CampaignConfig)
  );
}

export default function MarketsPage() {
  const { isMobile } = useScreen();
  const { topNavbarHeight, footerHeight, announcementHeight } =
    useScaffoldContext();

  const tradingUrl = useMemo(() => {
    const symbol = getSymbol();
    return `/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`;
  }, []);

  return (
    <Box
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        height: isMobile
          ? "100%"
          : `calc(100vh - ${topNavbarHeight}px - ${footerHeight}px - ${
              announcementHeight ? announcementHeight + 12 : 0
            }px)`,
      }}
    >
      <LeaderboardPage
        campaigns={getCampaigns()}
        href={{
          trading: tradingUrl,
        }}
        className="oui-py-5"
      />
    </Box>
  );
}
