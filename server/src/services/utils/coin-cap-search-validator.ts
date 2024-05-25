import { CoinCapSearch } from '../helpers/coin-cap-search';
import { CryptoCoin } from '../../domain/models/crypto-coin';
import { Validator } from '../../domain/utils/validator';
import Joi, { type Schema } from 'joi';
import { CRYPTO_ICON_URL } from '../../domain/utils/constants';

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
                icon: `${CRYPTO_ICON_URL}/${coin.symbol.toLowerCase()}.png`,
                symbol: coin.symbol
            };
        });
    }
}