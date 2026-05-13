"use client";

import { WhatsappLayout } from "./whatsapp-layout";

/**
 * WhatsappChatsView
 *
 * Drop-in replacement for the old WhatsappChats page.
 * Wraps the full-height layout in whatever outer container/PageTransition
 * the router already provides.
 *
 * Usage (in your router or page):
 *   import { WhatsappChatsView } from "@/components/whatsapp/whatsapp-chats-view";
 *   ...
 *   <WhatsappChatsView />
 *
 * If you use PageTransitionCrm wrap it here:
 *   <PageTransitionCrm titleHeader="Nuvia - Mensajería" subtitle="..." variant="fade-pure">
 *     <WhatsappChatsView />
 *   </PageTransitionCrm>
 */
export function WhatsappChatsView() {
  return (
    <div className="h-[calc(100vh-65px)] w-full overflow-hidden">
      <WhatsappLayout />
    </div>
  );
}
