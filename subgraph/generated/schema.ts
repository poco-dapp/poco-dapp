// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Nft extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Nft entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Nft must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Nft", id.toString(), this);
    }
  }

  static load(id: string): Nft | null {
    return changetype<Nft | null>(store.get("Nft", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get minter(): Bytes {
    let value = this.get("minter");
    return value!.toBytes();
  }

  set minter(value: Bytes) {
    this.set("minter", Value.fromBytes(value));
  }

  get nftUid(): Bytes {
    let value = this.get("nftUid");
    return value!.toBytes();
  }

  set nftUid(value: Bytes) {
    this.set("nftUid", Value.fromBytes(value));
  }

  get nftUri(): string {
    let value = this.get("nftUri");
    return value!.toString();
  }

  set nftUri(value: string) {
    this.set("nftUri", Value.fromString(value));
  }

  get minterUser(): string {
    let value = this.get("minterUser");
    return value!.toString();
  }

  set minterUser(value: string) {
    this.set("minterUser", Value.fromString(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nftsMinted(): Array<string> {
    let value = this.get("nftsMinted");
    return value!.toStringArray();
  }

  set nftsMinted(value: Array<string>) {
    this.set("nftsMinted", Value.fromStringArray(value));
  }
}
