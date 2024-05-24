import { HttpResponse } from './helpers/http-response';

export interface HttpService {
    get<T>(url: string, params: Record<string, unknown>): Promise<HttpResponse<T>>;
}