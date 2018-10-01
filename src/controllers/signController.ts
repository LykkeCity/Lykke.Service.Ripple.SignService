import { JsonController, Body, Post, BadRequestError } from "routing-controllers";
import { IsArray, IsString, IsNotEmpty, IsBase64 } from "class-validator";
import { toBase64, Settings, validateSecret, validateSecretFormat, DUMMY_TX, fromBase64 } from "../common";
import { RippleAPI } from "ripple-lib"


class SignTransactionRequest {

    @IsArray()
    @IsNotEmpty()
    privateKeys: string[];

    @IsNotEmpty()
    @IsString()
    transactionContext: string;
}

@JsonController("/sign")
export class SignController {

    private api = new RippleAPI();

    constructor(private settings: Settings) {
    }

    @Post()
    async signTransaction(@Body({ required: true }) request: SignTransactionRequest) {

        const transaction = fromBase64<string>(request.transactionContext);

        // for real transactions real privite keys are required;
        // for simulated transactions (i.e. DW -> HW) we don't have any real action, 
        // but we protect such activities with HW private key
        if (!request.privateKeys.length ||
            !request.privateKeys.every(k => validateSecretFormat(k)) ||
            (transaction == DUMMY_TX && request.privateKeys.some(k => !validateSecret(k, this.settings.RippleSignService.HotWalletAddress)))) {
            throw new BadRequestError("Invalid private key(s)");
        }

        // for real transaction we get tx ID as a reasult of tx signing
        // for simulated transactions we use timestamp as tx ID
        const data = transaction != DUMMY_TX
            ? this.api.sign(transaction, request.privateKeys[0])
            : { id: Date.now().toFixed() };

        return {
            signedTransaction: toBase64(data)
        };
    }
}