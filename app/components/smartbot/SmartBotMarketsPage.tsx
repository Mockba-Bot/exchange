import { useState } from "react";
import { MarketsProvider } from "@orderly.network/markets";
import CustomMarketTable from "@/components/smartbot/CustomMarketTable";
import AnalyzeModal from "@/components/smartbot/AnalyzeModal";
import ElliotModal from "@/components/smartbot/ElliotModal";
import KellyModal from "@/components/smartbot/KellyModal";
import GainersModal from "@/components/smartbot/GainersModal";
import { toast, ToastTile } from "@orderly.network/ui";

const SmartBotMarketsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [maxLeverage, setMaxLeverage] = useState<number>(100);
  const [showModal, setShowModal] = useState(false);
  const [showElliotModal, setShowElliotModal] = useState(false);
  const [selectedSymbolElliot, setSelectedSymbolElliot] = useState<string | null>(null);
  const [showKellyModal, setShowKellyModal] = useState(false);
  const [selectedSymbolKelly, setSelectedSymbolKelly] = useState<string | null>(null);
  // State to manage loading state
  const [loading, setLoading] = useState(false);
  const handleSubmit = async ({
    interval,
    leverage,
    indicator,
  }: {
    interval: string;
    leverage: string;
    indicator: string;
  }) => {
    try {
      setLoading(true);
      setShowModal(false);

      const telegramUser =  localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        token: String(telegramUser),
        asset: selectedSymbol,
        timeframe: interval,
        leverage: Number(leverage),
        feature: indicator,
        target_lang: targetLang,
      };

      const res = await fetch(`${apiUrl}/trading/analyze_asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return; // 🔴 Stop execution here — don't show loading toast
      }

      // ✅ Only show the loading toast if fetch succeeded
      toast.loading(
        <ToastTile
          title="Smart analysis in progress"
          subtitle="You'll receive the result on Telegram. This may take up to 3 minutes."
        />,
        { duration: 5000 }
      );

    } catch (error) {
      toast.error(
        <ToastTile
          title="Error"
          subtitle="Too many requests. Please wait."
        />,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleElliotSubmit = async ({
    interval,
  }: {
    interval: string;
  }) => {
    try {
      setLoading(true);
      setShowElliotModal(false);

      const telegramUser =  localStorage.getItem("token");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return; // 🔴 Stop execution here — don't show loading toast
      }

      // ✅ Only show the loading toast if fetch succeeded
      toast.loading(
        <ToastTile
          title="Smart analysis in progress"
          subtitle="You'll receive the result on Telegram. This may take up to 3 minutes."
        />,
        { duration: 5000 }
      );

    } catch (error) {
      toast.error(
        <ToastTile
          title="Error"
          subtitle="Too many requests. Please wait."
        />,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKellySubmit = async ({
    interval,
    leverage,
    indicator,
    freeCollateral
  }: {
    interval: string;
    leverage: string;
    indicator: string;
    freeCollateral: number;
  }) => {
    try {
      setLoading(true);
      setShowKellyModal(false);

      const telegramUser =  localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
      const targetLang = localStorage.getItem("orderly_i18nLng") || "en";

      const payload = {
        token: telegramUser ? String(telegramUser) : "",
        asset: selectedSymbolKelly,
        timeframe: interval,
        feature: indicator,
        leverage: Number(leverage),
        target_lang: targetLang,
        freeCollateral: Number(freeCollateral),
      };

      const res = await fetch(`${apiUrl}/trading/analyze_probability_asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return; // 🔴 Stop execution here — don't show loading toast
      }

      // ✅ Only show the loading toast if fetch succeeded
      toast.loading(
        <ToastTile
          title="Smart analysis in progress"
          subtitle="You'll receive the result on Telegram. This may take up to 3 minutes."
        />,
        { duration: 5000 }
      );

    } catch (error) {
      toast.error(
        <ToastTile
          title="Error"
          subtitle="Too many requests. Please wait."
        />,
        { duration: 5000 }
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
      />

      {showModal && selectedSymbol && (
        <AnalyzeModal
          symbol={selectedSymbol}
          onClose={() => {
            if (!loading) {
              setShowModal(false);
            }
          }}
          onSubmit={handleSubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      {/* Show Elliot Modal if needed */}
      {showElliotModal && selectedSymbol && (
        <ElliotModal
          symbol={selectedSymbol}
          onClose={() => setShowElliotModal(false)}
          onSubmit={handleElliotSubmit}
          responseText={null}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}

      {/* Show Kelly Modal if needed */}
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
    </MarketsProvider>
  );
};

export default SmartBotMarketsPage;
