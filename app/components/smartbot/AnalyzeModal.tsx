import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  Spinner,
  Button,
} from "@orderly.network/ui";
import { WandSparkles } from "lucide-react";

type AnalyzeModalProps = {
  symbol: string | null;
  onClose: () => void;
  onSubmit: (config: {
    interval: string;
    leverage: number;
    indicator: string;
  }) => void;
  responseText?: string | null;
  loading?: boolean;
  maxLeverage_: number;
};

const AnalyzeModal: FC<AnalyzeModalProps> = ({
  symbol,
  onClose,
  onSubmit,
  responseText,
  loading,
  maxLeverage_ = 50, // Default fallback
}) => {
  const [interval, setInterval] = useState("");
  const [leverage, setLeverage] = useState("");
  const [indicator, setIndicator] = useState("");

  const [errors, setErrors] = useState({
    interval: false,
    leverage: false,
    indicator: false,
  });

  const handleSubmit = () => {
    const numericLeverage = Number(leverage);

    const newErrors = {
      interval: interval === "",
      leverage:
        leverage === "" ||
        isNaN(numericLeverage) ||
        numericLeverage < 1 ||
        numericLeverage > maxLeverage_,
      indicator: indicator === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    onSubmit({
      interval,
      leverage: numericLeverage,
      indicator,
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
            Analyze {displaySymbol}
          </DialogTitle>
        </DialogHeader>

        {responseText ? (
          <div className="oui-space-y-4">
            <div className="oui-text-sm oui-text-white whitespace-pre-wrap">
              {responseText}
            </div>
            <div className="oui-flex justify-end gap-2 pt-2 pb-4">
              <Button size="sm" icon={<WandSparkles />} onClick={onClose}>
                Close
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
                Select interval <span className="text-red-500">*</span>
              </label>
              <Select
                value={interval}
                onValueChange={(val) => {
                  setInterval(val);
                  setErrors((e) => ({ ...e, interval: false }));
                }}
                data-state={errors.interval ? "error" : "normal"}
              >
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="1d">1d</option>
              </Select>
              {errors.interval && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  This field is required.
                </p>
              )}
            </div>

            {/* Leverage */}
            <div>
              <label className="oui-text-xs oui-text-base-contrast mb-1 block">
                Input leverage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={maxLeverage_}
                step={1}
                value={leverage}
                onChange={(e) => {
                  setLeverage(e.target.value);
                }}
                onKeyUp={() => {
                  const numericValue = Number(leverage);
                  const isValid =
                    leverage !== "" &&
                    !isNaN(numericValue) &&
                    numericValue >= 1 &&
                    numericValue <= maxLeverage_;

                  setErrors((err) => ({
                    ...err,
                    leverage: !isValid,
                  }));
                }}
                className={`oui-input-input oui-w-full oui-h-8 oui-px-2 oui-bg-base-6 oui-rounded-md oui-text-white oui-border ${errors.leverage ? "oui-border-danger" : "oui-border-base-4"
                  }`}
                placeholder={`e.g. ${maxLeverage_}`}
              />

              {errors.leverage && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  {leverage === "" || isNaN(Number(leverage))
                    ? "This field is required."
                    : `Leverage must be between 1 and ${maxLeverage_}.`}
                </p>
              )}
            </div>

            {/* Indicator */}
            <div>
              <label className="oui-text-xs oui-text-base-contrast mb-1 block">
                Select indicator <span className="text-red-500">*</span>
              </label>
              <Select
                value={indicator}
                onValueChange={(val) => {
                  setIndicator(val);
                  setErrors((e) => ({ ...e, indicator: false }));
                }}
                data-state={errors.indicator ? "error" : "normal"}
              >
                <option value="VWAP">VWAP</option>
                <option value="EMA">EMA</option>
                <option value="MACD">MACD</option>
                <option value="RSI">RSI</option>
              </Select>
              {errors.indicator && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  This field is required.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <Button
                size="sm"
                icon={<WandSparkles />}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Analyzing...
                  </>
                ) : (
                  "Run Analysis"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeModal;
