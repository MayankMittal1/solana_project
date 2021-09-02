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
        //Initialise
        let mut vault_account_data: Vault =
            try_from_slice_unchecked(&vault_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
        vault_account_data.owned_tokens = "".to_string();

        vault_account_data
            .serialize(&mut &mut vault_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    if *instruction_byte == 1 {
        //Add to vault
        let mut vault_account_data: Vault =
            try_from_slice_unchecked(&vault_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        let token = next_account_info(accounts_iter)?;
        let addend = String::from(",") + &token.key.to_string();

        vault_account_data.owned_tokens += &addend;
        vault_account_data
            .serialize(&mut &mut vault_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }
    if *instruction_byte == 2 {
        //Remove from vault
        let mut vault_account_data: Vault =
            try_from_slice_unchecked(&vault_account.data.borrow()).map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;

        let token = next_account_info(accounts_iter)?;
        let addend = String::from(",") + &token.key.to_string();

        let s1 = vault_account_data.owned_tokens.replace(&addend, "");
        vault_account_data.owned_tokens = s1;
        vault_account_data
            .serialize(&mut &mut vault_account.data.borrow_mut()[..])
            .map_err(|err| {
                msg!("Receiving message as string utf8 failed, {:?}", err);
                ProgramError::InvalidInstructionData
            })?;
    }

    Ok(())
}