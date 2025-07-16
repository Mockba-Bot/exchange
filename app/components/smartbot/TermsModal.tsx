import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@orderly.network/ui";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";

const enTranslations = enTranslationsJson as Record<string, string>;

const useTranslation = () => {
  const { t } = useOrderlyTranslation();
  const [currentLang, setCurrentLang] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLang(localStorage.getItem("orderly_i18nLng"));
    }
  }, []);

  return (key: string) => {
    const orderlyTranslation = t(key);
    if (orderlyTranslation !== key) return orderlyTranslation;
    if (currentLang === "en" && enTranslations[key]) return enTranslations[key];
    return key;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const TermsModal: FC<Props> = ({ open, onClose }) => {
  const t = useTranslation();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("orderly_i18nLng");
      if (storedLang) setLang(storedLang);
    }
  }, []);

  const href =
    lang === "en"
      ? "https://learning-dex.apolopay.app/docs/terms_of_use"
      : `https://learning-dex.apolopay.app/${lang}/docs/terms_of_use`;

  const handleAccept = () => {
    onClose();
    if (typeof window !== "undefined") {
      localStorage.setItem("terms", "accepted");
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .dialog-mobile-max {
              max-width: 90% !important;
              margin-top: 3px !important;
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
      <DialogContent
        className="oui-space-y-6 oui-pb-4 dialog-mobile-max"
        style={{ maxWidth: 600 }}
      >
        <DialogHeader>
          <DialogTitle>{t("apolo.terms.conditions")}</DialogTitle>
        </DialogHeader>
        <div className="oui-text-sm oui-text-base-contrast leading-relaxed">
          {t("apolo.terms.condition.read")}
        </div>
        <div className="oui-text-sm oui-text-base-contrast leading-relaxed oui-mt-4 oui-mb-6" style={{ textAlign: "center", fontSize: "18px" }}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {t("apolo.terms.condition.link")}
          </a>
        </div>
        <div className="dialog-actions oui-flex oui-justify-center oui-pt-15">
          <Button
            variant="contained"
            size="md"
            onClick={handleAccept}
            color="primary"
          >
            {t("apolo.terms.conditions.approve")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default TermsModal;
