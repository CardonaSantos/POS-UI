import { EstadoCredito } from "@/Crm/features/credito/credito-interfaces";

export class GetCreditosQueryDto {
  page?: number = 1;

  limit?: number = 10;

  search?: string;

  estado?: EstadoCredito;
}
