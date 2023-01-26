import * as http from 'http'
import * as https from 'https'
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosResponse<T> extends Promise<T> {}
}

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string, keepAlive?: boolean) {
    
    if (keepAlive) {
      const httpAgent = new http.Agent({ keepAlive: true })
      const httpsAgent = new https.Agent({ keepAlive: true })
      this.instance = axios.create({
        baseURL, httpAgent, httpsAgent
      })
    } else this.instance = axios.create({
      baseURL,
    })

    this._initializeResponseInterceptor()
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    )
  };

  static async post<T>(url: string, headers: Record<string, string>, body: Record<string, unknown>): Promise<T> {
    return (await axios({ url, data: body, method: 'post', headers }))?.data
  }

  static async get<T>(url: string, headers: Record<string, string>): Promise<T> {
    return (await axios({ url, method: 'get', headers }))?.data
  }

  private _handleResponse = ({ data, }: AxiosResponse) => {
    return data    
  };

  protected _handleError = async (axiosError: AxiosError): Promise<any> => {
    const { config, response } = axiosError
    if (response.status === 429) {
      console.info(`429 TOO MANY REQUESTS: Retrying ${config.method} ${config.url}`) 
      const waitTime = Number(response.headers['retry-after'] ?? response.headers['Retry-After'])*1000
      return new Promise(resolve=>setTimeout(resolve, waitTime))
      .then(function () {
        return (axios(config))
      })
    } else
    if (response.status === 401) {
      console.info(`401 UNAUTHORIZED: unvalid token`)
    } else
    if (response.status === 403) {
      console.info(`403 FORBIDDEN: User has no permission to take this action`)
    } else
    if (response.status === 404) {
      console.info(`404 NOT FOUND£`)
    } else
    if (response.status === 500) {
      console.info(`500 INTERNAL SERVER ERROR: `)
    }
    return Promise.reject(axiosError);
  }
}
