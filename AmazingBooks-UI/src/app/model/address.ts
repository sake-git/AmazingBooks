export interface Address {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  isDefault?: boolean;
  fkuserId?: number;
}
