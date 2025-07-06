import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const TelegramLoginDialog = () => {
  const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
  const wallet = localStorage.getItem("orderly_mainnet_address") || "0x";
  const language = localStorage.getItem("orderly_i18nLng") || "en";
  const t = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // 📌 Check token expiration and wallet-link status
  useEffect(() => {
    const checkTelegramLink = async () => {
      try {
        const token = localStorage.getItem("token");
        const exp = Number(localStorage.getItem("token_exp") || "0");
        const now = Math.floor(Date.now() / 1000);

        if (token && exp > now) {
          setIsLinked(true);
          setShowDialog(false);
          return;
        }

        // Fetch from backend if wallet is linked
        const response = await fetch(`${apiUrl}/central/tlogin/by_wallet/${wallet}`);
        if (response.ok) {
          const data = await response.json();
          const userPayload = {
            telegram_id: data.data.telegram_id,
            first_name: "",
            last_name: "",
            username: "",
            photo_url: "",
            auth_date: "",
            hash: "",
          };

          const now = Math.floor(Date.now() / 1000);
          const expiresAt = now + Number(data.data.expires_at);

          localStorage.setItem("telegram_user", JSON.stringify(userPayload));
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("token_exp", expiresAt.toString());

          setIsLinked(true);
          setShowDialog(false);
        } else {
          setIsLinked(false);
          setShowDialog(true);
        }
      } catch (error) {
        console.error("Error checking Telegram link:", error);
        setIsLinked(false);
        setShowDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkTelegramLink();
  }, [wallet, apiUrl]);

  // 📌 Handle Telegram widget login
  useEffect(() => {
    (window as any).onTelegramAuth = async function (user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) {
      setIsLoading(true);

      const userPayload = {
        telegram_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || "",
        username: user.username || "",
        photo_url: user.photo_url || "",
        auth_date: user.auth_date,
        hash: user.hash,
      };

      localStorage.setItem("telegram_user", JSON.stringify(userPayload));

      try {
        const tloginPayload = {
          token: Number(user.id),
          wallet_address: wallet,
          want_signal: true,
          language,
        };

        const res = await fetch(`${apiUrl}/central/tlogin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tloginPayload),
        });

        if (!res.ok) throw new Error("TLogin failed");

        const result = await res.json();

        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + Number(result.data.expires_at);

        localStorage.setItem("token", result.data.token);
        localStorage.setItem("token_exp", expiresAt.toString());

        setIsLinked(true);
        setShowDialog(false);

        window.dispatchEvent(new CustomEvent("telegram-auth", { detail: result }));
      } catch (error) {
        console.error("Telegram Auth Error:", error);
        localStorage.removeItem("telegram_user");
      } finally {
        setIsLoading(false);
      }
    };

    return () => {
      (window as any).onTelegramAuth = undefined;
    };
  }, [wallet, language, apiUrl]);

  // 📌 Inject Telegram widget if needed
  useEffect(() => {
    if (!isLoading && showDialog && !isLinked) {
      const tryInjectTelegramWidget = () => {
        const container = document.getElementById("telegram-button-container");
        if (!container) {
          setTimeout(tryInjectTelegramWidget, 100);
          return;
        }

        if (container.childNodes.length > 0) return;
        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", "apolo_futures_bot"); // your bot username
        script.setAttribute("data-size", "large");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;

        container.appendChild(script);
      };

      setTimeout(tryInjectTelegramWidget, 100);
    }

    return () => {
      const container = document.getElementById("telegram-button-container");
      if (container) container.innerHTML = "";
    };
  }, [isLoading, showDialog, isLinked]);

  // 📌 External trigger: open dialog on token expiration
  useEffect(() => {
    const handleForceLogin = () => {
      console.warn("Triggering Telegram login due to expired token");
      setShowDialog(true);
      setIsLinked(false);
    };

    window.addEventListener("force-telegram-login", handleForceLogin);
    return () => window.removeEventListener("force-telegram-login", handleForceLogin);
  }, []);

  if (isLoading || !showDialog || isLinked) return null;

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
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent className="oui-space-y-6 pb-2 dialog-mobile-max">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <img
                src="https://telegram.org/img/t_logo.png"
                alt="Telegram"
                className="oui-h-5 oui-w-5"
                style={{ marginRight: 8 }}
              />
              Connect Telegram Account
            </DialogTitle>
          </DialogHeader>

          <div className="text-center">
            <p className="oui-p-4">{t("apolo.smartTrade.telegram.description")}</p>
            <div
              id="telegram-button-container"
              className="oui-p-4 oui-flex oui-flex-col oui-items-center oui-gap-4"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TelegramLoginDialog;
