use borsh::{BorshDeserialize, BorshSerialize};
//use std::collections::HashMap;
//use std::convert::TryInto;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    borsh::{try_from_slice_unchecked},
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct IntellectualProperty {
    pub property_metadata: String,
    pub token_address: String,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo],
    data: &[u8], 
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let property_owner_account = next_account_info(accounts_iter)?;
    if property_owner_account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }
    let (instruction_byte, rest_of_data) = data.split_first().unwrap();

      if *instruction_byte == 0 {
        let metadata = String::from_utf8(rest_of_data[..64].to_vec()).unwrap();
        let token = String::from_utf8(rest_of_data[64..].to_vec()).unwrap();
        msg!("{}",&property_owner_account.data.borrow().len());
        let mut property_account_data : IntellectualProperty = try_from_slice_unchecked(&property_owner_account.data.borrow()).map_err(|err| {
            msg!("Receiving message as string utf8 failed, {:?}", err);
            ProgramError::InvalidInstructionData  
          })?;
        property_account_data.property_metadata=metadata;
        property_account_data.token_address=token;
        msg!("{}, {}",property_account_data.token_address, property_account_data.property_metadata);
        property_account_data.serialize(&mut &mut property_owner_account.data.borrow_mut()[..]).map_err(|err| {
            msg!("Receiving message as string utf8 failed, {:?}", err);
            ProgramError::InvalidInstructionData  
          })?;
        msg!("{}, {}",property_account_data.token_address, property_account_data.property_metadata);
      }
    Ok(())
}