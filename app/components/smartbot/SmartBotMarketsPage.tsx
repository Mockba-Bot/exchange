import { MarketsProvider } from "@orderly.network/markets";
import CustomMarketTable from "@/components/smartbot/CustomMarketTable";

const SmartBotMarketsPage = () => {
  return (
    <MarketsProvider>
      <CustomMarketTable />
    </MarketsProvider>
  );
};

export default SmartBotMarketsPage;
