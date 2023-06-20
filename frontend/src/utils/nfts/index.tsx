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