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
//
const result = config();
const program_id = new PublicKey("7ofUaLBHj2QZdzqRuMNcjYFMMCfVgsC4nqCPABibnbbq");
async function establishConnection() {
  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", rpcUrl, version);
}

async function createKeypairFromInput(key:string) :Promise<void> {
  const secretKey = Uint8Array.from(JSON.parse(key));
  const initializerAccount = Keypair.fromSecretKey(secretKey);
}

export async function createAccount(privateKeyByteArray:string, seed:string, description:string) {
  const rpcUrl = "http://localhost:8899";
  const connection = new Connection(rpcUrl, "singleGossip");

  createKeypairFromInput(privateKeyByteArray);
  const newAccountPubkey = await PublicKey.createWithSeed(
    initializerAccount.publicKey,
    seed,
    program_id
  );
  const lamports = await connection.getMinimumBalanceForRentExemption(
    5000
  );
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: initializerAccount.publicKey,
    basePubkey: initializerAccount.publicKey,
    seed: seed,
    newAccountPubkey:newAccountPubkey,
    lamports:lamports,
    space: 5000,
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
      Uint8Array.of(0, ...new TextEncoder().encode(description))
    ),
  });

  const transaction2 = new Transaction().add(initAccount);

  console.log(`The address of account is : ${newAccountPubkey.toBase58()}`);

  await sendAndConfirmTransaction(connection, transaction2, [
    initializerAccount,
  ]);
}

async function fetch() {
  const signer = await createKeypairFromFile();
  const fetch_transaction = new TransactionInstruction({
    programId: program_id,
    keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: false }],
    data: Buffer.from(Uint8Array.of(2)),
  });

  const transaction = new Transaction().add(fetch_transaction);

  var a = await sendAndConfirmTransaction(connection, transaction, [signer]);
}

// const pri= async function(){
//   const signer = await createKeypairFromFile();
//   console.log(signer.publicKey.toBase58())
// }
// pri()
