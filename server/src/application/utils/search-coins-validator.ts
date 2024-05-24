import { Validator } from '../../domain/utils/validator';
import { ValidationError } from '../../domain/utils/validation-error';
import type { Schema } from 'joi';
import Joi from 'joi';

export class SearchCoinsValidator implements Validator<{ q: string }, { q: string }> {
    private schema: Schema<{ q: string }>;

    constructor() {
        this.schema = Joi.object({
            q: Joi.string().trim().min(0).optional().default('')
        });
    }

    validate(input: { q: string }): { q: string } {
        const value = this.schema.validate(input, { allowUnknown: true });

        if (value.error !== undefined) {
            throw new ValidationError(value.error.message, value.error.details.map((d) => d.message));
        }

        return { q: value.value.q };
    }
}