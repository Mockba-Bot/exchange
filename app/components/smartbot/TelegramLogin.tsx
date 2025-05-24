import { useEffect } from "react";

const TelegramLogin = () => {
  const apiUrl = import.meta.env.VITE_MOCKBA_API_URL; // Vite
  // console.log("✅ VITE_MOCKBA_API_URL:", apiUrl); // <--- Add this
// or
// const apiUrl = process.env.REACT_APP_MOCKBA_API_URL; // CRA
  useEffect(() => {
    // Define the global Telegram auth handler
    (window as any).onTelegramAuth = async function (user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) {
      // console.log("✅ Telegram user authenticated:", user);

      const userPayload = {
        telegram_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || "",
        username: user.username || "",
        auth_date: user.auth_date,
        hash: user.hash,
      };

      // Save locally if needed
      localStorage.setItem("telegram_user", JSON.stringify(userPayload));

      try {
        const response = await fetch(`${apiUrl}/central/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        });

        const result = await response.json();
        // console.log("✅ Backend response:", result);

        // Dispatch event if needed
        const event = new CustomEvent("telegram-auth", { detail: result });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("❌ Error sending data to backend:", error);
      }
    };

    // Dynamically inject the Telegram Login Button
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "Mockadv_bot"); // Replace with your bot username
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-auth-url", `${apiUrl}/central/telegram`);
    script.setAttribute("data-request-access", "write");
    script.async = true;

    const container = document.getElementById("telegram-button-container");
    if (container) {
      container.innerHTML = ""; // Clear previous widget if re-rendered
      container.appendChild(script);
    }

    return () => {
      (window as any).onTelegramAuth = undefined;
    };
  }, []);

  return <div id="telegram-button-container" className="flex justify-center" />;
};

export default TelegramLogin;
