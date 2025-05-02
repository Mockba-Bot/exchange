import { useCallback } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { Box } from "@orderly.network/ui";
import { PositionsModule } from "@orderly.network/portfolio";
import { useTradingLocalStorage } from "@orderly.network/trading";
import { updateSymbol } from "@/storage";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

export const meta: MetaFunction = () => {
  return [{ title: generatePageTitle(PageTitleMap[PathEnum.Positions]) }];
};

export default function PositionsPage() {
  const config = useOrderlyConfig();
  const local = useTradingLocalStorage();
  const navigate = useNavigate();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      updateSymbol(symbol);
      navigate(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [navigate]
  );

  return (
    <Box
      p={6}
      pb={0}
      intensity={900}
      r="xl"
      width="100%"
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        // Make the table scroll instead of the page scroll
        height: "calc(100vh - 48px - 29px - 48px)",
      }}
    >
      <PositionsModule.PositionsPage
        sharePnLConfig={config.tradingPage.sharePnLConfig}
        pnlNotionalDecimalPrecision={local.pnlNotionalDecimalPrecision}
        calcMode={local.unPnlPriceBasis}
        onSymbolChange={onSymbolChange}
      />
    </Box>
  );
}
