export const validateToken = async (
  token: string,
  apiUrl: string
): Promise<boolean> => {
  try {
    const exp = Number(localStorage.getItem("token_exp") || "0");
    const now = Math.floor(Date.now() / 1000);

    if (!token || exp < now) {
      console.warn("⛔ Token is missing or expired in localStorage");
      return false;
    }

    const res = await fetch(`${apiUrl}/central/tlogin/validate/${token}`);
    if (!res.ok) {
      console.warn("❌ Token failed backend validation");
      return false;
    }

    return true;
  } catch (err) {
    console.error("🚨 Error validating token", err);
    return false;
  }
};
