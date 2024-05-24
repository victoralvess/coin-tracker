export class ValidationError extends Error {
    public readonly status = 400;

    constructor(message: string, public readonly errors: string[]) {
        super(message);
        this.name = ValidationError.name;
    }
}