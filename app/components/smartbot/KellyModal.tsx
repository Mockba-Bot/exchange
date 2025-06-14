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

type KellyModalProps = {
  symbol: string | null;
  onClose: () => void;
  onSubmit: (config: {
    interval: string;
    leverage: number;
    indicator: string;
    freeCollateral: number;
  }) => void;
  responseText?: string | null;
  loading?: boolean;
  maxLeverage_: number;
};

const KellyModal: FC<KellyModalProps> = ({
  symbol,
  onClose,
  onSubmit,
  responseText,
  loading,
  maxLeverage_ = 100,
}) => {
  const [interval, setInterval] = useState("");
  const [leverage, setLeverage] = useState("");
  const [indicator, setIndicator] = useState("");
  const [freeCollateral, setFreeCollateral] = useState("");

  const [errors, setErrors] = useState({
    interval: false,
    leverage: false,
    indicator: false,
    freeCollateral: false,
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
      freeCollateral: Number(freeCollateral) < 0 || isNaN(Number(freeCollateral)),
      indicator: indicator === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    onSubmit({
      interval,
      leverage: numericLeverage,
      indicator,
      freeCollateral: Number(freeCollateral),
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
            Kelly+Montecarlo  {displaySymbol}
          </DialogTitle>
        </DialogHeader>

        {responseText ? (
          <div className="oui-space-y-4">
            <div className="oui-text-md oui-text-white whitespace-pre-wrap">
              {responseText}
            </div>
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <Button size="md" icon={<Bot />} onClick={onClose}>
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
                  setErrors((err) => ({ ...err, interval: false }));
                }}
                size="lg"
                variant="outlined"
                error={errors.interval}
                placeholder="Select interval"
                classNames={{ trigger: "w-full" }}
              >
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1d">1d</SelectItem>
              </Select>
              {errors.interval && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  This field is required.
                </p>
              )}
            </div>

            {/* Leverage */}
            <div>
              <label htmlFor="leverage-input" className="oui-text-xs oui-text-base-contrast mb-1 block">
                Input leverage <span className="text-red-500">*</span>
              </label>
              <input
                id="leverage-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxLeverage_}
                step={1}
                value={leverage}
                onChange={(e) => {
                  let val = e.target.value;
                  // Remove non-digit characters
                  val = val.replace(/[^0-9]/g, "");
                  // Prevent multiple leading zeros, but allow a single "0"
                  if (val.length > 1) {
                    val = val.replace(/^0+/, "");
                  }
                  setLeverage(val);
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
                className={`oui-input-input oui-w-full oui-h-8 oui-px-2 oui-bg-base-6 oui-rounded-md oui-text-white oui-border ${
                  errors.leverage ? "oui-border-danger" : "oui-border-base-4"
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

            {/* Free Collateral */}
            <div>
              <label htmlFor="free-collateral-input" className="oui-text-xs oui-text-base-contrast mb-1 block">
                Input free collateral <span className="text-red-500">*</span>
              </label>
              <input
                id="free-collateral-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={freeCollateral}
                onChange={(e) => {
                  setFreeCollateral(Number(e.target.value));
                }}
                onKeyUp={() => {
                  const isValid = freeCollateral >= 0;

                  setErrors((err) => ({
                    ...err,
                    freeCollateral: !isValid,
                  }));
                }}
                className={`oui-input-input oui-w-full oui-h-8 oui-px-2 oui-bg-base-6 oui-rounded-md oui-text-white oui-border ${
                  errors.freeCollateral ? "oui-border-danger" : "oui-border-base-4"
                }`}
                placeholder="e.g. 100"
              />
              {errors.freeCollateral && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  {isNaN(freeCollateral) || freeCollateral === 0
                    ? "This field is required."
                    : `Free collateral must be a positive number.`}
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
                  setErrors((err) => ({ ...err, indicator: false }));
                }}
                size="lg"
                variant="outlined"
                error={errors.indicator}
                placeholder="Choose strategy"
                classNames={{ trigger: "w-full" }}
              >
                <SelectItem value="Trend-Following">Trend-Following</SelectItem>
                <SelectItem value="Volatility Breakout">Volatility Breakout</SelectItem>
                <SelectItem value="Momentum Reversal">Momentum Reversal</SelectItem>
                <SelectItem value="Momentum + Volatility">Momentum + Volatility</SelectItem>
                <SelectItem value="Advanced">Hybrid</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </Select>
              {errors.indicator && (
                <p className="oui-text-xs oui-text-danger mt-1">
                  This field is required.
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
                    Smart Analysis...
                  </>
                ) : (
                  "Run Analysis"
                )}
              </ThrottledButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KellyModal;
