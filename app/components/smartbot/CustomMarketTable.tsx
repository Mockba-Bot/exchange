import { FC } from "react";
import { useIsMobile } from "@/hooks/useIsMobile"; // adjust path as needed
import DesktopMarketTable from "./DesktopMarketTable";
import MobileMarketTable from "./MobileMarketTable";

interface CustomMarketTableProps {
  setSelectedSymbol: (symbol: string, leverage: number) => void;
  // Add other props here if needed
}

const CustomMarketTable: FC<CustomMarketTableProps> = (props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileMarketTable {...props} />
  ) : (
    <DesktopMarketTable {...props} />
  );
};

export default CustomMarketTable;
