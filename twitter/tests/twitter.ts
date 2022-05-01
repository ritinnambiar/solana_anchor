import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Twitter } from "../target/types/twitter";
import * as assert from "assert";
import * as bs58 from "bs58";

describe("twitter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Twitter as Program<Twitter>;

  // pass condition
  it("Tweeting!", async () => {
    const tweet = anchor.web3.Keypair.generate();
    const tx = await program.rpc.sendTweet("topic", "content" , {
      accounts: {
        tweet: tweet.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [tweet],
    });
    //console.log("Your transaction signature", tx);
    let tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
    //console.log(tweetAccount);
  });

  // pass condition
  it("Tweeting through another user!", async () => {
    const tweet = anchor.web3.Keypair.generate();
    const otherUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    const tx = await program.rpc.sendTweet("topic", "content" , {
      accounts: {
        tweet: tweet.publicKey,
        author: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [otherUser, tweet],
    });
    //console.log("Your transaction signature", tx);
    let tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
    //console.log(tweetAccount);
    assert.equal(tweetAccount.author.toBase58, otherUser.publicKey.toBase58);
    assert.equal(tweetAccount.topic, "topic");
    assert.equal(tweetAccount.content, "content");
    assert.ok(tweetAccount.timestamp);
  });

  // error condition
  it("Cannot provide topic > 50 characters!", async () => {
    try{
      const tweet = anchor.web3.Keypair.generate();
      const topic = 'x'.repeat(51);
      const tx = await program.rpc.sendTweet(topic, "content" , {
        accounts: {
          tweet: tweet.publicKey,
          author:  provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [tweet],
      });
    }
    catch(err){
      const errMsg ="Topic is too long. 50 characters maximum.";
      assert.equal(err.error.errorMessage, errMsg);
      return;
    }
    //assert.fail("The instruction should have failed with 51 character topic");
  });

  // error condition
  it("Cannot provide content > 280 characters!", async () => {
    try{
      const tweet = anchor.web3.Keypair.generate();
      const content = 'x'.repeat(281);
      const tx = await program.rpc.sendTweet("topic", content , {
        accounts: {
          tweet: tweet.publicKey,
          author:  provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [tweet],
      });
    }
    catch(err){
      const errMsg ="Content is too long. 280 characters maximum.";
      assert.equal(err.error.errorMessage, errMsg);
      return;
    }
    //assert.fail('The instruction should have failed with 281 character content')
  });

  // retrive all tweets
  it("Tweet All!", async () => {
    let tweetAccount = await program.account.tweet.all();
    assert.equal(tweetAccount.length, 2);
  });

  // retrive all tweets by author
  it("Tweet by author!", async () => {
    let tweetAccount = await program.account.tweet.all([
    {
      memcmp: {
        offset: 8, //Discriminator
        bytes: provider.wallet.publicKey.toBase58(),
      }
    }
    ]);
    assert.ok(tweetAccount.every(tweetAccount => {
      return tweetAccount.account.author.toBase58()== provider.wallet.publicKey.toBase58()
    }))
  });

  // retrive all tweets by topic
  it("Tweet by topic!", async () => {
    let tweetAccount = await program.account.tweet.all([
    {
      memcmp: {
        offset: 8 +32+8+4, //Discriminator
        bytes: bs58.encode(Buffer.from("topic")),
      }
    }
    ]);
    assert.ok(tweetAccount.every(tweetAccount => {
      return tweetAccount.account.topic== "topic"
    }))
  });




});
