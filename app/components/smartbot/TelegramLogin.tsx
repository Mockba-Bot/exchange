import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@orderly.network/ui";

const TelegramLoginDialog = () => {
  const apiUrl = import.meta.env.VITE_MOCKBA_API_URL;
  const wallet = localStorage.getItem("orderly_mainnet_address") || "0x";
  const language = localStorage.getItem("orderly_i18nLng") || "en";

  const [isLoading, setIsLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const checkTelegramLink = async () => {
      try {
        const response = await fetch(`${apiUrl}/central/tlogin/by_wallet/${wallet}`);
        const data = await response.json();
        if (response.ok) {
          // console.log("Telegram link check response:", response);
          if (data.data && data.data.token) {
            localStorage.setItem("token", data.data.token);
            setIsLinked(true);
            setShowDialog(false);
          } else {
            setIsLinked(false);
            setShowDialog(true);
          }
        } else if (response.status === 404) {
          setIsLinked(false);
          setShowDialog(true);
        } else {
          console.error("Unexpected error:", response.status);
          setIsLinked(false);
          setShowDialog(true);
        }
      } catch (error) {
        console.error("Network error:", error);
        setIsLinked(false);
        setShowDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkTelegramLink();

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
          token: user.id.toString(),
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

  useEffect(() => {
    if (!isLoading && showDialog && !isLinked) {
      const tryInjectTelegramWidget = () => {
        const container = document.getElementById("telegram-button-container");
        if (!container) {
          // Retry after 100ms if container not ready
          setTimeout(tryInjectTelegramWidget, 100);
          return;
        }

        if (container.childNodes.length > 0) return; // already injected

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", "apolo_futures_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;

        container.appendChild(script);
      };

      // Start injection after short delay to ensure DOM stability
      setTimeout(tryInjectTelegramWidget, 100);
    }

    return () => {
      const container = document.getElementById("telegram-button-container");
      if (container) container.innerHTML = "";
    };
  }, [isLoading, showDialog, isLinked]);

  if (isLoading || !showDialog || isLinked) return null;

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="oui-space-y-6 pb-2" hideCloseButton>
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
          <p className="oui-p-4">Please connect your Telegram account to continue.</p>
          <div
            id="telegram-button-container"
            className="oui-p-4 oui-flex oui-flex-col oui-items-center oui-gap-4"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramLoginDialog;
