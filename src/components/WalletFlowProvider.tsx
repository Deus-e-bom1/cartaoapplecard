import { createContext, useContext, useState, type ReactNode } from "react";

export type AccountDetails = { day: string; phone: string; email: string; digitalBill: boolean; whatsappAlerts: boolean };
export type DeliveryDetails = { cep: string; rua: string; numero: string; complemento: string; bairro: string; cidade: string; uf: string };
type WalletFlow = {
  account: AccountDetails | null;
  delivery: DeliveryDetails | null;
  setAccount: (account: AccountDetails) => void;
  setDelivery: (delivery: DeliveryDetails) => void;
};
const WalletFlowContext = createContext<WalletFlow | null>(null);

// Deliberately memory-only: no personal data is written to storage or history.
export function WalletFlowProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  return <WalletFlowContext.Provider value={{ account, delivery, setAccount, setDelivery }}>{children}</WalletFlowContext.Provider>;
}

export function useWalletFlow() {
  const context = useContext(WalletFlowContext);
  if (!context) throw new Error("WalletFlowProvider is required");
  return context;
}