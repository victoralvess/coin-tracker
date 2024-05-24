import { Validator } from '../../domain/utils/validator';
import { ValidationError } from '../../domain/utils/validation-error';
import type { Schema } from 'joi';
import Joi from 'joi';

export class GetCoinByIdValidator implements Validator<{ id: string }, { id: string }> {
    private schema: Schema<{ id: string }>;

    constructor() {
        this.schema = Joi.object({
            id: Joi.string().regex(/[a-z]+/).required()
        });
    }

    validate(input: { id: string }): { id: string } {
        const value = this.schema.validate(input, { allowUnknown: true });

        if (value.error !== undefined) {
            throw new ValidationError(value.error.message, value.error.details.map((d) => d.message));
        }

        return { id: value.value.id };
    }
}