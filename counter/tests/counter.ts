import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
const { SystemProgram } = anchor.web3;

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;
  const counter_account = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.create(provider.wallet.publicKey, {
      accounts:{
        counter: counter_account.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counter_account],
    });
    console.log("Your transaction signature", tx);
  });
  it("Is incremented!", async () => {
    // Add your test here.
    const tx = await program.rpc.increment({
      accounts:{
        counter: counter_account.publicKey,
        authority: provider.wallet.publicKey,
      },
    });
    console.log("Your transaction signature", tx);
    const readback = await program.account.counter.fetch(counter_account.publicKey);
    console.log("count=", readback.count);
  });
});
