export interface Validator<I, O> {
    validate(input: I): O | never;
}