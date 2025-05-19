import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { updateSymbol } from "@/storage";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { PathEnum } from "@/constant";
import { i18n, parseI18nLang, useTranslation } from "@orderly.network/i18n";
import { Maximize } from "lucide-react";
import { useMarkPricesStream } from "@orderly.network/hooks";
import { formatAssetPrice } from "@/utils";
import { createRoot } from "react-dom/client";


export default function PerpPage() {
  const { t } = useTranslation();
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { data: prices } = useMarkPricesStream();
  const markPrice = prices?.[symbol];
  const prevSymbolRef = useRef<string>(symbol);
  const [isMobile, setIsMobile] = useState(false);

  // Actualizar el título del documento
  useEffect(() => {
    let cancelled = false;

    if (typeof markPrice === "number") {
      const currentSymbol = symbol;

      setTimeout(() => {
        if (!cancelled && currentSymbol === symbol) {
          document.title = `${formatAssetPrice(markPrice)} | ${currentSymbol.replace("PERP_", "").replace("_", "/")}`;
          updateSymbol(currentSymbol);
          prevSymbolRef.current = currentSymbol;
        }
      }, 30);
    }

    return () => {
      cancelled = true;
    };
  }, [markPrice, symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const newSymbol = data.symbol;
      setSymbol(newSymbol);
      navigate(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${newSymbol}`);
    },
    [navigate]
  );

  const handleFullscreen = useCallback(() => {
    if (!chartContainerRef.current) return;
    const iframe = chartContainerRef.current.querySelector("iframe");
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  }, []);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Inyectar botón al top-toolbar
  useEffect(() => {
    const interval = setInterval(() => {
      const toolbar = document.querySelector(".top-toolbar");
      const existing = document.getElementById("fullscreen-btn");

      if (toolbar && !existing) {
        const container = document.createElement("div");
        container.id = "fullscreen-btn";
        container.style.marginLeft = "auto";

        const button = document.createElement("button");
        button.style.background = "rgba(0, 0, 0, 0.08)";
        button.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        button.style.borderRadius = "6px";
        button.style.padding = window.innerWidth < 768 ? "4px" : "6px";
        button.style.cursor = "pointer";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.color = "#fff";
        // Renderizar el ícono React en el botón
        const root = createRoot(button);
        root.render(<Maximize size={window.innerWidth < 768 ? 8 : 12} />);

        button.onclick = handleFullscreen;

        container.appendChild(button);
        toolbar.appendChild(container);

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [handleFullscreen, t]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </div>
  );
}
