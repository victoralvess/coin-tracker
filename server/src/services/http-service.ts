import { isAxiosError, type AxiosInstance, type AxiosError } from 'axios';
import { HttpResponse } from './helpers/http-response';
import { RequestError } from './helpers/request-error';
import { UnknownServerError } from './helpers/unknown-server-error';

export class HttpService {
    constructor(private axios: AxiosInstance) { }

    async get<T>(url: string, params: Record<string, unknown>): Promise<HttpResponse<T>> {
        try {
            const { status, data } = await this.axios.get(url, { params });
            return { status, data };
        } catch (error) {
            if (isAxiosError(error)) {
                this.throwAxiosError(error);
            } else {
                throw new UnknownServerError(error as Error);
            }
        }
    }

    private throwAxiosError(error: AxiosError): never {
        if (error.response) {
            throw new RequestError(error.response);
        } else {
            throw new UnknownServerError(error);
        }
    }
}