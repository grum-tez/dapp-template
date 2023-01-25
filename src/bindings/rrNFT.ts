import * as ex from "@completium/dapp-ts";
import * as att from "@completium/archetype-ts-types";
export const bids_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("mutez", []);
export const ownerHistory_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export const ownerHistoryWorkSpace_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export class bids_value implements att.ArchetypeType {
    constructor(public marketplace: att.Address, public bidderSubmitting: att.Address, public bidProportion: att.Rational) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.marketplace.to_mich(), this.bidderSubmitting.to_mich(), this.bidProportion.to_mich()]);
    }
    equals(v: bids_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): bids_value {
        return new bids_value(att.Address.from_mich((input as att.Mpair).args[0]), att.Address.from_mich((input as att.Mpair).args[1]), att.Rational.from_mich(att.pair_to_mich((input as att.Mpair as att.Mpair).args.slice(2, 4))));
    }
}
export class ownerHistory_value implements att.ArchetypeType {
    constructor(public ownerAddress: att.Address, public datePurchased: Date, public price: att.Tez, public timeHeld: att.Duration, public burdenPaid: att.Tez) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.ownerAddress.to_mich(), att.date_to_mich(this.datePurchased), this.price.to_mich(), this.timeHeld.to_mich(), this.burdenPaid.to_mich()]);
    }
    equals(v: ownerHistory_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): ownerHistory_value {
        return new ownerHistory_value(att.Address.from_mich((input as att.Mpair).args[0]), att.mich_to_date((input as att.Mpair).args[1]), att.Tez.from_mich((input as att.Mpair).args[2]), att.Duration.from_mich((input as att.Mpair).args[3]), att.Tez.from_mich((input as att.Mpair).args[4]));
    }
}
export class ownerHistoryWorkSpace_value implements att.ArchetypeType {
    constructor(public ownerAddress2: att.Address, public datePurchased2: Date, public price2: att.Tez, public timeHeld2: att.Duration, public fairBurden2: att.Tez, public burdenPaid2: att.Tez, public balanceWithContract2: att.Rational) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.ownerAddress2.to_mich(), att.date_to_mich(this.datePurchased2), this.price2.to_mich(), this.timeHeld2.to_mich(), this.fairBurden2.to_mich(), this.burdenPaid2.to_mich(), this.balanceWithContract2.to_mich()]);
    }
    equals(v: ownerHistoryWorkSpace_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): ownerHistoryWorkSpace_value {
        return new ownerHistoryWorkSpace_value(att.Address.from_mich((input as att.Mpair).args[0]), att.mich_to_date((input as att.Mpair).args[1]), att.Tez.from_mich((input as att.Mpair).args[2]), att.Duration.from_mich((input as att.Mpair).args[3]), att.Tez.from_mich((input as att.Mpair).args[4]), att.Tez.from_mich((input as att.Mpair).args[5]), att.Rational.from_mich(att.pair_to_mich((input as att.Mpair as att.Mpair).args.slice(6, 8))));
    }
}
export const bids_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%marketplace"]),
    att.prim_annot_to_mich_type("address", ["%bidderSubmitting"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("int", []),
        att.prim_annot_to_mich_type("nat", [])
    ], ["%bidProportion"])
], []);
export const ownerHistory_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%ownerAddress"]),
    att.prim_annot_to_mich_type("timestamp", ["%datePurchased"]),
    att.prim_annot_to_mich_type("mutez", ["%price"]),
    att.prim_annot_to_mich_type("int", ["%timeHeld"]),
    att.prim_annot_to_mich_type("mutez", ["%burdenPaid"])
], []);
export const ownerHistoryWorkSpace_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%ownerAddress2"]),
    att.prim_annot_to_mich_type("timestamp", ["%datePurchased2"]),
    att.prim_annot_to_mich_type("mutez", ["%price2"]),
    att.prim_annot_to_mich_type("int", ["%timeHeld2"]),
    att.prim_annot_to_mich_type("mutez", ["%fairBurden2"]),
    att.prim_annot_to_mich_type("mutez", ["%burdenPaid2"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("int", []),
        att.prim_annot_to_mich_type("nat", [])
    ], ["%balanceWithContract2"])
], []);
export type bids_container = Array<[
    att.Tez,
    bids_value
]>;
export type ownerHistory_container = Array<[
    att.Nat,
    ownerHistory_value
]>;
export type ownerHistoryWorkSpace_container = Array<[
    att.Nat,
    ownerHistoryWorkSpace_value
]>;
export const bids_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("mutez", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%marketplace"]),
    att.prim_annot_to_mich_type("address", ["%bidderSubmitting"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("int", []),
        att.prim_annot_to_mich_type("nat", [])
    ], ["%bidProportion"])
], []), []);
export const ownerHistory_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%ownerAddress"]),
    att.prim_annot_to_mich_type("timestamp", ["%datePurchased"]),
    att.prim_annot_to_mich_type("mutez", ["%price"]),
    att.prim_annot_to_mich_type("int", ["%timeHeld"]),
    att.prim_annot_to_mich_type("mutez", ["%burdenPaid"])
], []), []);
export const ownerHistoryWorkSpace_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%ownerAddress2"]),
    att.prim_annot_to_mich_type("timestamp", ["%datePurchased2"]),
    att.prim_annot_to_mich_type("mutez", ["%price2"]),
    att.prim_annot_to_mich_type("int", ["%timeHeld2"]),
    att.prim_annot_to_mich_type("mutez", ["%fairBurden2"]),
    att.prim_annot_to_mich_type("mutez", ["%burdenPaid2"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("int", []),
        att.prim_annot_to_mich_type("nat", [])
    ], ["%balanceWithContract2"])
], []), []);
const addNewOwner_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const initiate_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const updateCurrentOwnerDuration_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const makeOffer_arg_to_mich = (currentMarketplace: att.Address): att.Micheline => {
    return currentMarketplace.to_mich();
}
const sell_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const claim_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const topUp_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const bringTidemarkAuctionForward_arg_to_mich = (newDate: Date): att.Micheline => {
    return att.date_to_mich(newDate);
}
const integrateExpCurveTest_arg_to_mich = (a: att.Rational, b: att.Rational): att.Micheline => {
    return att.pair_to_mich([
        a.to_mich(),
        b.to_mich()
    ]);
}
const sliceAreaTest_arg_to_mich = (a: att.Rational, b: att.Rational): att.Micheline => {
    return att.pair_to_mich([
        a.to_mich(),
        b.to_mich()
    ]);
}
export class RrNFT {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(creator: att.Address, minter: att.Address, royaltyRate: att.Rational, minterRate: att.Rational, marketRate: att.Rational, auctionDuration: att.Duration, gracePeriod: att.Duration, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./tidemark_contract/contracts/rrNFT.arl", {
            creator: creator.to_mich(),
            minter: minter.to_mich(),
            royaltyRate: royaltyRate.to_mich(),
            minterRate: minterRate.to_mich(),
            marketRate: marketRate.to_mich(),
            auctionDuration: auctionDuration.to_mich(),
            gracePeriod: gracePeriod.to_mich()
        }, params)).address;
        this.address = address;
    }
    async addNewOwner(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "addNewOwner", addNewOwner_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async initiate(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "initiate", initiate_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async updateCurrentOwnerDuration(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "updateCurrentOwnerDuration", updateCurrentOwnerDuration_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async makeOffer(currentMarketplace: att.Address, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "makeOffer", makeOffer_arg_to_mich(currentMarketplace), params);
        }
        throw new Error("Contract not initialised");
    }
    async sell(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "sell", sell_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async claim(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "claim", claim_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async topUp(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "topUp", topUp_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async bringTidemarkAuctionForward(newDate: Date, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "bringTidemarkAuctionForward", bringTidemarkAuctionForward_arg_to_mich(newDate), params);
        }
        throw new Error("Contract not initialised");
    }
    async integrateExpCurveTest(a: att.Rational, b: att.Rational, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "integrateExpCurveTest", integrateExpCurveTest_arg_to_mich(a, b), params);
        }
        throw new Error("Contract not initialised");
    }
    async sliceAreaTest(a: att.Rational, b: att.Rational, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "sliceAreaTest", sliceAreaTest_arg_to_mich(a, b), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_addNewOwner_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "addNewOwner", addNewOwner_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_initiate_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "initiate", initiate_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_updateCurrentOwnerDuration_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "updateCurrentOwnerDuration", updateCurrentOwnerDuration_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_makeOffer_param(currentMarketplace: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "makeOffer", makeOffer_arg_to_mich(currentMarketplace), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_sell_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "sell", sell_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_claim_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "claim", claim_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_topUp_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "topUp", topUp_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_bringTidemarkAuctionForward_param(newDate: Date, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "bringTidemarkAuctionForward", bringTidemarkAuctionForward_arg_to_mich(newDate), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_integrateExpCurveTest_param(a: att.Rational, b: att.Rational, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "integrateExpCurveTest", integrateExpCurveTest_arg_to_mich(a, b), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_sliceAreaTest_param(a: att.Rational, b: att.Rational, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "sliceAreaTest", sliceAreaTest_arg_to_mich(a, b), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_creator(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_minter(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    async get_royaltyRate(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich((storage as att.Mpair).args[2]);
        }
        throw new Error("Contract not initialised");
    }
    async get_minterRate(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich((storage as att.Mpair).args[3]);
        }
        throw new Error("Contract not initialised");
    }
    async get_marketRate(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich((storage as att.Mpair).args[4]);
        }
        throw new Error("Contract not initialised");
    }
    async get_auctionDuration(): Promise<att.Duration> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Duration.from_mich((storage as att.Mpair).args[5]);
        }
        throw new Error("Contract not initialised");
    }
    async get_gracePeriod(): Promise<att.Duration> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Duration.from_mich((storage as att.Mpair).args[6]);
        }
        throw new Error("Contract not initialised");
    }
    async get_tidemarkAuctionDate(): Promise<Date> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_date((storage as att.Mpair).args[7]);
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[8]);
        }
        throw new Error("Contract not initialised");
    }
    async get_tidemark(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[9]);
        }
        throw new Error("Contract not initialised");
    }
    async get_bidder(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Option.from_mich((storage as att.Mpair).args[10], x => { return att.Address.from_mich(x); });
        }
        throw new Error("Contract not initialised");
    }
    async get_bid(): Promise<att.Option<att.Tez>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Option.from_mich((storage as att.Mpair).args[11], x => { return att.Tez.from_mich(x); });
        }
        throw new Error("Contract not initialised");
    }
    async get_lastBuyer(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Option.from_mich((storage as att.Mpair).args[12], x => { return att.Address.from_mich(x); });
        }
        throw new Error("Contract not initialised");
    }
    async get_AuctionType(): Promise<string> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_string((storage as att.Mpair).args[13]);
        }
        throw new Error("Contract not initialised");
    }
    async get_lastSalePrice(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[14]);
        }
        throw new Error("Contract not initialised");
    }
    async get_bidRemainderAfterFees(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[15]);
        }
        throw new Error("Contract not initialised");
    }
    async get_creatorFeesPaid(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[16]);
        }
        throw new Error("Contract not initialised");
    }
    async get_minterFeesPaid(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[17]);
        }
        throw new Error("Contract not initialised");
    }
    async get_marketPlaceFeesPaid(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[18]);
        }
        throw new Error("Contract not initialised");
    }
    async get_creatorFeesSinceLastSale(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[19]);
        }
        throw new Error("Contract not initialised");
    }
    async get_initiated(): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_bool((storage as att.Mpair).args[20]);
        }
        throw new Error("Contract not initialised");
    }
    async get_ownerNum(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich((storage as att.Mpair).args[21]);
        }
        throw new Error("Contract not initialised");
    }
    async get_testSummedBurden(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[22]);
        }
        throw new Error("Contract not initialised");
    }
    async get_testSummedBurdenPaid(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[23]);
        }
        throw new Error("Contract not initialised");
    }
    async get_testSummedBalanceWithContract(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich((storage as att.Mpair).args[24]);
        }
        throw new Error("Contract not initialised");
    }
    async get_answer(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich((storage as att.Mpair).args[25]);
        }
        throw new Error("Contract not initialised");
    }
    async get_bids(): Promise<bids_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[26], (x, y) => [att.Tez.from_mich(x), bids_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_ownerHistory(): Promise<ownerHistory_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[27], (x, y) => [att.Nat.from_mich(x), ownerHistory_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_ownerHistoryWorkSpace(): Promise<ownerHistoryWorkSpace_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[28], (x, y) => [att.Nat.from_mich(x), ownerHistoryWorkSpace_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_metadata_value(key: string): Promise<att.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[29]).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
            if (data != undefined) {
                return att.Bytes.from_mich(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_metadata_value(key: string): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[29]).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r_requested_auction_date_before_current: att.string_to_mich("\"The requested tidemark auction date may only be before the current tidemark date\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        OPTION_IS_NONE: att.string_to_mich("\"OPTION_IS_NONE\""),
        r_bid_is_some: att.string_to_mich("\"There is no bid\""),
        r_bidder_is_some: att.string_to_mich("\"There is no bidder\""),
        r_auction_expired2: att.string_to_mich("\"The auction has not yet concluded\""),
        r_grace_period_elapsed: att.string_to_mich("\"The grace period has not yet elapsed\""),
        r_auction_expired: att.string_to_mich("\"The auction has not yet concluded\""),
        ERROR_MESSAGE: att.string_to_mich("\"error message\""),
        r_caller_is_owner_or_self: att.string_to_mich("\"Only the owner may sell the token\""),
        r_auctionOngoing: att.string_to_mich("\"The auction has already concluded\""),
        r_bidderNotCaller: att.string_to_mich("\"The owner's address may not bid\""),
        r_higherBid: att.string_to_mich("\"your Bid must be higher than current bid\""),
        r_bidNotZero: att.string_to_mich("\"Your bid must be greater than Zero\""),
        r_initFalse: att.string_to_mich("\"contract already initiated\"")
    };
}
export const rrNFT = new RrNFT();

