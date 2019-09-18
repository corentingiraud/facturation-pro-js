import ClientOAuth2 from 'client-oauth2';
import axios, { AxiosResponse } from 'axios';
import { Customer } from './models/customer';
import { Invoice } from './models/invoice';
import { Firm } from './models/firm';
import { Account } from './models/account';

const ACCESS_TOKEN_URI = 'https://www.facturation.pro/oauth/token';
const AUTHORIZATION_URI = 'https://www.facturation.pro/oauth/authorize';
const API_BASE_URL = 'https://www.facturation.pro/';

interface FacturationProOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: 'read' | 'read_write';
}

class FacturationPro {
  private facturationOauth2: ClientOAuth2;

  constructor(options: FacturationProOptions) {
    this.facturationOauth2 = new ClientOAuth2({
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      accessTokenUri: ACCESS_TOKEN_URI,
      authorizationUri: AUTHORIZATION_URI,
      redirectUri: options.redirectUri,
      scopes: [options.scope],
    });
  }

  public async getTokenFromUri(uri: string) {
    return this.facturationOauth2.code.getToken(uri);
  }

  public async getNewAccessToken(refreshToken: string) {
    const token = this.facturationOauth2.createToken('', refreshToken, 'Bearer', {});
    return token.refresh();
  }

  public async getCustomersByFirmId(firmId: number, accessToken: string) {
    return axios.get<Customer[]>(`${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Customer[]>(res));
  }

  public async getFirms(accessToken: string) {
    const account = await axios.get(`${API_BASE_URL}/account.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Account>(res));
    return account.firms;
  }

  public async createCustomer(firmId: number, customer: Customer, accessToken: string) {
    return axios.post<Customer>(`${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}`)
    .then((res) => this.responseHandler<Customer>(res));
  }

  public async getInvoicesByFirmId(firmId: number, accessToken: string) {
    return axios.get(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Invoice[]>(res));
  }

  public async createInvoice(firmId: number, invoice: Invoice, accessToken: string) {
    return axios.post(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Invoice>(res));
  }

  private responseHandler<T>(axiosResponse: AxiosResponse): T {
    return axiosResponse.data;
  }
}

function create(options: FacturationProOptions) {
  return new FacturationPro(options);
}

export default create;
