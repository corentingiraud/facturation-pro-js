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
  public requestRemaining: number = 600;
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
    this.requestRemaining -= 1;
    return this.facturationOauth2.code.getToken(uri);
  }

  public async getNewAccessToken(refreshToken: string) {
    const token = this.facturationOauth2.createToken('', refreshToken, 'Bearer', {});
    this.requestRemaining -= 1;
    return token.refresh();
  }

  public async getCustomersByFirmId(firmId: number, options: { api_id: number }, accessToken: string) {
    return axios.get<Customer[]>(
            `${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}&api_id=${options.api_id}`)
    .then((res) => this.responseHandler<Customer[]>(res))
    .catch(this.errorHandler);
  }

  public async getFirms(accessToken: string) {
    const account = await axios.get(`${API_BASE_URL}/account.json?access_token=${accessToken}`)
    .then((res) => this.responseHandler<Account>(res))
    .catch(this.errorHandler);
    return account ? account.firms : [];
  }

  public async createCustomer(firmId: number, customer: Customer, accessToken: string) {
    return axios.post<Customer>(`${API_BASE_URL}/firms/${firmId}/customers.json?access_token=${accessToken}`, customer)
    .then((res) => this.responseHandler<Customer>(res))
    .catch(this.errorHandler);
  }

  public async getInvoicesByFirmId(firmId: number, accessToken: string) {
    return axios.get(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`)
    .then((res) => this.responseHandler<Invoice[]>(res))
    .catch(this.errorHandler);
  }

  public async getInvoiceById(firmId: number, invoiceId: number, accessToken: string) {
    return axios.get(`${API_BASE_URL}/firms/${firmId}/invoices/${invoiceId}.json?access_token=${accessToken}`)
    .then((res) => this.responseHandler<Invoice>(res))
    .catch(this.errorHandler);
  }

  public async createInvoice(firmId: number, invoice: Invoice, accessToken: string) {
    return axios.post(`${API_BASE_URL}/firms/${firmId}/invoices.json?access_token=${accessToken}`, invoice)
    .then((res) => this.responseHandler<Invoice>(res))
    .catch(this.errorHandler);
  }

  public async createCredit(firmId: number, invoiceId: number, accessToken: string) {
    return axios.post(`${API_BASE_URL}/firms/${firmId}/invoices/${invoiceId}/refund.json?access_token=${accessToken}`)
    .then((res) => this.responseHandler<Credit>(res))
    .catch(this.errorHandler);
  }

  public async checkFacturationProRateLimit(requestNumber: number) {
    return this.requestRemaining >= requestNumber;
  }

  public async download(firmId: number, invoiceId: number, accessToken: string) {
    this.requestRemaining -= 1;
    return axios.get(
            `${API_BASE_URL}/firms/${firmId}/invoices/${invoiceId}.pdf?original=1&access_token=${accessToken}`,
            {
              responseType: 'arraybuffer',
            },
    ).catch(this.errorHandler);
  }

  private responseHandler<T>(axiosResponse: AxiosResponse): T {
    if (axiosResponse.headers && axiosResponse.headers['x-ratelimit-remaining']) {
      this.requestRemaining = parseInt(axiosResponse.headers['x-ratelimit-remaining'], 10);
    }
    return axiosResponse.data;
  }

  private errorHandler(e: any) {
    if (e.isAxiosError && e.response && e.response.headers) {
      this.requestRemaining = parseInt(e.response.headers['x-ratelimit-remaining'], 10);
    }
    throw e;
  }
}

function create(options: FacturationProOptions) {
  return new FacturationPro(options);
}

export default create;
