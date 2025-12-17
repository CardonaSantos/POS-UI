import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function MainPageWhatsappChat() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sistema de Chat WhatsApp</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Visualiza y gestiona tus conversaciones de WhatsApp con filtros y
            paginación
          </p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Abrir Chat
        </Button>
      </div>
    </div>
  );
}
