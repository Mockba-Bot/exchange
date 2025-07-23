import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectItem,
  ThrottledButton,
  Spinner,
} from "@orderly.network/ui";
import { Bot } from "lucide-react";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";
const enTranslations = enTranslationsJson as Record<string, string>;

const useTranslation = () => {
  const { t } = useOrderlyTranslation();
  
  return (key: string) => {
    // Get current language safely
    const currentLang = typeof window !== 'undefined' 
      ? localStorage.getItem('orderly_i18nLng') || 'en'
      : 'en';
    
    // Get translation from orderly
    const orderlyTranslation = t(key);
    
    // Ensure we always return a string
    if (typeof orderlyTranslation === 'string' && orderlyTranslation !== key) {
      return orderlyTranslation;
    }
    
    // Fallback to custom translations
    if (currentLang === 'en' && enTranslations[key]) {
      return String(enTranslations[key]); // Ensure it's a string
    }
    
    // Always return a string, even if it's just the key
    return String(key);
  };
};

type AnalyzeModalProps = {
  symbol: string | null;
  onClose: () => void;
  onSubmit: (config: {
    interval: string;
    type: "gainers" | "losers";
  }) => void;
  responseText?: string | null;
  loading?: boolean;
};

const GainersModal: FC<AnalyzeModalProps> = ({
  symbol,
  onClose,
  onSubmit,
  responseText,
  loading,
}) => {
  const [interval, setInterval] = useState("");
  const [type, setType] = useState("");
  const t = useTranslation();

  const [errors, setErrors] = useState({
    interval: false,
    type: false,
  });

  const handleSubmit = () => {
    const newErrors = {
      interval: interval === "",
      type: type === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    onSubmit({
      interval,
      type: type as "gainers" | "losers",
    });
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
        `}
      </style>
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="oui-space-y-6 oui-pb-2 dialog-mobile-max">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {t("apolo.smarTrade.marketAnalysis.tittle")}
          </DialogTitle>
        </DialogHeader>

        {responseText ? (
          <div className="oui-space-y-4">
            <div className="oui-text-md oui-text-white whitespace-pre-wrap">
              {responseText}
            </div>
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <ThrottledButton size="md" icon={<Bot />} onClick={onClose}>
                {t("apolo.smartTrade.close")}
              </ThrottledButton>
            </div>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="oui-space-y-4"
          >
            {/* Interval */}
            <div>
              <label className="oui-text-xs oui-text-base-contrast mb-1 block">
                {t("apolo.smartTrade.select.interval")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={interval}
                onValueChange={(val) => {
                  setInterval(val);
                  setErrors((err) => ({ ...err, interval: false }));
                }}
                size="lg"
                variant="outlined"
                error={errors.interval}
                placeholder={t("apolo.smartTrade.select.interval")}
                classNames={{ trigger: "w-full" }}
              >
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="30m">30m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1d">1d</SelectItem>
              </Select>
              {errors.interval && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  {t("apolo.smartTrade.required")}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="oui-text-xs oui-text-base-contrast mb-1 block">
                {t("apolo.smartTrade.select")} <span className="text-red-500">*</span>
              </label>
              <Select
                value={type}
                onValueChange={(val) => {
                  setType(val);
                  setErrors((err) => ({ ...err, type: false }));
                }}
                size="lg"
                variant="outlined"
                error={errors.type}
                placeholder={t("apolo.smartTrade.gainers")}
                classNames={{ trigger: "w-full" }}
              >
                <SelectItem value="gainers">{t("apolo.smartTrade.gainers.select")}</SelectItem>
                <SelectItem value="losers">{t("apolo.smartTrade.losers.select")}</SelectItem>
              </Select>
              {errors.type && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  {t("apolo.smartTrade.required")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <ThrottledButton
                throttleDuration={12000}
                size="md"
                icon={<Bot />}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    ...
                  </>
                ) : (
                  t("apolo.smartTrade.analysis.button")
                )}
              </ThrottledButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default GainersModal;
