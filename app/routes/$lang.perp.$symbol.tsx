import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/storage";
import { formatSymbol, generatePageTitle } from "@/utils";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { PathEnum } from "@/constant";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { Maximize } from "lucide-react";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function PerpPage() {
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);

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

  const handleFullscreen = () => {
    if (!chartContainerRef.current) return;
    const iframe = chartContainerRef.current.querySelector("iframe");
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "55%",
          transform: "translate(-50%, 0)",
          zIndex: 50,
          display: "none",
        }}
      >
        <button
          style={{
            background: "rgba(0, 0, 0, 0.32)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            padding: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#fff"
          }}
          onClick={handleFullscreen}
          aria-label="Fullscreen"
        >
          <Maximize size={12} />
        </button>
      </div>

      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 60px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <TradingPage
          symbol={symbol}
          onSymbolChange={onSymbolChange}
          tradingViewConfig={config.tradingPage.tradingViewConfig}
          sharePnLConfig={config.tradingPage.sharePnLConfig}
        />
      </div>
    </div>
  );
}
