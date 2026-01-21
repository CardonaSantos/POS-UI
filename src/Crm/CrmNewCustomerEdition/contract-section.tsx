"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { ContractSectionProps } from "./customer-form-types";

export function ContractSection({
  formDataContrato,
  onChangeContrato,
  setFormDataContrato,
}: ContractSectionProps) {
  return (
    <section aria-labelledby="section-contrato" className="space-y-4">
      <h3
        id="section-contrato"
        className="font-medium flex items-center gap-2 text-sm"
      >
        <FileText className="h-4 w-4 text-primary dark:text-white" />
        Detalles del contrato
      </h3>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-lg shadow-sm"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-medium text-sm">
            Información de contrato
          </AccordionTrigger>
          <AccordionContent className="px-1 pb-3">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-4 pb-2">
                <CardTitle className="text-base">Datos del contrato</CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="space-y-1 w-full">
                    <Label htmlFor="idcontrato" className="font-medium">
                      ID de Contrato
                    </Label>
                    <Input
                      type="text"
                      id="idcontrato"
                      value={formDataContrato.idContrato}
                      onChange={onChangeContrato}
                      name="idContrato"
                      placeholder="ejem: CONTRATO-910"
                      aria-label="ID de contrato"
                      className="w-full h-9"
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <Label htmlFor="archivoContrato" className="font-medium">
                      Archivo contrato
                    </Label>
                    <Input
                      type="text"
                      id="archivoContrato"
                      value={formDataContrato.archivoContrato}
                      onChange={onChangeContrato}
                      name="archivoContrato"
                      placeholder="Próximamente..."
                      aria-label="Archivo de contrato"
                      className="w-full h-9"
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <Label htmlFor="fechaFirma" className="font-medium">
                      Fecha Firma
                    </Label>
                    <DatePicker
                      className="w-full p-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      selected={formDataContrato.fechaFirma}
                      onChange={(date) => {
                        setFormDataContrato((prevData) => ({
                          ...prevData,
                          fechaFirma: date,
                        }));
                      }}
                      aria-label="Fecha de firma"
                      id="fechaFirma"
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <Label
                      htmlFor="observaciones-contrato"
                      className="font-medium"
                    >
                      Observaciones
                    </Label>
                    <Textarea
                      id="observaciones-contrato"
                      value={formDataContrato.observaciones}
                      onChange={onChangeContrato}
                      name="observaciones"
                      placeholder="Detalles de mi contrato"
                      aria-label="Observaciones del contrato"
                      className="w-full min-h-[80px] resize-y text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
