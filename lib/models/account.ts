import { Firm } from './firm';

export interface Account {
  id?: number;
  email?: string;
  firms?: Firm[];
}
