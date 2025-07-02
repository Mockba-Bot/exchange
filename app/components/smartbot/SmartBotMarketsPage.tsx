import { useState } from "react";
import { MarketsProvider } from "@orderly.network/markets";
import CustomMarketTable from "@/components/smartbot/CustomMarketTable";
import AnalyzeModal from "@/components/smartbot/AnalyzeModal";
import ElliotModal from "@/components/smartbot/ElliotModal";
import KellyModal from "@/components/smartbot/KellyModal";
import GainersModal from "@/components/smartbot/GainersModal";
import AnalyzeInProgressModal from "@/components/smartbot/AnalyzeInProgressModal";
import AnalysisResultModal from "@/components/smartbot/AnalysisResultModal";
import { toast, ToastTile, Button } from "@orderly.network/ui";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";
const enTranslations = enTranslationsJson as Record<string, string>;

const useTranslation = () => {
  const { t } = useOrderlyTranslation();
  const currentLang = localStorage.getItem("orderly_i18nLng");

  return (key: string) => {
    const orderlyTranslation = t(key);
    if (orderlyTranslation !== key) return orderlyTranslation;
    if (currentLang === "en" && enTranslations[key]) return enTranslations[key];
    return key;
  };
};

const SmartBotMarketsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [maxLeverage, setMaxLeverage] = useState<number>(100);
  const [showModal, setShowModal] = useState(false);
  const [showElliotModal, setShowElliotModal] = useState(false);
  const [selectedSymbolElliot, setSelectedSymbolElliot] = useState<string | null>(null);
  const [showKellyModal, setShowKellyModal] = useState(false);
  const [selectedSymbolKelly, setSelectedSymbolKelly] = useState<string | null>(null);
  const [showGainersModal, setShowGainersModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAnalysisResultModal, setShowAnalysisResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslation();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const showProgress = () => setShowProgressModal(true);
  const showAnalysisResult = () => setShowAnalysisResultModal(true);
  const hideProgress = () => setShowProgressModal(false);

  const handleSubmit = async ({ interval, leverage, indicator }: { interval: string; leverage: string; indicator: string }) => {
    try {
      setShowModal(false);
      showProgress();
      setLoading(true);

      const storedUser = localStorage.getItem("telegram_user");
      const telegramUser = storedUser ? JSON.parse(storedUser).telegram_id : null;
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        token: String(telegramUser),
        asset: selectedSymbol,
        interval: interval,
        leverage: Number(leverage),
        feature: indicator,
        target_lang: targetLang,
      };

      const res = await fetch(`${apiUrl}/trading/analyze_asset`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      hideProgress();

      if (!res.ok) throw new Error("Failed");

      toast.success(
        <ToastTile title={t("apolo.smartTrade.success.title")} subtitle={t("apolo.smartTrade.success.subtitle")} />, { duration: 10000 }
      );
    } catch (error) {
      hideProgress();
      toast.error(
        <ToastTile title={t("apolo.smartTrade.error.tittle")} subtitle={t("apolo.smartTrade.error.subtittle")} />, { duration: 10000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleElliotSubmit = async ({ interval }: { interval: string }) => {
    try {
      setShowElliotModal(false);
      showProgress();
      setLoading(true);

      const storedUser = localStorage.getItem("telegram_user");
      const telegramUser = storedUser ? JSON.parse(storedUser).telegram_id : null;
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        asset: selectedSymbolElliot,
        token: String(telegramUser),
        interval: interval,
        target_lang: targetLang,
      };

      const res = await fetch(`${apiUrl}/trading/elliot_waves/analyze_intervals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      hideProgress();

      if (!res.ok) throw new Error("Failed");

      toast.success(
        <ToastTile title={t("apolo.smartTrade.success.title")} subtitle={t("apolo.smartTrade.success.subtitle")} />, { duration: 10000 }
      );
    } catch (error) {
      hideProgress();
      toast.error(
        <ToastTile title={t("apolo.smartTrade.error.tittle")} subtitle={t("apolo.smartTrade.error.subtittle")} />, { duration: 10000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKellySubmit = async ({ interval, leverage, indicator, freeCollateral }: { interval: string; leverage: string; indicator: string; freeCollateral: number }) => {
    try {
      setShowKellyModal(false);
      showProgress();
      setLoading(true);

      const storedUser = localStorage.getItem("telegram_user");
      const telegramUser = storedUser ? JSON.parse(storedUser).telegram_id : null;
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        token: telegramUser ? String(telegramUser) : "",
        asset: selectedSymbolKelly,
        interval: interval,
        feature: indicator,
        leverage: Number(leverage),
        target_lang: targetLang,
        free_collateral: Number(freeCollateral),
      };

      const res = await fetch(`${apiUrl}/trading/analyze_probability_asset`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      hideProgress();

      if (!res.ok) throw new Error("Failed");

      toast.success(
        <ToastTile title={t("apolo.smartTrade.success.title")} subtitle={t("apolo.smartTrade.success.subtitle")} />, { duration: 10000 }
      );
    } catch (error) {
      hideProgress();
      toast.error(
        <ToastTile title={t("apolo.smartTrade.error.tittle")} subtitle={t("apolo.smartTrade.error.subtittle")} />, { duration: 10000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGainersSubmit = async ({ interval, type }: { interval: string; type: "gainers" | "losers" }) => {
    try {
      setShowGainersModal(false);
      showProgress();
      setLoading(true);

      const storedUser = localStorage.getItem("telegram_user");
      const telegramUser = storedUser ? JSON.parse(storedUser).telegram_id : null;
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        token: String(telegramUser),
        target_lang: targetLang,
        interval: interval,
        change_threshold: 0.005,
        type: type,
        top_n: 10,
      };

      const res = await fetch(`${apiUrl}/trading/gainers_analysis`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      hideProgress();

      if (!res.ok) throw new Error("Failed");

      toast.success(
        <ToastTile title={t("apolo.smartTrade.success.title")} subtitle={t("apolo.smartTrade.success.subtitle")} />, { duration: 10000 }
      );
    } catch (error) {
      hideProgress();
      toast.error(
        <ToastTile title={t("apolo.smartTrade.error.tittle")} subtitle={t("apolo.smartTrade.error.subtittle")} />, { duration: 10000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketsProvider>
      <CustomMarketTable
        setSelectedSymbol={(symbol, leverage) => {
          setSelectedSymbol(symbol);
          setMaxLeverage(leverage);
          setShowModal(true);
        }}
        setSelectedSymbolElliot={(symbol, leverage) => {
          setSelectedSymbolElliot(symbol);
          setMaxLeverage(leverage);
          setShowElliotModal(true);
        }}
        setSelectedSymbolKelly={(symbol, leverage) => {
          setSelectedSymbolKelly(symbol);
          setMaxLeverage(leverage);
          setShowKellyModal(true);
        }}
        setShowGainersModal={(show) => setShowGainersModal(show)}
      />

      {showModal && selectedSymbol && (
        <AnalyzeModal
          symbol={selectedSymbol}
          onClose={() => !loading && setShowModal(false)}
          onSubmit={handleSubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      {showElliotModal && selectedSymbolElliot && (
        <ElliotModal
          symbol={selectedSymbolElliot}
          onClose={() => setShowElliotModal(false)}
          onSubmit={handleElliotSubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      {showKellyModal && selectedSymbolKelly && (
        <KellyModal
          symbol={selectedSymbolKelly}
          onClose={() => setShowKellyModal(false)}
          onSubmit={handleKellySubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      {showGainersModal && (
        <GainersModal
          onClose={() => setShowGainersModal(false)}
          onSubmit={handleGainersSubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      <AnalyzeInProgressModal  open={showProgressModal} />
      {/* TEST BUTTON 
    <Button
      onClick={() => setShowAnalysisResultModal(true)}
      variant="contained"
      color="primary"
      className="oui-mt-4 oui-ml-4"
    >
      Open Analysis Result Modal (Test)
    </Button>
      <AnalysisResultModal
        open={showAnalysisResultModal}
        onClose={() => setShowAnalysisResultModal(false)}
        message={"🚀 PERP_ETH_USDC 15m Trading Signal  \n💰 Free Collateral: $400.00 | ⚖️ Leverage: 30x  \n💵 Current Price: $2,519.35 (±2.46% 24h)  \n\n🧭 TREND SUMMARY  \n- Market is TRENDING UP  \n- Key levels: 🛡️ Support $2,477.18 | 🚀 Resistance $2,520.57  \n- Volume: 📊 ABOVE average  \n- Funding: 💸 FAVORABLE -0.03%  \n\n🎯 TRADING OPPORTUNITIES  \n🟢 LONG:  \n- 0.3%: 38.4% prob | 0.01x size  \n- 0.5%: 22.2% prob | 0.01x size  \n- 1.0%: 6.3% prob | 0.01x size  \n- 1.5%: 2.5% prob | 0.01x size  \n🔴 SHORT:  \n- 0.3%: 29.7% prob | 0.01x size  \n- 0.5%: 17.6% prob | 0.01x size  \n- 1.0%: 5.5% prob | 0.01x size  \n- 1.5%: 2.6% prob | 0.01x size  \n\n🧠 STRATEGY  \nPreferred Direction: HOLD 🦉  \nBest Setup: HOLD at $2,519.35 – $2,526.91  \nTake Profit: 0.3% | Stop Loss: 1.0%  \n\n⚠️ RISK ANALYSIS  \n- Max Size: 0.02x (Free Collateral × Risk Factor ÷ Leverage)  \n- What it means: Risk only 2% of free collateral on this trade.  \n- How to apply: Position value = $400 × 0.02 = $8.00  \n- Example: $8 ÷ 30 = $0.27 margin locked. Keep $399.73 free.  \n- Final recommended invest: $8.00  \n- Liquidation Risk: 49.0%  \n- Volatility: 0.48% daily  \n- Safe Leverage: ≤30x  \n\n📌 FINAL GUIDANCE  \n1. HOLD setup shows best risk/reward profile  \n2. 0.3% target offers optimal probability  \n3. Maintain strict stop-loss discipline  \n4. Monitor funding rates hourly  \n\n🔄 UPDATES  \nNext analysis in: 15m"}
      />*/}
      
    </MarketsProvider>
  );
};

export default SmartBotMarketsPage;
