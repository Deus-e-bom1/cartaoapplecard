<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep scroll reveals, count-up values, and the animated titanium card in reusable browser-safe components; honor reduced-motion preferences so animation does not prevent access to content.
- Keep the application identity step in its own file-based route. CPF lookup goes through the `/api/consulta-cpf` server route, which reads the `CPF_API_TOKEN` env var server-side and never exposes it to the browser; lookup results are passed to `/solicitar/confirmar` via router state only — nothing is persisted.
- Keep confirmation, transitional loading, and quiz screens in separate file-based routes; carry identity through router state and hold quiz choices only in component state so the flow never adds persistent personal data.
- Carry completed quiz answers through router state to analysis and chat; calculate simulated offers with the shared pure offer function so every displayed amount follows the same tested rule without persisting personal data.
- Keep selfie capture browser-only and transient; stop camera tracks on exit and do not upload or persist the captured photo.
- After a successful capture, automatically open a separate browser-only preparation route with timed progress before the post-selfie status; never carry the photo into router state or label local preparation as biometric analysis.
- Keep the post-selfie status in a separate file-based route, carry only existing identity and quiz state to it; per Carla's approved design it displays "Identidade Verificada" with Score "98.7%" and "Aprovado • Face ID Match" (demo copy, not a real verification).
- The chat's confirmed card color is stored in sessionStorage (browser-only, not personal data) so the approval screen can render the chosen card; never put the color in router history state.
- The account setup step is its own route after approval; fields are edited locally and copied to the memory-only WalletFlowProvider on continuation so Wallet can display them without persistence or history state. Use the local Toggle button, not Radix Switch, because the project's Vite bundle has an invalid-hook-call issue.
- The delivery address step is its own route after account setup; CEP lookup calls public ViaCEP client-side and confirmed address fields are copied only to WalletFlowProvider so Wallet can display the entered address without storage or history state.
- Keep activation in its own route with reusable browser-safe timed progress and navigate automatically to Wallet on completion; this remains demo UI and never calls Apple or a bank.
- Wallet is its own file-based route; reuse MetalCard and the shared offer calculation, read only the confirmed color from sessionStorage, and keep account/address data in a root-scoped memory-only provider so it disappears on reload. Wallet actions are local demonstration states, not bank or shipping requests.
