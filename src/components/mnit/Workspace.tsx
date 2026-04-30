import { useState } from "react";
import { useSignatureRequest } from "@/hooks/use-signature-request";
import { Sidebar } from "./Sidebar";
import { Step1Upload } from "./Step1Upload";
import { Step2Recipients } from "./Step2Recipients";
import { Step3Settings } from "./Step3Settings";
import { DocumentPreview } from "./DocumentPreview";
import { SendBar } from "./SendBar";
export function Workspace() {
  const api = useSignatureRequest();
  const [paths, setPaths] = useState<Record<string, string>>({});
  const setPath = (id: string, p: string) => setPaths((s) => ({ ...s, [id]: p }));
  const removePath = (id: string) => setPaths((s) => { const n = { ...s }; delete n[id]; return n; });
  const resetPaths = () => setPaths({});
  return (
    <div className="grid gap-4 px-4 pb-6 md:grid-cols-[280px_minmax(0,1fr)_360px]">
      <Sidebar />
      <div className="flex flex-col gap-4">
        <Step1Upload api={api} paths={paths} setPath={setPath} removePath={removePath} />
        <Step2Recipients api={api} />
        <Step3Settings api={api} />
        <SendBar api={api} paths={paths} resetPaths={resetPaths} />
      </div>
      <div className="md:sticky md:top-4 md:h-[calc(100vh-9rem)]">
        <DocumentPreview api={api} paths={paths} />
      </div>
    </div>
  );
}
