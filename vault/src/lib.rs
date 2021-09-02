use borsh::{BorshDeserialize, BorshSerialize};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]

pub struct Vault {
    pub owned_tokens : String,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let vault_account = next_account_info(accounts_iter)?;

    if vault_account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let (instruction_byte, rest_of_data) = data.split_first().unwrap();

    if *instruction_byte == 0 {
        //Add to vault
    }
    if *instruction_byte == 1 {
        //remove from vault
    }

    Ok(())
}