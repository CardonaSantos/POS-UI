import { motion } from "framer-motion";
import { MetricsTicket, Ticket } from "../ticketTypes";
import { formattFechaWithMinutes } from "@/utils/formattFechas";
import { CheckCircle2, Clock, Lock } from "lucide-react";

interface TicketTimelineProps {
  comments: Ticket["comments"];
  creator: Ticket["creator"];
  closedAt?: string | null;
   metricas: MetricsTicket
}

const formatDuration = (totalMinutes: number) => {
  if (!totalMinutes) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
};


export const TicketTimeline = ({ comments, creator, metricas }: TicketTimelineProps) => {


  
  return (
    <div className="flex-1 p-3 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-200">
        
      {creator && (
        <div className="text-center pt-1 pb-2 opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[9px] text-gray-400">
            Creado por {creator.name}
          </p>
        </div>
      )}

      {metricas && (
  <div className="mx-2 mb-4 space-y-2">
    
    {/* A. Chip de Tiempo Total (Centrado y sutil) */}
    {metricas.timeSpentMinutes > 0 && (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] border border-slate-200 dark:border-slate-700">
          <Clock className="w-3 h-3" />
          <span className="font-medium">Tiempo invertido:</span>
          <span>{formatDuration(metricas.timeSpentMinutes)}</span>
        </div>
      </div>
    )}

    {/* B. Tarjeta de Solución (Solo si hay resolución data) */}
    {metricas.resolution && (
      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-3 text-xs">
        
        {/* Encabezado: Tipo de Solución */}
        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Solución: {metricas.resolution.solutionName}</span>
        </div>

        {/* Nota Pública de Resolución */}
        {metricas.resolution.resolutionNote && (
          <div className="ml-6 mb-2 text-slate-600 dark:text-slate-300 leading-relaxed">
            {metricas.resolution.resolutionNote}
          </div>
        )}

        {/* Nota Interna (Privada) - Estilo diferente para resaltar que es interna */}
        {metricas.resolution.internalNote && (
          <div className="mt-3 ml-6 p-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded text-yellow-800 dark:text-yellow-200/80 flex gap-2 items-start">
            <Lock className="w-3 h-3 mt-0.5 shrink-0 opacity-70" />
            <div className="flex-1">
              <span className="block font-bold text-[9px] uppercase tracking-wide opacity-70 mb-0.5">Nota Interna</span>
              <span className="block italic">{metricas.resolution.internalNote}</span>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
)}

      
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="group flex gap-2"
          >
            {/* Avatar Simulado (Inicial) */}
            <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-200 uppercase">
              {comment.user?.name ? comment.user.name.charAt(0) : "?"}
            </div>

            {/* Burbuja de texto */}
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {comment.user?.name || "Usuario Eliminado"}
                </span>
                <span className="text-[9px] text-gray-400 ml-2">
                  {formattFechaWithMinutes(new Date(comment.date).toISOString())}
                </span>
              </div>
              
              <div className="mt-0.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg rounded-tl-none shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-gray-300 space-y-2">
           {/* Icono opcional o texto simple */}
          <p className="text-xs italic">Sin comentarios.</p>
        </div>
      )}



    </div>
  );
};