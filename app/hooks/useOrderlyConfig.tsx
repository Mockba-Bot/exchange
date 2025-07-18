import { useMemo, useEffect, useState } from "react";
import { TradingPageProps } from "@orderly.network/trading";
import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
import { type RestrictedInfoOptions } from "@orderly.network/hooks";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import { useTranslation } from "@orderly.network/i18n";
import { PathEnum } from "@/constant";
// import { Link } from "@remix-run/react";
// import { BotMessageSquare } from 'lucide-react';

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
    restrictedInfo?: RestrictedInfoOptions;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

export const useOrderlyConfig = () => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Run only in the browser
    const stored = localStorage.getItem("orderly_i18nLng");
    setValue(stored);
  }, []);

  const { t } = useTranslation();
  //const lang = i18n.language;
  // const smartbotPath = `/${lang}/smartbot`;


  return useMemo<OrderlyConfig>(() => {
    return {
      scaffold: {
        mainNavProps: {
          mainMenus: [
            { name: t("common.trading"), href: PathEnum.Root },
            { name: t("common.smartBot"), href: PathEnum.SmartBot },
            { name: t("common.portfolio"), href: PathEnum.Portfolio },
            { name: t("common.markets"), href: PathEnum.Markets },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
            },
          ],
          initialMenu: PathEnum.Root,
          campaigns: {
            name: t("tradingRewards.rewards"),
            href: PathEnum.Rewards,
            children: [
              {
                name: t("common.tradingRewards"),
                href: PathEnum.RewardsTrading,
                description: t("extend.tradingRewards.description"),
              },
              {
                name: t("common.affiliate"),
                href: PathEnum.RewardsAffiliate,
                tag: t("extend.affiliate.tag"),
                description: t("extend.affiliate.description"),
                icon: <OrderlyIcon size={14} />,
                activeIcon: <OrderlyActiveIcon size={14} />,
              },
              {
                name: t("extend.staking"),
                href: "https://app.orderly.network/staking",
                description: t("extend.staking.description"),
                target: "_blank",
                icon: <OrderlyIcon size={14} />,
                activeIcon: <OrderlyActiveIcon size={14} />,
              },
            ],
          },
        },
        footerProps: {
          telegramUrl: "https://orderly.network",
          discordUrl: "https://discord.com/invite/orderlynetwork",
          twitterUrl: "https://twitter.com/OrderlyNetwork",
        },
      },
      orderlyAppProvider: {
        appIcons: {
          main: {
            component: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: -20, marginRight: -30 }}>
                <img src="/apolo-dex-icon.svg" alt="" style={{ height: 100, width: 'auto', maxWidth: '100%', margin: '0 auto' }} />
              </div>
            ),
          },
          // secondary: {
          //   component: (
          //     <>
          //       <Link to={smartbotPath}>
          //         <BotMessageSquare />
          //       </Link>
          //       <img
          //         src="/Isotipo.png"
          //         alt=""
          //         style={{ height: 35, borderRadius: 4 }} // Example styles
          //       />
          //     </>
          //   ),
          // },
        },
        restrictedInfo: {
          enableDefault: true,
          customRestrictedIps: [],
          customRestrictedRegions: [],
        },
      },
      tradingPage: {
        tradingViewConfig: {
          scriptSRC: "/tradingview/charting_library/charting_library.js",
          library_path: "/tradingview/charting_library/",
          customCssUrl: "/tradingview/chart.css"

        },
        sharePnLConfig: {
          backgroundImages: [
            "/pnl/poster_bg_1.png",
            "/pnl/poster_bg_2.png",
            "/pnl/poster_bg_3.png",
            "/pnl/poster_bg_4.png",
          ],

          color: "rgba(255, 255, 255, 0.98)",
          profitColor: "rgba(41, 223, 169, 1)",
          lossColor: "rgba(245, 97, 139, 1)",
          brandColor: "rgba(255, 255, 255, 0.98)",

          // ref
          refLink: "https://orderly.network",
          refSlogan: "Orderly referral",
        },

      },
    };
  }, [t]);
};
