import type { CryptoCoin } from '../../domain/models/crypto-coin';
import type { CoinCapService } from '../../services/coin-cap-service';

export class GetCoinById {
    constructor(private readonly coinCapService: CoinCapService) { }

    getCoin(params: { id: string }): Promise<CryptoCoin> {
        return this.coinCapService.getById(params.id);
    }
}