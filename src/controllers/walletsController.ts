import { JsonController, Post } from "routing-controllers";
import { ADDRESS_SEPARATOR, Settings, DUMMY_PRIVATE_KEY } from "../common";
import { randomBytes } from "crypto"

@JsonController("/wallets")
export class WalletsController {

    constructor(private settings: Settings) {
    }

    static tagCounter = 0;

    @Post()
    createWallet() {

        let tag = randomBytes(4).readUInt32BE(0, true);
        if (!!this.settings.RippleSignService.Tag && ++WalletsController.tagCounter % 3 == 0) {
            tag = this.settings.RippleSignService.Tag;
        }

        return {
            publicAddress: `${this.settings.RippleSignService.HotWalletAddress}${ADDRESS_SEPARATOR}${tag}`,
            privateKey: DUMMY_PRIVATE_KEY
        };
    }
}