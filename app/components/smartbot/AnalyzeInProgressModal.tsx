// components/smartbot/AnalyzeInProgressModal.tsx

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@orderly.network/ui";
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

type Props = {
  open: boolean;
};

const AnalyzeInProgressModal: FC<Props> = ({ open }) => {
  const t = useTranslation();

  return (
    <>
    <style>
        {`
          @media (max-width: 640px) {
            .dialog-mobile-max {
              max-width: 90% !important;
            }
          }
        `}
      </style>
    <Dialog open={open}>
      <DialogContent className="oui-space-y-6 oui-pb-4 dialog-mobile-max">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Spinner size="md" className="oui-mr-2" />
            {t("apolo.smartTrade.in.progress.tittle")}
          </DialogTitle>
        </DialogHeader>
        <div className="oui-text-sm oui-text-base-contrast">
          {t("apolo.smartTrade.in.progress.subtitle")}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default AnalyzeInProgressModal;
