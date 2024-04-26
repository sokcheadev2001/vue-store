import axios from 'axios'
import { IService, EHttpMethod } from '@/domains/http-services'
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

class BaseService {
  private http: AxiosInstance
  private baseURL = import.meta.env.VITE_BASE_URL

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders()
    })
  }

  // Get authorization token for requests
  private get getAuthorization() {
    const accessToken = localStorage.getItem('AccessToken') || ''
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  }

  // Initialize service configuration
  public service() {
    this.injectInterceptors()

    return this
  }

  // Set up request headers
  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization }
      : { 'Content-Type': 'application/json', ...this.getAuthorization }
  }

  // Handle HTTP requests
  private async request<T>(
    method: EHttpMethod,
    url: string,
    options: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options
      })

      return response.data
    } catch (error) {
      return this.normalizeError(error)
    }
  }

  // Perform GET request
  public async get<T>(url: string, params?: IService.IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params,
      headers: this.setupHeaders(hasAttachment)
    })
  }

  // Perform POST request
  public async post<T, P>(
    url: string,
    payload: P,
    params?: IService.IParams,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment)
    })
  }

  // Perform UPDATE request
  public async update<T, P>(
    url: string,
    payload: P,
    params?: IService.IParams,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment)
    })
  }

  // Perform DELETE request
  public async remove<T>(
    url: string,
    params?: IService.IParams,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment)
    })
  }

  // Inject interceptors for request and response
  private injectInterceptors() {
    this.http.interceptors.request.use((request) => {
      // * Perform an action
      return request
    })

    // Set up response interceptor
    this.http.interceptors.response.use(
      (response) => {
        return response
      },

      (error) => {
        // global error alert
        return Promise.reject(error)
      }
    )
  }

  private normalizeError(error: any) {
    return Promise.reject(error)
  }
}

export { BaseService }
