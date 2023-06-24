type TokenId = number & { __tokenIdBrand: never };

const MAX_TOKEN_ID = Number(process.env.NEXT_PUBLIC_MAX_TOKEN_ID) || 10000;
const nftUrl = process.env.NEXT_PUBLIC_NFT_ENDPOINT || "";

function isTokenId(value: number): value is TokenId {
  return value >= 0 && value <= MAX_TOKEN_ID;
}

export async function getNftAsset(
    tokenId: number,
    apiEndpoint?: string
  ): Promise<string[] | string> {
    if (isTokenId(tokenId)) {
      const response = await fetch(`${apiEndpoint || nftUrl}/${tokenId}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
      // return data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    } else {
      throw new Error(`TokenId must be between 0 and ${MAX_TOKEN_ID}`);
    }
  }