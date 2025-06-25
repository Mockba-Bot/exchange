import {
  FC,
  useMemo,
  useState,
  useEffect,
  useRef,           // ← NEW
  ReactNode,
} from "react";
import { useNavigate } from "@remix-run/react";
import { useMarkets, useWalletConnector } from "@orderly.network/hooks";
import {
  Button,
  Card,
  usePagination,
  ListView,
  Select,
  SelectItem,
} from "@orderly.network/ui";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";
const enTranslations = enTranslationsJson as Record<string, string>;
import TelegramLogin from "@/components/smartbot/TelegramLogin"; // ✅ Add import

import {
  Search as LucideSearch,
  PocketKnife,
  ArrowUp,          // optional: icon for the top button
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   utils                                    */
/* -------------------------------------------------------------------------- */

const useTranslation = () => {
  const { t } = useOrderlyTranslation();
  const currentLang = localStorage.getItem("orderly_i18nLng");

  return (key: string) => {
    const o = t(key);
    if (o !== key) return o;
    if (currentLang === "en" && enTranslations[key]) return enTranslations[key];
    return key;
  };
};


const formatVolume = (v: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);

/* -------------------------------------------------------------------------- */
/*                              component props                               */
/* -------------------------------------------------------------------------- */

interface MobileMarketTableProps {
  setSelectedSymbol: (symbol: string, leverage: number) => void;
  setSelectedSymbolElliot: (symbol: string, leverage: number) => void;
  setSelectedSymbolKelly: (symbol: string, leverage: number) => void;
  setShowGainersModal: (show: boolean) => void;
}

const PAGE_SIZE = 20;

/* -------------------------------------------------------------------------- */
/*                               main component                               */
/* -------------------------------------------------------------------------- */

const MobileMarketTable: FC<MobileMarketTableProps> = ({
  setSelectedSymbol,
  setSelectedSymbolElliot,
  setSelectedSymbolKelly,
  setShowGainersModal,
}) => {
  const t = useTranslation();
  const navigate = useNavigate();

  /* --------------------------- wallet connection -------------------------- */

  const { wallet, connecting, connect } = useWalletConnector();
  const isConnected = !!wallet;

  useEffect(() => {
    const check = () =>
      setConnectedStorage(!!localStorage.getItem("orderly_mainnet_address"));
    const id = setInterval(check, 1_000);
    window.addEventListener("storage", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", check);
    };
  }, []);

  /*------------------------------Check token----------------------------*/
  useEffect(() => {
    // console.log("📌 [useEffect] Starting Telegram auto-link logic");

    const wallet = localStorage.getItem("orderly_mainnet_address");
    const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;

    // console.log("🔍 wallet:", wallet);
    // console.log("🔍 apiUrl:", apiUrl);

    if (!wallet || !apiUrl) {
      console.warn("⛔ Missing wallet or apiUrl. Skipping fetch.");
      return;
    }

    const tryAutoLinkTelegram = async () => {
      // console.log("🚀 Calling Telegram auto-link API...");

      try {
        const response = await fetch(`${apiUrl}/central/tlogin/by_wallet/${wallet}`);
        console.log("[✅ Telegram auto-link response]", response);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Telegram data:", data);

          const userPayload = {
            telegram_id: data.data.telegram_id,
            first_name: "",
            last_name: "",
            username: "",
            photo_url: "",
            auth_date: "",
            hash: "",
          };

          localStorage.setItem("telegram_user", JSON.stringify(userPayload));
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("token_exp", data.data.expires_at.toString());

          window.dispatchEvent(new CustomEvent("telegram-auth", { detail: data }));
        } else {
          console.warn("❌ Telegram auto-link failed with status:", response.status);
        }
      } catch (err) {
        console.error("🔥 Telegram auto-link error", err);
      }
    };

    tryAutoLinkTelegram();
  }, []);


  /* ---------------------------- market data ------------------------------ */

  const [markets] = useMarkets();
  const rawData = useMemo(
    () => (Array.isArray(markets) ? markets : []),
    [markets]
  );

  /* -------------------------- search + sort ------------------------------ */

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const text = search.toLowerCase().trim();
    return rawData
      .filter((m: any) => m.symbol?.toLowerCase().includes(text))
      .sort(
        (a: any, b: any) => (b["24h_amount"] ?? 0) - (a["24h_amount"] ?? 0)
      );
  }, [rawData, search]);

  /* --------------------------- pagination hook --------------------------- */

  const pagination = usePagination({
    total: filteredData.length,
    pageSize: PAGE_SIZE,
    pageSizeOptions: [20, 50, 100],
  });

  useEffect(() => pagination.setPage(1), [search]);

  const pageSlice = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination.page, pagination.pageSize]);

  /* ------------------------- helper: select symbol ----------------------- */

  const handleAction = (m: any, action: string) => {
    const lev = m.leverage ?? 100;
    switch (action) {
      case "smartTrade":
        setSelectedSymbol(m.symbol, lev);
        break;
      case "elliot":
        setSelectedSymbolElliot(m.symbol, lev);
        break;
      case "kelly":
        setSelectedSymbolKelly(m.symbol, lev);
        break;
      default:
    }
  };

  /* --------------------------- list ref & top ---------------------------- */

  type ListRef = { scroll: (dir: { x: number; y: number }) => void };
  const listRef = useRef<ListRef | null>(null);

  const scrollToTop = () => {
    listRef.current?.scroll({ x: 0, y: -1_000_000 });
    pagination.setPage(1); // reset pagination so infinite-scroll works from the top again
  };

  /* ----------------------------------------------------------------------- */
  /*                                   JSX                                   */
  /* ----------------------------------------------------------------------- */

  return (
    <div>
      <Card className="oui-rounded-xl oui-bg-base-7 oui-border oui-border-base-4 oui-overflow-hidden">
        {/* ---------------- header: gainers + search + top ----------------- */}
        {isConnected && (
          <div className="oui-flex oui-flex-col oui-gap-3 oui-pb-4 oui-px-4">
            <div className="oui-flex oui-gap-10 oui-items-center oui-justify-between">
              {/* gainers */}
              <Button
                type="button"
                size="md"
                onClick={() => setShowGainersModal(true)}
                className="oui-inline-flex oui-items-center oui-justify-center
                           oui-h-9 oui-rounded-md oui-px-3
                           oui-bg-base-6 hover:oui-bg-base-5
                           oui-text-base-contrast-36 hover:oui-text-white"
              >
                <PocketKnife className="oui-w-4 oui-h-4" />
                <span className="oui-ml-1">
                  {t("apolo.smartTrade.gainers")}
                </span>
              </Button>

              {/* ⇧ top */}
              <Button
                type="button"
                size="md"
                onClick={scrollToTop}
                className="oui-inline-flex oui-items-center oui-justify-center
                           oui-h-9 oui-rounded-md oui-px-3
                           oui-bg-base-6 hover:oui-bg-base-5
                           oui-text-base-contrast-36 hover:oui-text-white"
              >
                <ArrowUp className="oui-w-4 oui-h-4" />
                <span className="oui-ml-1">{t("apolo.smartTrade.gotoTop") || "Top"}</span>
              </Button>

            </div>

            <div className="flex oui-justify-center">
              <TelegramLogin />
            </div>

            {/* search */}
            <div className="oui-flex oui-items-center oui-bg-base-6 oui-rounded oui-h-9 oui-pl-3 oui-pr-1">
              <LucideSearch className="oui-text-base-contrast-36 oui-w-4 oui-h-4" />
              <input
                type="text"
                placeholder={t("markets.search.placeholder") || "Search"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="oui-bg-transparent oui-flex-1 oui-px-2
                           oui-text-white placeholder:oui-text-base-contrast-20
                           focus-visible:oui-outline-none"
              />
              {search && (
                <Button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="oui-text-base-contrast-36 hover:oui-text-white"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        )}

        {/* --------------------------- body --------------------------------- */}
        {!isConnected ? (
          <div className="oui-p-8 oui-flex oui-flex-col oui-items-center oui-gap-4">
            <Button
              onClick={connect}
              disabled={connecting}
              className="oui-button wallet-connect-button
                         oui-gradient-brand oui-h-9 oui-rounded-md
                         oui-px-4 oui-text-[rgba(0,0,0,0.88)]"
              style={{ "--oui-gradient-angle": "45deg" } as React.CSSProperties}
            >
              {connecting
                ? "Connecting..."
                : t("apolo.smartTrade.conect.wallet")}
            </Button>
            <p className="oui-text-2xs oui-text-base-contrast-36">
              ⚠️ {t("apolo.smartTrade.connect.wallet")}
            </p>
          </div>
        ) : (
          <>
            {/* --------------- listview (infinite scroll) ---------------- */}
            <ListView
              ref={listRef}                              /* ⇠ attach ref */
              dataSource={pageSlice}
              extraData={{ search, page: pagination.page }}
              className="oui-h-[calc(100vh-240px)] oui-w-full"
              contentClassName="oui-flex oui-flex-col"
              loadMore={() => {
                const next = pagination.page + 1;
                const max = Math.ceil(filteredData.length / pagination.pageSize);
                if (next <= max) pagination.setPage(next);
              }}
              renderItem={(m: any): ReactNode => {
                const symbol =
                  m.symbol.startsWith("PERP_") &&
                    m.symbol.split("_").length === 3
                    ? `${m.symbol.split("_")[1]}-PERP`
                    : m.symbol;

                return (
                  <div
                    key={symbol}
                    tabIndex={0}
                    className="oui-flex oui-justify-between oui-items-center
                               oui-px-4 oui-py-3 oui-border-b oui-border-base-4
                               hover:oui-bg-base-6 focus:oui-ring-2 focus:oui-ring-primary"
                  >
                    {/* left */}
                    <div className="oui-flex oui-items-center oui-gap-3">
                      <img
                        className="oui-h-5 oui-w-5 oui-aspect-square"
                        src={`https://oss.orderly.network/static/symbol_logo/${m.symbol.startsWith("PERP_") &&
                          m.symbol.split("_").length === 3
                          ? m.symbol.split("_")[1]
                          : m.symbol.split("-")[0]
                          }.png`}
                        alt={symbol}
                      />
                      <div>
                        <p className="oui-text-white oui-text-sm">{symbol}</p>
                        <p className="oui-text-2xs oui-text-base-contrast-36">
                          {formatVolume(m["24h_amount"] ?? 0)} vol
                        </p>
                      </div>
                    </div>

                    {/* right: select */}
                    <div className="oui-flex oui-items-center oui-gap-3">
                      <Select
                        size="md"
                        variant="contained"
                        placeholder={t("common.smartBot")}
                        position="item-aligned"
                        showCaret
                        value=""
                        onValueChange={(val) => handleAction(m, val)}
                        classNames={{
                          trigger:
                            "oui-rounded-md oui-text-xs oui-font-medium " +
                            "oui-bg-gradient-to-r oui-from-[#e65ced] oui-to-[#ff5983] " +
                            "hover:oui-opacity-90",
                        }}
                      >
                        <SelectItem value="smartTrade">
                          {t("apolo.smartTrade.title")}
                        </SelectItem>
                        <SelectItem value="elliot">
                          {t("apolo.smartTrade.elliotWaves")}
                        </SelectItem>
                        <SelectItem value="kelly">
                          {t("apolo.smartTrade.kelly")}
                        </SelectItem>
                      </Select>
                    </div>
                  </div>
                );
              }}
            />

            {/* ------------- manual “Load more” fallback ------------- */}
            {pagination.page <
              Math.ceil(filteredData.length / pagination.pageSize) && (
                <div className="oui-flex oui-justify-center oui-py-3 oui-mb-10">
                  <Button
                    size="sm"
                    onClick={() => pagination.setPage(pagination.page + 1)}
                  >
                    {t("apolo.smartTrade.loadmore") || "Load more"}
                  </Button>
                </div>
              )}
          </>
        )}
      </Card>
    </div>
  );
};

export default MobileMarketTable;
