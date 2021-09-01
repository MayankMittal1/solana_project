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



const program_id = new PublicKey("7ofUaLBHj2QZdzqRuMNcjYFMMCfVgsC4nqCPABibnbbq");
// async function establishConnection() {
//   const rpcUrl = "http://localhost:8899";
//   const connection = new Connection(rpcUrl, "confirmed");
//   const version = await connection.getVersion();
//   console.log("Connection to cluster established:", rpcUrl, version);
// }

async function createKeypairFromInput(key:string) :Promise<Keypair> {
  const secretKey = Uint8Array.from(JSON.parse(key));
  return Keypair.fromSecretKey(secretKey);
}

export async function createAccount(privateKeyByteArray:string, seed:string, metadata:string) {
  const initializerAccount = await createKeypairFromInput(privateKeyByteArray);
  const address= await createToken(initializerAccount)
  class IntellectualProperty {
    property_metadata = metadata
    token_address = address
    constructor(fields: {property_metadata: string, token_address: string} | undefined = undefined) {
      if (fields) {
        this.property_metadata = fields.property_metadata;
        this.token_address=fields.token_address
      }
    }
  }
  
  
  const IntellectualPropertySchema = new Map([
    [IntellectualProperty, {kind: 'struct', fields: [['property_metadata', 'string'],['token_address','string']]}],
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
    newAccountPubkey:newAccountPubkey,
    lamports:lamports,
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
    ],
    data: Buffer.from(
      Uint8Array.of(0,...Array.from(new TextEncoder().encode(metadata+address)))
    ),
  });

  const transaction2 = new Transaction().add(initAccount);

  console.log(`The address of account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction2, [
    initializerAccount,
  ]);

  return newAccountPubkey.toBase58()

}
//fetch account
export async function fetch(key:string) {
  class IntellectualProperty {
    property_metadata = ""
    token_address = ""
    constructor(fields: {property_metadata: string, token_address: string} | undefined = undefined) {
      if (fields) {
        this.property_metadata = fields.property_metadata;
        this.token_address=fields.token_address
      }
    }
  }
  
  const IntellectualPropertySchema = new Map([
    [IntellectualProperty, {kind: 'struct', fields: [['property_metadata', 'string'],['token_address','string']]}],
  ]);
  
  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "singleGossip");
  var greetedPubkey = new PublicKey(key)
  const accountInfo = await connection.getAccountInfo(greetedPubkey);
  if (accountInfo === null) {
    return Error
  }
  const property = borsh.deserialize(
    IntellectualPropertySchema,
    IntellectualProperty,
    accountInfo.data,
  );
  return property
  }