import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Transfer } from "../target/types/transfer";

describe("transfer", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Transfer as Program<Transfer>;

 
  // Typescript transfer 
  it("Transfering Sol!", async () => {
    // Add your test here.
    const fromKeypair = anchor.web3.Keypair.generate();
    const toKeypair = anchor.web3.Keypair.generate();
    
    const connection = new anchor.web3.Connection("http://localhost:8899",
    'confirmed');
    
    const fromSignature = await connection.requestAirdrop(fromKeypair.publicKey, 1000000000);
    const toSignature = await connection.requestAirdrop(toKeypair.publicKey, 1000000000);
    await connection.confirmTransaction(fromSignature);
    await connection.confirmTransaction(toSignature);

    const transferTransaction = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer(
       ({fromPubkey: fromKeypair.publicKey, 
          lamports: 1000, 
          toPubkey:toKeypair.publicKey})
      )
    );
    
    
    await anchor.web3.sendAndConfirmTransaction(
      connection,
      transferTransaction,
      [fromKeypair]
    );
    console.log("Your transaction signature", transferTransaction);
    
    console.log("from account balance: ",await connection.getBalance(fromKeypair.publicKey));
    console.log("to account balance: ",await connection.getBalance(toKeypair.publicKey));

  });

  // Transfer through rust
  it("Transfering Sol through Rust!", async () => {
    // Add your test here.
    const fromKeypair = anchor.web3.Keypair.generate();
    const toKeypair = anchor.web3.Keypair.generate();
    
    const connection = new anchor.web3.Connection("http://localhost:8899",
    'confirmed');
    
    const fromSignature = await connection.requestAirdrop(fromKeypair.publicKey, 1000000000);
    const toSignature = await connection.requestAirdrop(toKeypair.publicKey, 1000000000);
    await connection.confirmTransaction(fromSignature);
    await connection.confirmTransaction(toSignature);
   
    let amount =  new anchor.BN(10000);
    let transferTransaction = await program.rpc.transferSol(amount, {
      accounts:{
        from: fromKeypair.publicKey,
        to: toKeypair.publicKey,
        authority: fromKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [fromKeypair],
    })
    await connection.confirmTransaction(transferTransaction);
    console.log("Your transaction signature", transferTransaction);
    
    console.log("from account balance: ",await connection.getBalance(fromKeypair.publicKey));
    console.log("to account balance: ",await connection.getBalance(toKeypair.publicKey));

  });

});
