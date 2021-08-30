use borsh::{BorshDeserialize, BorshSerialize};
//use std::collections::HashMap;
//use std::convert::TryInto;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct IntellectualProperty {
    pub property_owner: Pubkey,
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
    // //let amount = rest_of_data
    //   .get(..8)
    //   .and_then(|slice| slice.try_into().ok())
    //   .map(u64::from_le_bytes)
    //   .unwrap();
          
      if *instruction_byte == 0 {
        let description = String::from_utf8(rest_of_data.to_vec()).unwrap();
        let mut property_account_data = IntellectualProperty::try_from_slice(&property_owner_account.data.borow())?;
        property_account_data.property_owner = *property_owner_account.owner;
        property_account_data.property_metadata=description;
        property_account_data.serialize(&mut &mut property_owner_account.data.borrow_mut()[..])?;
      }

      if *instruction_byte == 1 {
        //get campaign status 
    }

    if *instruction_byte == 2 {
        return Ok(());
    }

    if *instruction_byte == 3 {

    }
    

    Ok(())
}