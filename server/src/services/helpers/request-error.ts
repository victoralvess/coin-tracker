import { AxiosResponse } from 'axios';

export class RequestError extends Error {
    readonly status: number; 
    readonly data: unknown | undefined;

    constructor(response: AxiosResponse) {
        super('Upstream server has responded with an error');
        this.status = response.status;
        this.data = response.data;
        this.name = RequestError.name;
    }
}