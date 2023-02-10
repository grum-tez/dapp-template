import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
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
        const address = (await ex.deploy("./contracts/rrNFT.arl", {
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
    async get_metadata_value(key: string): Promise<att.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[7]).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
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
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[7]).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const rrNFT = new RrNFT();
