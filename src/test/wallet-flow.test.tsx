import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WalletFlowProvider, useWalletFlow } from "@/components/WalletFlowProvider";

function Probe() {
  const { account, delivery, setAccount, setDelivery } = useWalletFlow();
  return <><button onClick={() => {
    setAccount({ day: "25", phone: "(11) 99999-1234", email: "teste@example.com", digitalBill: true, whatsappAlerts: false });
    setDelivery({ rua: "Travessa das Rosas", numero: "33", complemento: "Apto 2", bairro: "Soledade", cidade: "Aracaju", uf: "SE", cep: "49089-084" });
  }}>Confirmar</button><output data-testid="account">{JSON.stringify(account)}</output><output data-testid="delivery">{JSON.stringify(delivery)}</output></>;
}

describe("transient wallet details", () => {
  it("retains the selected due day and confirmed account details in memory", () => {
    render(<WalletFlowProvider><Probe /></WalletFlowProvider>);
    fireEvent.click(screen.getByText("Confirmar"));
    expect(JSON.parse(screen.getByTestId("account").textContent ?? "null")).toEqual({ day: "25", phone: "(11) 99999-1234", email: "teste@example.com", digitalBill: true, whatsappAlerts: false });
  });
  it("retains the entered address rather than hardcoding the reference", () => {
    render(<WalletFlowProvider><Probe /></WalletFlowProvider>);
    fireEvent.click(screen.getByText("Confirmar"));
    expect(JSON.parse(screen.getByTestId("delivery").textContent ?? "null")).toEqual({ rua: "Travessa das Rosas", numero: "33", complemento: "Apto 2", bairro: "Soledade", cidade: "Aracaju", uf: "SE", cep: "49089-084" });
  });
  it("clears personal details when the flow is recreated", () => {
    const first = render(<WalletFlowProvider><Probe /></WalletFlowProvider>);
    fireEvent.click(screen.getByText("Confirmar"));
    first.unmount();
    render(<WalletFlowProvider><Probe /></WalletFlowProvider>);
    expect(screen.getByTestId("account").textContent).toBe("null");
    expect(screen.getByTestId("delivery").textContent).toBe("null");
  });
});