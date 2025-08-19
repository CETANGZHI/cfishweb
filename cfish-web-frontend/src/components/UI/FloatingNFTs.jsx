import React from 'react';

const FloatingNFTs = () => {
  const nfts = [
    { id: 1, src: 'https://via.placeholder.com/60/FF00FF/FFFFFF?text=NFT1', size: 'w-16 h-16', delay: '0s', duration: '10s' },
    { id: 2, src: 'https://via.placeholder.com/80/00FFFF/FFFFFF?text=NFT2', size: 'w-20 h-20', delay: '2s', duration: '12s' },
    { id: 3, src: 'https://via.placeholder.com/70/FFFF00/FFFFFF?text=NFT3', size: 'w-18 h-18', delay: '4s', duration: '11s' },
    { id: 4, src: 'https://via.placeholder.com/90/FF0000/FFFFFF?text=NFT4', size: 'w-24 h-24', delay: '6s', duration: '13s' },
    { id: 5, src: 'https://via.placeholder.com/65/00FF00/FFFFFF?text=NFT5', size: 'w-16 h-16', delay: '8s', duration: '10s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nfts.map(nft => (
        <img
          key={nft.id}
          src={nft.src}
          alt="floating nft"
          className={`absolute rounded-lg object-cover floating-nft ${nft.size}`}
          style={{
            animationDelay: nft.delay,
            animationDuration: nft.duration,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingNFTs;


