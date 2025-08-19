import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = ({ className = '' }) => {
  return (
    <WalletMultiButton
      className={`!bg-gradient-primary !text-black !border-none !rounded-full !font-semibold !px-4 !py-2 !text-sm hover:!shadow-lg hover:!shadow-primary/25 !transition-all !duration-300 hover:!scale-105 ${className}`}
    />
  );
};

export default WalletConnectButton;


