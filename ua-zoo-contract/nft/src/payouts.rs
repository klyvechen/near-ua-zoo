use near_sdk::{
  AccountId
};
use near_sdk::json_types::U128;
use std::collections::HashMap;
use near_sdk::serde::{ Serialize, Deserialize };

pub type Payout = HashMap<AccountId, U128>;

pub trait Payouts{
  /// Given a `token_id` and NEAR-denominated balance, return the `Payout`.
  /// struct for the given token. Panic if the length of the payout exceeds
  // /// `max_len_payout.`
  fn nft_payout(&self, token_id: String, balance: U128, max_len_payout: u32) -> Payout;

  /// Given a `token_id` and NEAR-denominated balance, transfer the token
  /// and return the `Payout` struct for the given token. Panic if the
  /// length of the payout exceeds `max_len_payout.`
  fn nft_transfer_payout(
    &mut self,
    receiver_id: AccountId,
    token_id: String,
    approval_id: u64,
    memo: String,
    balance: U128,
    max_len_payout: u32,
  ) -> Payout;
}