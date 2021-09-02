//dependencies
import {
  Connection,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { config } from "dotenv";
import * as borsh from 'borsh';
import { error } from "console";
import { createToken } from "./token";

//
function refineData(data:string){
  class IntellectualProperty {
    property_owner = ""
    hash = ""
    amount = 0
    uri = ""
    constructor(fields: { property_owner: string, hash: string, amount: number, uri: string } | undefined = undefined) {
      if (fields) {
        this.property_owner = fields.property_owner;
        this.hash = fields.hash;
        this.amount = fields.amount;
        this.uri = fields.uri
      }
    }
  }
  let data2=data.split("@")
  let owner=data2[0].substr(1)
  let hex=data2[1].substr(0,64)
  console.log(data)
  if(data2[1].length>64){
    let url = data2[1].substr(65)
    var a= new IntellectualProperty()
    a.property_owner=owner
    a.hash=hex
    a.uri=url
    return a
  }
  var a= new IntellectualProperty()
  a.property_owner=owner
  a.hash=hex
  return a
}


const program_id = new PublicKey("7ofUaLBHj2QZdzqRuMNcjYFMMCfVgsC4nqCPABibnbbq");
// async function establishConnection() {
//   const rpcUrl = "http://localhost:8899";
//   const connection = new Connection(rpcUrl, "confirmed");
//   const version = await connection.getVersion();
//   console.log("Connection to cluster established:", rpcUrl, version);
// }

async function createKeypairFromInput(key: string): Promise<Keypair> {
  const secretKey = Uint8Array.from(JSON.parse(key));
  return Keypair.fromSecretKey(secretKey);
}

export async function createAccount(privateKeyByteArray: string, seed: string, hash: string) {
  const initializerAccount = await createKeypairFromInput(privateKeyByteArray);
  //const address= await createToken(initializerAccount)
  class IntellectualProperty {
    property_owner = initializerAccount.publicKey.toBase58()
    hash = hash
    amount = 100000
    uri = "abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd"
    is_public = false
    for_sale = false
    constructor(fields: { property_owner: string, hash: string, amount: number, uri: string, is_public:boolean, for_sale:boolean } | undefined = undefined) {
      if (fields) {
        this.property_owner = fields.property_owner;
        this.hash = fields.hash;
        this.amount = fields.amount;
        this.uri = fields.uri
        this.for_sale=fields.for_sale
        this.is_public=fields.is_public
      }
    }
  }


  const IntellectualPropertySchema = new Map([
    [IntellectualProperty, { kind: 'struct', fields: [['property_owner', 'string'], ['hash', 'string'], ['amount', 'u64'], ['uri', 'string']] }],
  ]);

  const IntellectualProperty_Size = borsh.serialize(
    IntellectualPropertySchema,
    new IntellectualProperty(),
  ).length;

  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "confirmed");

  const newAccountPubkey = await PublicKey.createWithSeed(
    initializerAccount.publicKey,
    seed,
    program_id
  );
  const lamports = await connection.getMinimumBalanceForRentExemption(
    IntellectualProperty_Size
  );
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: initializerAccount.publicKey,
    basePubkey: initializerAccount.publicKey,
    seed: seed,
    newAccountPubkey: newAccountPubkey,
    lamports: lamports,
    space: IntellectualProperty_Size,
    programId: program_id,
  });

  const transaction = new Transaction().add(instruction);
  await sendAndConfirmTransaction(connection, transaction, [
    initializerAccount,
  ]);

  const initAccount = new TransactionInstruction({
    programId: program_id,
    keys: [
      { pubkey: newAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
    ],
    data: Buffer.from(
      Uint8Array.of(0, ...Array.from(new TextEncoder().encode("abcdefghabcdefghabcdefghabcdefghabcdefghabcdefghabcdefghabcdefgh")))
    ),
  });

  const transaction2 = new Transaction().add(initAccount);

  console.log(`The address of account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction2, [
    initializerAccount,
  ]);

  return newAccountPubkey.toBase58()

}

export async function goPublic(privateKeyByteArray: string, seed: string) {
  const initializerAccount = await createKeypairFromInput(privateKeyByteArray);

  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "confirmed");

  const newAccountPubkey = await PublicKey.createWithSeed(
    initializerAccount.publicKey,
    seed,
    program_id
  );

  const accountInfo = await connection.getAccountInfo(newAccountPubkey);
  if (accountInfo === null) {
    throw 'Error: cannot find the account';
  }
  else{
  const initAccount = new TransactionInstruction({
    programId: program_id,
    keys: [
      { pubkey: newAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
    ],
    data: Buffer.from(
      Uint8Array.of(1, ...Array.from(new TextEncoder().encode("http://www.google.com/images")))
    ),
  });

  const transaction2 = new Transaction().add(initAccount);

  console.log(`The address of account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction2, [
    initializerAccount,
  ]);

  return newAccountPubkey.toBase58()

  }
}
//fetch account
export async function fetch(key: string) {
  class IntellectualProperty {
    property_owner = ""
    hash = ""
    amount = 100000
    uri = "abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd"
    constructor(fields: { property_owner: string, hash: string, amount: number, uri: string } | undefined = undefined) {
      if (fields) {
        this.property_owner = fields.property_owner;
        this.hash = fields.hash;
        this.amount = fields.amount;
        this.uri = fields.uri
      }
    }
  }



  const IntellectualPropertySchema = new Map([
    [IntellectualProperty, { kind: 'struct', fields: [['property_owner', 'string'], ['hash', 'string'], ['amount', 'u64'], ['uri', 'string']] }],
  ]);

  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "singleGossip");
  var greetedPubkey = new PublicKey(key)
  const accountInfo = await connection.getAccountInfo(greetedPubkey);
  if (accountInfo === null) {
    return Error
  }
  // const property = borsh.deserialize(
  //   IntellectualPropertySchema,
  //   IntellectualProperty,
  //   Buffer.from(
  //     Uint8Array.of(0,...Array.from(new TextEncoder().encode(cleanString(new TextDecoder().decode(accountInfo.data)))))
  //   )
  // );
  return new TextDecoder().decode(accountInfo.data)
}