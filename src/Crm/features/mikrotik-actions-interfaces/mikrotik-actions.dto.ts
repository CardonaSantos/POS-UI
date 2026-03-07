export interface suspendCustomerDto {
  clienteId: number;
  userId: number;
  password: string;
  isPasswordRequired?: boolean;
}
