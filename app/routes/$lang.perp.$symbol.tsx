import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/storage";
import { formatSymbol, generatePageTitle } from "@/utils";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { PathEnum } from "@/constant";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function PerpPage() {
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      navigate(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [navigate]
  );

  return (
    <TradingPage
      symbol={symbol}
      onSymbolChange={onSymbolChange}
      tradingViewConfig={config.tradingPage.tradingViewConfig}
      sharePnLConfig={config.tradingPage.sharePnLConfig}
    />
  );
}
