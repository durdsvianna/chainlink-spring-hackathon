import { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { NftOrder } from 'src/models/nft_order';
import WarrantiesTable from './WarrantiesTable';
import { useContract, useSigner } from 'wagmi';
import { useIpfsUploader } from "src/utils/IpfsUtils"
import NftERC721Artifact from "src/contracts/NftERC721.json";
import contractAddress from "src/contracts/contract-nfterc721-address.json";

function Warranties({ data }) {

  return (
    <Card>
      <WarrantiesTable nfts={data} />
    </Card>
  );
}

export default Warranties;
