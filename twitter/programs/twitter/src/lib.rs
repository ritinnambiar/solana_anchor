use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod twitter {
    use super::*;

    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> Result<()> {
        let tweet = &mut ctx.accounts.tweet;
        tweet.timestamp = Clock::get().unwrap().unix_timestamp;
        let author = &ctx.accounts.author;
        tweet.author = *author.key;
        
        if topic.chars().count() > TOPIC_CHARACTERS{
            return Err(error!(ErrorCode::TopicTooLong));
        }
        if content.chars().count() > CONTENT_CHARACTERS{
            return Err(error!(ErrorCode::ContentTooLong));
        }
        
        tweet.topic = topic;
        tweet.content = content;  
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = Tweet::LEN)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct Tweet {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

const DISCRIMINATOR_LENGTH:usize =8;
const PUBKEY_LENGTH:usize = 32;
const TIMESTAMP_LENGTH:usize = 8;
const TOPIC_CHARACTERS:usize = 50;
const TOPIC_LENGTH:usize = TOPIC_CHARACTERS*4+4;//50 characters. UTF-8 1 to 4 bytes, 4- prefix for vector length
const CONTENT_CHARACTERS:usize = 280;
const CONTENT_LENGTH:usize = CONTENT_CHARACTERS*4+4; //280 characters

impl Tweet {
    const LEN:usize =DISCRIMINATOR_LENGTH+ PUBKEY_LENGTH
    +TIMESTAMP_LENGTH+TOPIC_LENGTH+CONTENT_LENGTH;
}

#[error_code]
pub enum ErrorCode{
    #[msg("Topic is too long. 50 characters maximum.")]
    TopicTooLong,
    #[msg("Content is too long. 280 characters maximum.")]
    ContentTooLong,
}