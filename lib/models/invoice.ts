import { Item } from './item';

export interface Invoice {
  api_custom?: string;
  api_id?: string;
  category_id?: string;
  currency?: string;
  customer_id?: number;
  created_at?: Date;
  external_ref?: string;
  discount?: string;
  draft?: boolean;
  id?: number;
  information?: string;
  invoice_ref?: string;
  invoiced_on?: string;
  language?: string;
  paid_on?: string;
  pay_before?: string;
  payment_mode?: number;
  payment_ref?: string;
  penalty?: string;
  precompte?: string;
  quote_id?: string;
  rebate_percentage?: string;
  service_personne?: boolean;
  tax_percent?: string;
  tax_title?: string;
  term_on?: string;
  title?: string;
  total?: string;
  paid_in_euros?: string;
  updated_at?: Date;
  vat_exemption?: string;
  items?: Item[];
}
