import type { CryptoCoin } from '../../domain/models/crypto-coin';
import { Validator } from '../../domain/utils/validator';
import type { CoinCapService } from '../../services/coin-cap-service';

export class GetCoinById {
    constructor(
        private readonly coinCapService: CoinCapService,
        private readonly paramsValidator: Validator<{ id: string }, { id: string }>
    ) { }

    getCoin(params: { id: string }): Promise<CryptoCoin> {
        params = this.paramsValidator.validate(params);
        return this.coinCapService.getById(params.id);
    }
}