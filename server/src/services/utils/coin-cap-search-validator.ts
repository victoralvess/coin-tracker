import { CoinCapSearch } from '../helpers/coin-cap-search';
import { CryptoCoin } from '../../domain/models/crypto-coin';
import { Validator } from '../../domain/utils/validator';
import Joi, { type Schema } from 'joi';

export class CoinCapSearchValidator implements Validator<CoinCapSearch, CryptoCoin[]> {
    private schema: Schema<CoinCapSearch>;

    constructor() {
        this.schema = Joi.object({
            data: Joi.array().items(
                Joi.object({
                    id: Joi.string(),
                    priceUsd: Joi.number().unsafe().precision(2).cast('string'),
                    symbol: Joi.string()
                })
            )
        });
    }

    validate(input: CoinCapSearch): CryptoCoin[] {
        const value = this.schema.validate(input, { allowUnknown: true });

        if (value.error !== undefined) {
            throw Error('Unexpected server response');
        }

        return value.value.data.map((coin) => {
            return {
                id: coin.id,
                price: Number(coin.priceUsd),
                icon: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${coin.symbol.toLowerCase()}.png`, // TBD
                symbol: coin.symbol
            };
        })
    }
}