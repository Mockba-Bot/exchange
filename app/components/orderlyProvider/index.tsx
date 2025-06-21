import { FC, ReactNode } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { LocaleProvider, LocaleCode, LocaleEnum } from "@orderly.network/i18n";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

// Wallet modules
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

const OrderlyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

  const onLanguageChanged = async (lang: LocaleCode) => {
    window.history.replaceState({}, "", `/${lang}${path}`);
  };

  const loadPath = (lang: LocaleCode) => {
    if (lang === LocaleEnum.en) {
      return `/locales/extend/${lang}.json`;
    }
    return [`/locales/${lang}.json`, `/locales/extend/${lang}.json`];
  };

  // Setup injected wallets (e.g. MetaMask)
  const injected = injectedModule();

  // Setup WalletConnect (no metadata here!)
  const walletConnect = walletConnectModule({
    projectId: "4e18fe286d86f7adf1e7e465761af96f", // <-- Replace with actual WalletConnect v2 Project ID
    dappUrl: "https://dex.apolopay.app" // ✅ Must be real, public domain
  });

  return (
    <LocaleProvider onLanguageChanged={onLanguageChanged} backend={{ loadPath }}>
      <WalletConnectorProvider
        evmInitial={{
          options: {
            wallets: [injected, walletConnect],
            chains: [
              {
                id: "0x1",
                token: "ETH",
                label: "Ethereum",
                rpcUrl: "https://eth.nodeconnect.org"
              },
              {
                id: "0xa4b1", // Arbitrum One
                token: "ETH",
                label: "Arbitrum",
                rpcUrl: "https://arb1.arbitrum.io/rpc"
              },
              {
                id: "0xa", // Optimism
                token: "ETH",
                label: "Optimism",
                rpcUrl: "https://mainnet.optimism.io"
              },
              {
                id: "0x2105", // Base Mainnet
                token: "ETH",
                label: "Base",
                rpcUrl: "wss://base-rpc.publicnode.comg"
              },
              {
                id: "0x1388", // Mantle
                token: "MNT",
                label: "Mantle",
                rpcUrl: "https://rpc.mantle.xyz"
              },
              {
                id: "0xa86a", // Avalanche C-Chain
                token: "AVAX",
                label: "Avalanche",
                rpcUrl: "https://avalanche.drpc.org"
              },
              {
                id: "0x868b", // Mode
                token: "ETH",
                label: "Mode",
                rpcUrl: "https://mainnet.mode.network"
              },
              {
                id: "0x5ea", // Story Protocol (hypothetical ID, check real one)
                token: "STRY",
                label: "Story",
                rpcUrl: "https://story-mainnet-evmrpc.mandragora.io"
              },
              {
                id: "0x18232", // Plume (replace with actual)
                token: "PLUME",
                label: "Plume",
                rpcUrl: "https://rpc.plume.orgk"
              },
              {
                id: "0x92", // Sonic (replace with actual)
                token: "SONIC",
                label: "Sonic",
                rpcUrl: "https://rpc.ankr.com/sonic_mainnet"
              },
              {
                id: "0x138de", // Berachain (replace with actual mainnet ID)
                token: "BERA",
                label: "Berachain",
                rpcUrl: "https://bartio.rpc.berachain.com/"
              }
            ],

            appMetadata: {
              name: "Apolo Pay",
              description: "Connect your wallet to trade with Orderly",
              icon: "https://glogaldv.nyc3.cdn.digitaloceanspaces.com/ApoloDex/logo.png" // or replace with a valid icon URL
            }
          }
        }}
      >
        <OrderlyAppProvider
          brokerId="apolo_pay"
          brokerName="Apolo pay"
          networkId="mainnet"
          appIcons={config.orderlyAppProvider.appIcons}
        >
          {children}
        </OrderlyAppProvider>
      </WalletConnectorProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
