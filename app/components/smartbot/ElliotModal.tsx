import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectItem,
  Spinner,
  ThrottledButton
} from "@orderly.network/ui";
import { Bot } from "lucide-react";
import { useTranslation as useOrderlyTranslation } from "@orderly.network/i18n";
import enTranslationsJson from "../../../public/locales/en.json";
const enTranslations = enTranslationsJson as Record<string, string>;

const useTranslation = () => {
  const { t } = useOrderlyTranslation();
  const currentLang = localStorage.getItem('orderly_i18nLng');
  
  return (key: string) => {
    const orderlyTranslation = t(key);
    if (orderlyTranslation !== key) return orderlyTranslation;
    if (currentLang === 'en' && enTranslations[key]) return enTranslations[key];
    return key;
  };
};

type ElliotModalProps = {
  symbol: string | null;
  onClose: () => void;
  onSubmit: (config: {
    interval: string;
  }) => void;
  responseText?: string | null;
  loading?: boolean;
  maxLeverage_: number;
};

const ElliotModal: FC<ElliotModalProps> = ({
  symbol,
  onClose,
  onSubmit,
  responseText,
  loading,
  maxLeverage_ = 100,
}) => {
  const [interval, setInterval] = useState("");

  const [errors, setErrors] = useState({
    interval: false,
  });

  const t = useTranslation();   

  const handleSubmit = () => {
    const newErrors = {
      interval: interval === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    onSubmit({
      interval,
    });
  };

  const displaySymbol =
    symbol?.startsWith("PERP_") && symbol.split("_").length === 3
      ? `${symbol.split("_")[1]}-PERP`
      : symbol ?? "";

  const symbolIcon =
    symbol?.startsWith("PERP_") && symbol.split("_").length === 3
      ? symbol.split("_")[1]
      : symbol?.split("-")[0] ?? "";

  return (
    <Dialog open={!!symbol} onOpenChange={onClose}>
      <DialogContent className="oui-space-y-6 pb-2">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <img
              src={`https://oss.orderly.network/static/symbol_logo/${symbolIcon}.png`}
              alt={displaySymbol}
              className="oui-h-5 oui-w-5"
              style={{ marginRight: 8 }}
            />
            {t("apolo.smartTrade.elliotWaves.title")} {displaySymbol}
          </DialogTitle>
        </DialogHeader>

        {responseText ? (
          <div className="oui-space-y-4">
            <div className="oui-text-md oui-text-white whitespace-pre-wrap">
              {responseText}
            </div>
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <Button size="md" icon={<Bot />} onClick={onClose}>
                {t("apolo.smartTrade.close")}
              </Button>
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

            {/* Submit Button */}
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <ThrottledButton
                throttleDuration={10000}
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
                  t("apolo.smartTrade.smartanalysis")
                )}
              </ThrottledButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ElliotModal;
