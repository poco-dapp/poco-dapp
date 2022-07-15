import * as uuid from "uuid";
import * as ethers from "ethers";

const POCO_UID_V1_PREFIX = "01";

/**
 * UID is a 136 bit (17 bytes) value, it is a concatenation of POCO Version Prefix (eg. 01) and standard UUID (eg. 5848ACB-7CBC-4ABA-B6AC-DD755DB0593F) with all dashed removed.
 * concatenated eg. 15848ACB7CBC4ABAB6ACDD755DB0593F
 */
export class Uid {
  private uid: string;
  constructor(uid: string) {
    this.uid = uid;
  }

  static generateUid(): Uid {
    const uuid4 = uuid.v4().replace(/-/g, "");
    return new Uid(`${POCO_UID_V1_PREFIX}${uuid4}`);
  }

  static parse(value: string): Uid {
    if (!this.isValid(value)) {
      throw new Error("Invalid UID: ", value);
    }

    const removeDashes = value.replace(/-/g, "");
    const removeHexPrefix = removeDashes.replace("0x", "");
    return new Uid(removeHexPrefix);
  }

  static isValid(value: string): boolean {
    const withDashes =
      /^[0-1][0-9]\b-[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    const withoutDashes = /^[0-1][0-9][0-9a-fA-F]{32}$/;
    const withHexPrefix = /^0x[0-1][0-9][0-9a-fA-F]{32}$/;
    return withDashes.test(value) || withoutDashes.test(value) || withHexPrefix.test(value);
  }

  /**
   * UID for display has a dash between POCO version prefix and UUID as well as uses the UUID representation with dashes eg. 1-5848ACB-7CBC-4ABA-B6AC-DD755DB0593F
   * eg. 01-5848ACB-7CBC-4ABA-B6AC-DD755DB0593F
   */
  toDisplayFormat(): string {
    const bytesArray = ethers.utils.arrayify(this.toHexString());
    const pocoVersion = ethers.utils.hexlify(bytesArray[0]).slice(2);
    const uuidBytesArray = bytesArray.slice(1);
    return `${pocoVersion}-${uuid.stringify(uuidBytesArray)}`.toUpperCase();
  }

  toHexString(): string {
    return `0x${this.uid}`;
  }

  toString(): string {
    return this.uid;
  }
}
