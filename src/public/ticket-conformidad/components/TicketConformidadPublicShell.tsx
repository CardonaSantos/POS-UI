import type { PropsWithChildren } from "react";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

export function TicketConformidadPublicShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-dvh bg-background">
      <AppContainer size="sm" paddingX="sm" paddingY="md">
        <div className="flex min-h-[calc(100dvh-2rem)] items-center justify-center py-3 sm:py-6">
          <AppStack gap="md" fullWidth>
            {children}
          </AppStack>
        </div>
      </AppContainer>
    </main>
  );
}
