import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';

import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { hardhat, polygonMumbai, goerli } from 'wagmi/chains';


const alchemyId = process.env.REACT_APP_ALCHEMY_API_KEY as string
// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai, goerli, mainnet, hardhat],
  [alchemyProvider({ apiKey: alchemyId }), publicProvider()],
)

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider,
  webSocketProvider,
})

ReactDOM.render(
  <WagmiConfig client={client}>  
    <HelmetProvider>
      <SidebarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SidebarProvider>
    </HelmetProvider>
  </WagmiConfig>,
  document.getElementById('root')
);

serviceWorker.unregister();
