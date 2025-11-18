import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  ChevronUp,
  ChevronDown,
  Send,
  Check,
  X,
  Clock,
  RefreshCw,
  Eye,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Download,
  Copy,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMediaMessage, getMessagingTwilioHistory } from "./API/api";
import { MediaAttachment, TwilioMessage } from "./Utils/utilsMensajeria";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formateDateWithMinutes } from "../Utils/FormateDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function PlantillasMensajesView() {
  const [mediaData, setMediaData] = useState<MediaAttachment[]>([]);
  const [messages, setMessages] = useState<TwilioMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messagesPerPage, setMessagesPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState<TwilioMessage | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof TwilioMessage>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  console.log("Los token de nex es: ", nextPageToken);
  const pageTokens = useRef<(string | undefined)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Función que pide una página cualquiera
  const fetchPage = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1) El token para esta página es el que guardamos en la posición anterior:
      const token = pageTokens.current[pageNum - 1];

      // 2) Llamamos al API pasando limit + token
      const { messages, nextPageToken } = await getMessagingTwilioHistory(
        messagesPerPage,
        token
      );

      // 3) Guardamos:
      setMessages(messages);
      setCurrentPage(pageNum);
      setNextPageToken(nextPageToken);
      // 4) Guardamos el token que sirva para pedir la SIGUIENTE página
      pageTokens.current[pageNum] = nextPageToken ?? undefined;
    } catch (e) {
      setError("Error cargando mensajes");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Al montar, inicializamos y pedimos la página 1
  useEffect(() => {
    pageTokens.current = [undefined]; // pageTokens[0] = undefined => página 1
    fetchPage(1);
  }, [messagesPerPage]);

  // Botones
  const goNext = () => {
    // Si hay token guardado para la siguiente página
    if (pageTokens.current[currentPage]) {
      fetchPage(currentPage + 1);
    }
  };
  const goPrev = () => {
    // Sólo si no estamos ya en la página 1
    if (currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  };
  const getMetaData = async (SID: string) => {
    getMediaMessage(SID)
      .then((data) => setMediaData(data))
      .catch((error) => {
        console.log("Error al conseguir media data: ", error);
      })
      .finally(() => {
        console.log("Final de funcion");
      });
  };

  // Filtrar mensajes según el término de búsqueda
  const filteredMessages = messages.filter((message) => {
    const searchableFields = [
      message.body,
      message.from,
      message.to,
      message.status,
      message.sid,
    ];
    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Ordenar mensajes
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (
      a[sortField] != null &&
      b[sortField] != null &&
      a[sortField] < b[sortField]
    )
      return sortDirection === "asc" ? -1 : 1;
    if (
      a[sortField] != null &&
      b[sortField] != null &&
      a[sortField] > b[sortField]
    )
      return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const displayedMessages = sortedMessages; // <- Mensajes actuales de la API

  // Manejar ordenamiento
  const handleSort = (field: keyof TwilioMessage) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Renderizar icono de dirección de ordenamiento
  const renderSortIcon = (field: keyof TwilioMessage) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return formateDateWithMinutes(dateString);
  };

  // Obtener icono según el estado del mensaje
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <Check className="h-4 w-4 text-green-500" />;
      case "read":
        return <Check className="h-4 w-4 text-green-600" />;
      case "undelivered":
        return <X className="h-4 w-4 text-red-500" />;
      case "failed":
        return <X className="h-4 w-4 text-red-600" />;
      case "received":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Obtener color de badge según el estado del mensaje
  const getStatusBadgeVariant = (
    status: string
  ): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case "sent":
        return "default";
      case "delivered":
      case "read":
        return "secondary";
      case "undelivered":
      case "failed":
        return "destructive";
      case "received":
        return "outline";
      default:
        return "outline";
    }
  };

  // Formatear número de teléfono
  const formatPhoneNumber = (phoneNumber: string) => {
    // Eliminar el prefijo "whatsapp:" si existe
    return phoneNumber.replace("whatsapp:", "");
  };

  // Truncar texto largo
  const truncateText = (text: string, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <PageTransitionCrm
      titleHeader="Mensajes automáticos Twilio"
      subtitle={``}
      variant="fade-pure"
    >
      <div className="space-y-4">
        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar mensajes..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar mensajes"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={messagesPerPage.toString()}
              onValueChange={(value) => {
                setMessagesPerPage(Number(value));
              }}
            >
              <SelectTrigger
                className="w-[120px]"
                aria-label="Mensajes por página"
              >
                <SelectValue placeholder="10 por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 por página</SelectItem>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="20">20 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                fetchPage(messagesPerPage);
              }}
              aria-label="Actualizar"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabla de mensajes */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[50px] text-center"
                      aria-label="Estado del mensaje"
                    >
                      Estado
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("direction")}
                    >
                      Dirección {renderSortIcon("direction")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("body")}
                    >
                      Mensaje {renderSortIcon("body")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("from")}
                    >
                      De {renderSortIcon("from")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("to")}
                    >
                      Para {renderSortIcon("to")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("dateCreated")}
                    >
                      Fecha {renderSortIcon("dateCreated")}
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedMessages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No se encontraron mensajes
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedMessages.map((message) => (
                      <TableRow key={message.sid}>
                        <TableCell className="text-center">
                          <div
                            className="flex justify-center"
                            title={message.status}
                            aria-label={`Estado: ${message.status}`}
                          >
                            {getStatusIcon(message.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              message.direction === "inbound"
                                ? "outline"
                                : "default"
                            }
                          >
                            {message.direction === "inbound"
                              ? "Entrante"
                              : "Saliente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {message.body
                            ? truncateText(message.body)
                            : "Mensaje no disponible"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatPhoneNumber(message.from)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatPhoneNumber(message.to)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(message.dateCreated)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMessage(message)}
                            aria-label="Ver detalles"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Paginación */}
        {!isLoading && !error && sortedMessages.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            {/* <div className="text-sm text-muted-foreground">
              Mostrando {indexOfFirstMessage + 1} a{" "}
              {Math.min(indexOfLastMessage, sortedMessages.length)} de{" "}
              {sortedMessages.length} mensajes
            </div> */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goPrev()}
                aria-label="Página anterior"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goNext()}
                aria-label="Página siguiente"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        <Dialog
          open={!!selectedMessage}
          onOpenChange={(open) => {
            if (!open) setSelectedMessage(null);
          }}
        >
          <DialogContent className="max-w-4xl overflow-y-auto max-h-[44rem]">
            <DialogHeader>
              <DialogTitle>Detalles del mensaje</DialogTitle>
              <DialogDescription>ID: {selectedMessage?.sid}</DialogDescription>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Información básica
                    </h3>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <div className="font-medium">Estado:</div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedMessage.status)}
                        <Badge
                          variant={getStatusBadgeVariant(
                            selectedMessage.status
                          )}
                        >
                          {selectedMessage.status}
                        </Badge>
                        {selectedMessage.errorCode && (
                          <span className="text-red-500">
                            Error: {selectedMessage.errorCode}
                          </span>
                        )}
                      </div>

                      <div className="font-medium">Dirección:</div>
                      <div>
                        <Badge
                          variant={
                            selectedMessage.direction === "inbound"
                              ? "outline"
                              : "default"
                          }
                        >
                          {selectedMessage.direction === "inbound"
                            ? "Entrante"
                            : "Saliente"}
                        </Badge>
                      </div>

                      <div className="font-medium">De:</div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto p-2 justify-start font-normal text-left"
                            >
                              <span className="text-blue-600 hover:text-blue-800">
                                {formatPhoneNumber(selectedMessage.from)}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Abrir chat en WhatsApp */}
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://wa.me/${formatPhoneNumber(
                                  selectedMessage.from
                                ).replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Phone className="h-4 w-4 text-green-600" />
                                Abrir chat en WhatsApp
                              </a>
                            </DropdownMenuItem>

                            {/* Copiar número */}
                            <DropdownMenuItem
                              onSelect={() =>
                                navigator.clipboard.writeText(
                                  formatPhoneNumber(
                                    selectedMessage.from
                                  ).replace(/\D/g, "")
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              <Copy className="h-4 w-4" />
                              Copiar número
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="font-medium">Para:</div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto p-2 justify-start font-normal text-left"
                            >
                              <span className="text-blue-600 hover:text-blue-800">
                                {formatPhoneNumber(selectedMessage.to)}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Abrir chat en WhatsApp */}
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://wa.me/${formatPhoneNumber(
                                  selectedMessage.to
                                ).replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Phone className="h-4 w-4 text-green-600" />
                                Abrir chat en WhatsApp
                              </a>
                            </DropdownMenuItem>

                            {/* Copiar número */}
                            <DropdownMenuItem
                              onSelect={() =>
                                navigator.clipboard.writeText(
                                  formatPhoneNumber(selectedMessage.to).replace(
                                    /\D/g,
                                    ""
                                  )
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              <Copy className="h-4 w-4" />
                              Copiar número
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="font-medium">Creado:</div>
                      <div>{formatDate(selectedMessage.dateCreated)}</div>

                      <div className="font-medium">Enviado:</div>
                      <div>
                        {selectedMessage.dateSent
                          ? formatDate(selectedMessage.dateSent)
                          : "N/A"}
                      </div>

                      <div className="font-medium">Actualizado:</div>
                      <div>{formatDate(selectedMessage.dateUpdated)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Información adicional
                    </h3>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <div className="font-medium">SID:</div>
                      <div className="truncate">{selectedMessage.sid}</div>

                      <div className="font-medium">Account SID:</div>
                      <div className="truncate">
                        {selectedMessage.accountSid}
                      </div>

                      <div className="font-medium">Segmentos:</div>
                      <div>{selectedMessage.numSegments}</div>

                      <div className="font-medium">Media:</div>
                      <div>
                        {Number.parseInt(selectedMessage.numMedia) > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5"
                            onClick={() => {
                              getMetaData(selectedMessage.sid);
                            }}
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Solicitar recursos</span>
                            <Badge
                              variant="secondary"
                              className="ml-1 h-5 px-1.5"
                            >
                              {selectedMessage.numMedia}
                            </Badge>
                          </Button>
                        ) : (
                          "0"
                        )}
                      </div>

                      {mediaData.length > 0 ? (
                        mediaData.map((m) => {
                          const { contentType, sid, url } = m;
                          const proxyUrl = `${VITE_CRM_API_URL}/twilio-api/messages/${selectedMessage.sid}/media/${sid}`;
                          console.log("La proxy url es: ", proxyUrl);

                          if (contentType.startsWith("image")) {
                            return <img src={proxyUrl} alt="" />;
                          }

                          if (contentType.startsWith("/video")) {
                            return (
                              <video
                                key={sid}
                                controls
                                style={{ maxWidth: 300 }}
                              >
                                <source src={url} type={contentType} />
                                Tu navegador no soporta reproducir este video.
                              </video>
                            );
                          }

                          if (contentType.startsWith("audio/")) {
                            return <audio key={sid} controls src={url} />;
                          }

                          if (contentType === "application/pdf") {
                            return (
                              <a
                                key={sid}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Ver PDF
                              </a>
                            );
                          }
                        })
                      ) : (
                        <p>Nada</p>
                      )}

                      <div className="font-medium">Precio:</div>
                      <div>
                        {selectedMessage.price
                          ? `${selectedMessage.price} ${selectedMessage.priceUnit}`
                          : "N/A"}
                      </div>

                      <div className="font-medium">API Version:</div>
                      <div>{selectedMessage.apiVersion}</div>

                      <div className="font-medium">URI:</div>
                      <div className="truncate">
                        <a
                          href={`https://api.twilio.com${selectedMessage.uri}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {truncateText(selectedMessage.uri, 30)}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Contenido del mensaje
                  </h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
                    {selectedMessage.body || "(Sin contenido)"}
                  </div>
                </div>

                {selectedMessage.errorMessage && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-red-500">
                      Mensaje de error
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {selectedMessage.errorMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransitionCrm>
  );
}
