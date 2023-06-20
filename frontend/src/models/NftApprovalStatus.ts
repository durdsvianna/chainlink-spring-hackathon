import { NftContract } from "alchemy-sdk";

export interface NftApprovalStatus {
  contract: string | NftContract;
  hasApprovals?: boolean;
  tokenId: string;
}
