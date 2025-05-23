import { useState } from "react";
import { MarketsProvider } from "@orderly.network/markets";
import CustomMarketTable from "@/components/smartbot/CustomMarketTable";
import AnalyzeModal from "@/components/smartbot/AnalyzeModal";

const SmartBotMarketsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
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
      <CustomMarketTable
        setSelectedSymbol={(symbol: string) => {
          setSelectedSymbol(symbol);
          setResponse(null); // reset previous result
          setShowModal(true);
        }}
      />

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
        />
      )}
    </MarketsProvider>
  );
};

export default SmartBotMarketsPage;
