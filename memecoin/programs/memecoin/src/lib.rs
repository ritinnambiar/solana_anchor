use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod memecoin {
    use super::*;
    
    #[state]
    pub struct MemeCoin{
        pub authority: Pubkey,
        pub data: u64,
    }
    impl MemeCoin{
        pub fn new(ctx: Context<Auth>) -> anchor_lang::Result<Self> {
            Ok(Self {
                authority: *ctx.accounts.authority.key,
                data: 420,
            })
        }
    }
}

#[derive(Accounts)]
pub struct Auth<'info> {
   authority: Signer<'info>
}


