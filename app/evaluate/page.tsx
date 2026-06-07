import { Suspense } from "react";
import EvalWizard from "@/components/blind-test/EvalWizard";

export default function EvaluatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center text-slate-600">
          読み込み中…
        </div>
      }
    >
      <EvalWizard />
    </Suspense>
  );
}
