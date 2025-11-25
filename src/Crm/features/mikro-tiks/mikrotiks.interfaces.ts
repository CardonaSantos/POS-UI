export interface MikrotikRoutersResponse {
  id: number;
  passwordEnc: string;
  nombre: string;
  host: string;
  sshPort: number;
  usuario: string;
  descripcion?: string;
  activo: boolean;
  empresaId: number;
  oltId?: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MikroTikCustomerResponse {
  id: number;
  nombre: string;
}
