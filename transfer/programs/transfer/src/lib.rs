use anchor_lang::prelude::*;
use anchor_lang::system_program::Transfer;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod transfer {
    use super::*;

    pub fn transfer_sol(ctx: Context<TransferSol>, amount: u64) -> Result<()> {
        anchor_lang::system_program::transfer(ctx.accounts.transfer_ctx(), amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferSol<'info>{
    #[account(mut)]
    /// CHECK: my wish
    pub from:UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: my wish
    pub to:UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> TransferSol<'info>{
    fn transfer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>>{
        CpiContext::new(
            self.system_program.to_account_info(),
            Transfer{
                from: self.from.to_account_info(),
                to: self.to.to_account_info(),
            }
        )
    }
}
