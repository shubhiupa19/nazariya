import { Suspense } from "react";

import { PageShell } from "@/components/shared/page-shell";
import { ReframeApp } from "@/components/shared/reframe-app";

export default function AppPage() {
  return (
    <PageShell className="pb-20 pt-10 md:pb-24 md:pt-14">
      <Suspense>
        <ReframeApp />
      </Suspense>
    </PageShell>
  );
}
