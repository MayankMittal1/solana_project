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
//

class IntellectualProperty {
  property_metadata = "test"
  token_address = "ZGZCCY2U3AC8WJLGRFR4DFH1VXWRSX2SNT1YU75UX9PHX2S78HMNGCNCO04VHV5D"
  constructor(fields: {property_metadata: string, token_address: string} | undefined = undefined) {
    if (fields) {
      this.property_metadata = fields.property_metadata;
      this.token_address=fields.token_address
    }
  }
}

const IntellectualPropertySchema = new Map([
  [IntellectualProperty, {kind: 'struct', fields: [['property_metadata', 'String'],['token_address','String']]}],
]);

const IntellectualProperty_Size = borsh.serialize(
  IntellectualPropertySchema,
  new IntellectualProperty(),
).length;


const program_id = new PublicKey("7ofUaLBHj2QZdzqRuMNcjYFMMCfVgsC4nqCPABibnbbq");
async function establishConnection() {
  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", rpcUrl, version);
}

async function createKeypairFromInput(key:string) :Promise<Keypair> {
  const secretKey = Uint8Array.from(JSON.parse(key));
  return Keypair.fromSecretKey(secretKey);
}

export async function createAccount(privateKeyByteArray:string, seed:string, description:string) {
  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "singleGossip");

  const initializerAccount = await createKeypairFromInput(privateKeyByteArray);
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

  console.log(IntellectualProperty_Size)
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
      Uint8Array.of(0, ...Array.from(new TextEncoder().encode(description)))
    ),
  });

  const transaction2 = new Transaction().add(initAccount);

  console.log(`The address of account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction2, [
    initializerAccount,
  ]);
}

// async function fetch() {
//   const signer = await createKeypairFromFile();
//   const fetch_transaction = new TransactionInstruction({
//     programId: program_id,
//     keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: false }],
//     data: Buffer.from(Uint8Array.of(2)),
//   });

//   const transaction = new Transaction().add(fetch_transaction);

//   var a = await sendAndConfirmTransaction(connection, transaction, [signer]);
// }

// const pri= async function(){
//   const signer = await createKeypairFromFile();
//   console.log(signer.publicKey.toBase58())
// }
// pri()
