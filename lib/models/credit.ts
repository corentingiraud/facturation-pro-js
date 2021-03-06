export interface Credit {
  api_custom?: string;
  api_id?: number;
  category_id?: any;
  currency?: string;
  customer_id?: number;
  external_ref?: any;
  discount?: string;
  draft?: boolean;
  id?: number;
  information?: any;
  invoice_ref?: string;
  invoiced_on?: string;
  language?: string;
  paid_on?: string;
  pay_before?: string;
  payment_mode?: number;
  payment_ref?: any;
  penalty?: string;
  precompte?: any;
  quote_id?: any;
  rebate_percentage?: string;
  service_personne?: boolean;
  tax_percent?: any;
  tax_title?: any;
  term_on?: string;
  title?: string;
  total?: string;
  paid_in_euros?: string;
  vat_exemption?: any;
}
