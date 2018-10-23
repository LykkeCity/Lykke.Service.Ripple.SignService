import { JsonController, Post } from "routing-controllers";
import { ADDRESS_SEPARATOR, Settings, DUMMY_PRIVATE_KEY } from "../common";
import { randomBytes } from "crypto"

@JsonController("/wallets")
export class WalletsController {

    constructor(private settings: Settings) {
    }

    @Post()
    createWallet() {
        return {
            publicAddress: `${this.settings.RippleSignService.HotWalletAddress}${ADDRESS_SEPARATOR}${this.settings.RippleSignService.Tag || randomBytes(4).readUInt32BE(0, true)}`,
            privateKey: DUMMY_PRIVATE_KEY
        };
    }
}