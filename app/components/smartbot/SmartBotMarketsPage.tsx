import { useState } from "react";
import { MarketsProvider } from "@orderly.network/markets";
import CustomMarketTable from "@/components/smartbot/CustomMarketTable";
import AnalyzeModal from "@/components/smartbot/AnalyzeModal";
import TelegramLogin from "@/components/smartbot/TelegramLogin"; // ✅ Add import

const SmartBotMarketsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [maxLeverage, setMaxLeverage] = useState<number>(50); // default
  const [response, setResponse] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
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
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: selectedSymbol,
          interval,
          leverage,
          indicator,
        }),
      });

      const data = await res.json();
      setResponse(data.message); // 🧠 message with emojis from backend
    } catch (error) {
      setResponse("❌ Error fetching analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketsProvider>
      {/* ✅ Insert Telegram Login Widget */}
      <div className="mb-4 flex justify-center">
        <TelegramLogin />
      </div>

      {/* ✅ Your market table */}
      <CustomMarketTable
        setSelectedSymbol={(symbol, leverage) => {
          setSelectedSymbol(symbol);
          setMaxLeverage(leverage);
          setShowModal(true);
        }}
      />

      {/* ✅ Analysis modal */}
      {showModal && selectedSymbol && (
        <AnalyzeModal
          symbol={selectedSymbol}
          onClose={() => {
            setShowModal(false);
            setResponse(null);
          }}
          onSubmit={handleSubmit}
          responseText={response}
          loading={loading}
          maxLeverage_={maxLeverage}
        />
      )}
    </MarketsProvider>
  );
};

export default SmartBotMarketsPage;
