export class UnknownServerError extends Error {
    readonly status: number; 

    constructor(readonly error: Error) {
        super('Upstream server has not responded to our request');
        this.status = 500;
        this.name = UnknownServerError.name;
    }
}