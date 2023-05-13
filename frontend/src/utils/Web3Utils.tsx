import { useAccount } from 'wagmi';

export function useShortenAddressOrEnsName() {
    function shortenAddressOrEnsName(length = 5): string {
      const { address, connector, isConnected } = useAccount()
      //const { data: ensNameData } = useEnsName({ address: address });

      if (address && address.length > 0) {
        const prefix = address.slice(0, length + 2);
        const suffix = address.slice(address.length - length);
    
        //return ensNameData ?? `${prefix}...${suffix}`;
        return `${prefix}...${suffix}`;
      }
      else return "Unnamed";
    }
  
    return { shortenAddressOrEnsName };
  }

  export function useShortenAddressOrEnsNameOfOwner() {
    function shortenAddressOrEnsNameOfOwner(owner, length = 5): string {
      //const { data: ensNameData } = useEnsName({ address: owner });

      const prefix = owner.slice(0, length + 2);
      const suffix = owner.slice(owner.length - length);
      
      //return ensNameData ?? `${prefix}...${suffix}`;
      return `${prefix}...${suffix}`;
    }
    
    return { shortenAddressOrEnsNameOfOwner };
  }
  
  export function useWalletAddress() {
    function walletAddress(){
      const { address, connector, isConnected } = useAccount()
      const addressWallet = address;
  
      return addressWallet
    }
  
    return { walletAddress };
  }

  export function useEnsNameOrShortenAddress() {
    function ensNameOrShortenAddress(length = 5): string {
      const { address, connector, isConnected } = useAccount()
      //const { data: ensNameData } = useEnsName({ address: address });
      
      //return ensNameData ?? address;
      return address;
    }
  
    return { ensNameOrShortenAddress };
  }
