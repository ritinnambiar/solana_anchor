import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Memecoin } from "../target/types/memecoin";
const assert = require("assert");
const { SystemProgram } = anchor.web3;

describe("memecoin", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Memecoin;
  const baseAccount = anchor.web3.Keypair.generate();
  
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.state.rpc.new({
      accounts:{
        authority: provider.wallet.publicKey,
      },
    });
    console.log("Your transaction signature", tx);
    const state = await program.state.fetch();
    console.log("Data = ", state.data)
  });

  
});
