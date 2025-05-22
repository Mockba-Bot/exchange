import { FC, useMemo, useState, useEffect, useRef } from "react";
import {
  useFavoritesListScript,
  useRecentListScript,
  useNewListingListScript,
} from "@orderly.network/markets";
import { useMarkets } from "@orderly.network/hooks";
import { Button, Card, usePagination } from "@orderly.network/ui";
import { useTranslation } from "@orderly.network/i18n";
import {
  Star,
  BarChart2,
  Search as LucideSearch,
  ChartSpline,
  WandSparkles,
  Lightbulb,
} from "lucide-react";

const TABS = [
  { value: "favorites", label: "Favorites", icon: Star },
  { value: "all", label: "All markets", icon: BarChart2 },
  { value: "new", label: "New listings", icon: Lightbulb },
] as const;

type TabType = typeof TABS[number]["value"];
const PAGE_SIZE = 10;

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    }).format(value);

const CustomMarketTable: FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const [markets] = useMarkets();
  const favorites = useFavoritesListScript();
  const recent = useRecentListScript();
  const newListing = useNewListingListScript();

  const toggleFavorite = (symbol: string) => {
    favorites.toggle(symbol);
  };

  const data = useMemo(() => {
    let source: any[] = [];
    if (tab === "favorites" && Array.isArray(favorites.dataSource)) {
      source = favorites.dataSource;
    } else if (tab === "new" && Array.isArray(newListing.dataSource)) {
      source = newListing.dataSource;
    } else if (Array.isArray(markets)) {
      source = markets;
    }

    const enriched = source
      .filter((m: any) => m.symbol?.toLowerCase().includes(search.toLowerCase()))
      .map((m: any) => ({
        ...m,
        isFavorite: favorites.symbolList?.includes(m.symbol),
      }));

    const mergedWithFavorites = enriched.map((m) => ({
      ...m,
      isFavorite: favorites.symbolList?.includes(m.symbol) || m.isFavorite,
    }));

    return mergedWithFavorites.sort(
      (a, b) => (b.price_change_percent_24h || 0) - (a.price_change_percent_24h || 0)
    );
  }, [tab, markets, favorites, newListing, search]);

  const pagination = usePagination({
    total: data.length,
    pageSize: PAGE_SIZE,
    pageSizeOptions: [10, 20, 50, 100],
  });

  const pagedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return data.slice(start, start + pagination.pageSize);
  }, [data, pagination.page, pagination.pageSize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focused = document.activeElement;
      const rowIndex = rowRefs.current.findIndex((r) => r === focused);
      if (e.key === "ArrowDown" && rowIndex < pagedData.length - 1) {
        rowRefs.current[rowIndex + 1]?.focus();
      } else if (e.key === "ArrowUp" && rowIndex > 0) {
        rowRefs.current[rowIndex - 1]?.focus();
      } else if (e.key === "Enter" && focused instanceof HTMLTableRowElement) {
        const symbol = focused.dataset.symbol;
        alert(`Analyze ${symbol}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pagedData]);

  return (
    <div className="oui-p-6 oui-max-w-screen-xl oui-mx-auto">
      <Card className="oui-overflow-hidden oui-border oui-border-base-4 oui-bg-base-7 oui-rounded-xl">
        <div className="oui-flex oui-items-center oui-justify-between oui-px-1 oui-pt-4">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="oui-header-list oui-flex oui-items-center oui-space-x-[6px] oui-flex-1 oui-border-0"
            tabIndex={0}
            data-orientation="horizontal"
          >
            {TABS.map((tabItem) => {
              const isActive = tab === tabItem.value;
              return (
                <button
                  key={tabItem.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tab-content-${tabItem.value}`}
                  data-state={isActive ? "active" : "inactive"}
                  id={`tab-trigger-${tabItem.value}`}
                  onClick={() => setTab(tabItem.value)}
                  className={`oui-tab-trigger oui-inline-flex oui-items-center oui-justify-center oui-whitespace-nowrap oui-box-content oui-font-medium
                    hover:oui-text-base-contrast-54 oui-ring-offset-background oui-transition-all oui-space-x-1
                    focus-visible:oui-outline-none focus-visible:oui-ring-2 focus-visible:oui-ring-ring focus-visible:oui-ring-offset-2
                    disabled:oui-pointer-events-none disabled:oui-opacity-50 oui-px-3 hover:oui-bg-base-5
                    oui-text-base oui-h-9 oui-rounded-md
                    ${isActive ? "oui-bg-base-5 oui-text-white" : "oui-bg-base-7 oui-text-base-contrast-36"}`}
                  data-testid={`oui-testid-markets-${tabItem.value}-tab`}
                  tabIndex={-1}
                  data-orientation="horizontal"
                >
                  <tabItem.icon className="oui-text-inherit oui-w-4 oui-h-4" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          <div className="oui-rounded oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root oui-h-7 oui-pl-0 oui-pr-0 oui-w-[240px] oui-my-1">
            <div className="oui-box oui-pl-3 oui-pr-1">
              <LucideSearch className="oui-text-base-contrast-36 oui-w-[14px] oui-h-[14px]" />
            </div>
            <input
              type="text"
              placeholder={t("common.search") || "Search market"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums oui-text-white autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-h-7 oui-text-2xs placeholder:oui-text-2xs"
            />
            <label className="oui-h-full oui-flex oui-flex-col oui-justify-center oui-px-2 oui-text-base-contrast oui-text-2xs" />
          </div>
        </div>

        <table className="oui-w-full oui-text-sm">
          <thead className="oui-sticky oui-top-0 oui-z-10 oui-bg-transparent oui-text-left oui-text-base-contrast-54 oui-text-xs oui-uppercase oui-font-medium oui-border-b oui-border-base-4">
            <tr>
              <th className="oui-py-3 oui-px-4">
                <Star className="oui-w-4 oui-h-4 oui-text-base-contrast-54" />
              </th>
              <th className="oui-py-3 oui-px-4">{t("common.market") || "Market"}</th>
              <th className="oui-py-3 oui-px-4">{t("common.market") || "Price"}</th>
              <th className="oui-py-3 oui-px-4">{t("common.market") || "24h Volume"}</th>
              <th className="oui-py-3 oui-px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((market: any, idx) => (
              <tr
                key={market.symbol}
                ref={(el) => (rowRefs.current[idx] = el)}
                data-symbol={market.symbol}
                tabIndex={0}
                className="oui-border-b oui-border-base-4 hover:oui-bg-base-6 oui-transition focus:oui-outline-none focus:oui-ring-2 focus:oui-ring-primary"
              >
                <td
                className="oui-py-3 oui-px-4 oui-cursor-pointer"
                onClick={() => toggleFavorite(market.symbol)}
                >
                {market.isFavorite ? (
                    <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="oui-text-yellow-400"
                    >
                    <path d="m10 14.074-3.2 1.913a.6.6 0 0 1-.332.068.6.6 0 0 1-.277-.101.5.5 0 0 1-.186-.256.5.5 0 0 1-.005-.336l.84-3.556-2.82-2.394a.5.5 0 0 1-.174-.281.6.6 0 0 1 .013-.315.5.5 0 0 1 .173-.252.55.55 0 0 1 .305-.112l3.693-.33 1.467-3.393a.57.57 0 0 1 .211-.255A.54.54 0 0 1 10 4.39q.16 0 .292.083.131.082.211.255l1.467 3.414 3.693.309q.178.014.305.123.126.11.173.262t.002.304a.56.56 0 0 1-.183.27l-2.8 2.395.84 3.556a.5.5 0 0 1-.005.336.5.5 0 0 1-.186.256.6.6 0 0 1-.277.101.6.6 0 0 1-.332-.068z" />
                    </svg>
                ) : (
                    <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="oui-text-base-contrast-30"
                    >
                    <path
                        d="M10 14.074l-3.2 1.913a.6.6 0 0 1-.61-.033.5.5 0 0 1-.19-.592l.84-3.556-2.82-2.394a.5.5 0 0 1 .3-.867l3.694-.33L9.98 4.39a.5.5 0 0 1 .924 0l1.467 3.414 3.694.309a.5.5 0 0 1 .29.867l-2.8 2.395.84 3.556a.5.5 0 0 1-.775.525L10 14.074z"
                    />
                    </svg>
                )}
                </td>
                <td className="oui-py-3 oui-px-4 oui-flex oui-items-center oui-gap-2 oui-text-white oui-font-medium">
                  <img
                    className="oui-aspect-square oui-h-5 oui-w-5"
                    src={`https://oss.orderly.network/static/symbol_logo/${
                      market.symbol.startsWith("PERP_") && market.symbol.split("_").length === 3
                        ? market.symbol.split("_")[1]
                        : market.symbol.split("-")[0]
                    }.png`}
                    alt={market.symbol}
                  />
                  {market.symbol.startsWith("PERP_") && market.symbol.split("_").length === 3
                    ? `${market.symbol.split("_")[1]}-PERP`
                    : market.symbol}
                </td>
                <td className="oui-py-3 oui-px-4 oui-text-white">{formatNumber(market.mark_price || 0)}</td>
                <td className="oui-py-3 oui-px-4 oui-text-white">{formatNumber(market["24h_volume"] || 0)}</td>
                <td className="oui-py-3 oui-px-4">
                  <div className="oui-flex oui-gap-2">
                    <Button size="sm" icon={<WandSparkles />}>Analyze</Button>
                    <Button size="sm" icon={<ChartSpline />} >Elliot Waves</Button>
                  </div>
                </td>
              </tr>
            ))}
            {pagedData.length === 0 && (
              <tr>
                <td colSpan={3} className="oui-py-6 oui-px-4 oui-text-center oui-text-base-contrast-54 oui-text-sm">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination.totalPages > 1 && pagedData.length > 0 && (
          <div className="oui-flex oui-items-center oui-justify-between oui-p-4 oui-text-xs oui-text-base-contrast-54">
            <div className="oui-flex oui-items-center oui-space-x-2">
              <span>{t("common.rowsPerPage") || "Rows per page"}</span>
              <select
                className="oui-bg-base-6 oui-border oui-border-base-4 oui-rounded-md oui-px-2 oui-py-1 oui-text-white"
                value={pagination.pageSize}
                onChange={(e) => pagination.setPageSize(Number(e.target.value))}
              >
                {pagination.pageSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="oui-flex">{pagination.render()}</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomMarketTable;
