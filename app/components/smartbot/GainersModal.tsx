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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="oui-space-y-6 pb-2">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Market Signal Analysis
          </DialogTitle>
        </DialogHeader>

        {responseText ? (
          <div className="oui-space-y-4">
            <div className="oui-text-md oui-text-white whitespace-pre-wrap">
              {responseText}
            </div>
            <div className="oui-flex oui-justify-end oui-gap-2 oui-pt-2 oui-pb-4">
              <ThrottledButton size="md" icon={<Bot />} onClick={onClose}>
                Close
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

            {/* Type */}
            <div>
              <label className="oui-text-xs oui-text-base-contrast mb-1 block">
                Select type <span className="text-red-500">*</span>
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
                placeholder="Gainers or Losers"
                classNames={{ trigger: "w-full" }}
              >
                <SelectItem value="gainers">Gainers</SelectItem>
                <SelectItem value="losers">Losers</SelectItem>
              </Select>
              {errors.type && (
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

export default GainersModal;
