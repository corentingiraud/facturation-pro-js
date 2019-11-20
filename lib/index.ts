import ClientOAuth2 from 'client-oauth2';
import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Customer } from './models/customer';
import { Invoice } from './models/invoice';
import { Account } from './models/account';
import { Credit } from './models/credit';

const ACCESS_TOKEN_URI = 'https://www.facturation.pro/oauth/token';
const AUTHORIZATION_URI = 'https://www.facturation.pro/oauth/authorize';
const API_BASE_URL = 'https://www.facturation.pro';

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

  public async getCustomersByFirmId(firmId: number, options: { api_id: number }, accessToken: string) {
    return axios.get<Customer[]>(
      `${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}&api_id=${options.api_id}`)
      .then((res) => this.responseHandler<Customer[]>(res));
  }

  public async getFirms(accessToken: string) {
    const account = await axios.get(`${API_BASE_URL}/account.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Account>(res));
    return account.firms;
  }

  public async createCustomer(firmId: number, customer: Customer, accessToken: string) {
    return axios.post<Customer>(`${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}`, customer)
    .then((res) => this.responseHandler<Customer>(res));
  }

  public async getInvoicesByFirmId(firmId: number, accessToken: string) {
    return axios.get(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Invoice[]>(res));
  }

  public async createInvoice(firmId: number, invoice: Invoice, accessToken: string) {
    return axios.post(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`, invoice)
      .then((res) => this.responseHandler<Invoice>(res));
  }

  public async createCredit(firmId: number, invoiceId: number, accessToken: string) {
    return axios.post(`${API_BASE_URL}/firms/${firmId}/invoices/${invoiceId}/refund.json?access_token=${accessToken}`)
      .then((res) => this.responseHandler<Credit>(res));
  }

  public async checkFacturationProRateLimit(requestNumber: number) {
    const reqConfig: AxiosRequestConfig = {
      auth: {
        username: 'fake@fake.com',
        password: 'fake1234',
      },
    };
    try {
      const res = await axios.get('https://www.facturation.pro/firms/1/invoices.json', reqConfig);
    } catch (e) {
      if (e.isAxiosError && e.response && e.response.headers) {
        const requestRemaining = parseInt(e.response.headers['x-ratelimit-remaining'], 10);
        return requestRemaining > requestNumber;
      }
    }
    return false;
  }

  private responseHandler<T>(axiosResponse: AxiosResponse): T {
    return axiosResponse.data;
  }
}

function create(options: FacturationProOptions) {
  return new FacturationPro(options);
}

export default create;
