import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button
} from "@orderly.network/ui";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";
import { useNavigate } from "react-router-dom";

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

type Props = {
  open: boolean;
  message: string;
  selectedAsset?: string; // Add selectedAsset prop
  onClose: () => void; // Add onClose handler
};


const formatTelegramText = (text: string) => {
  return text
    .replace(/\n/g, "<br />")
    .replace(/\s{2,}/g, " ");
};

const AnalysisResultModal: FC<Props> = ({ open, message, selectedAsset = "PERP_ETH_USDC", onClose }) => {
  const t = useTranslation();
  const formattedHTML = formatTelegramText(message);
  const navigate = useNavigate();
  const currentLang = localStorage.getItem("orderly_i18nLng") || "en";

  const handleGoToTrade = () => {
    navigate(`/${currentLang}/perp/${selectedAsset}`);
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .dialog-mobile-max {
              max-width: 90% !important;
            }
          }
          .analysis-content {
            max-height: 75vh;
            overflow-y: auto;
            max-width: 600px;
            padding-right: 8px;
          }
          /* Scrollbar styling */
          .analysis-content::-webkit-scrollbar {
            width: 6px;
          }
          .analysis-content::-webkit-scrollbar-track {
            background: transparent;
          }
          .analysis-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          .analysis-content::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
      <Dialog open={open}>
        <DialogContent className="oui-space-y-6 oui-pb-4 dialog-mobile-max" style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>📊 {t("apolo.smartTrade.success.title")} - {t("apolo.smartTrade.success.subtitle")}</span>
            </DialogTitle>
          </DialogHeader>
          <div
            className="analysis-content oui-text-sm oui-text-base-contrast leading-relaxed whitespace-pre-wrap oui-mt-3"
            dangerouslySetInnerHTML={{ __html: formattedHTML }}
          />
          <div className="dialog-actions oui-flex oui-justify-end oui-pt-5">
            <Button variant="outlined" size="md" onClick={onClose}>
              {t("positions.column.close")}
            </Button>
            <Button 
              variant="contained" 
              size="md"
              className="oui-ml-2"
              onClick={handleGoToTrade}
              color="primary"
            >
              {t("common.trading")}: {selectedAsset}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnalysisResultModal;