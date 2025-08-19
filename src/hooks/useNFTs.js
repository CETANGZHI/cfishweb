import { useState, useEffect } from 'react';
import { nftApi } from '../utils/api';

export const useNFTs = (filters = {}) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await nftApi.getNFTs(filters);
        setNfts(response.data.nfts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [JSON.stringify(filters)]);

  const toggleLike = async (nftId) => {
    try {
      // Assuming the backend returns the updated NFT or a success message
      await nftApi.likeNFT(nftId);
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === nftId ? { ...nft, likes_count: nft.likes_count + 1, isLiked: true } : nft
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const toggleCart = (nftId) => {
    // This is a frontend-only mock for now, as cart API is not fully integrated
    setNfts(prevNfts => 
      prevNfts.map(nft => 
        nft.id === nftId 
          ? { ...nft, inCart: !nft.inCart }
          : nft
      )
    );
  };

  return {
    nfts,
    loading,
    error,
    toggleLike,
    toggleCart,
    refetch: () => {
      const fetchNFTs = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await nftApi.getNFTs(filters);
          setNfts(response.data.nfts);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchNFTs();
    }
  };
};

export const useNFTDetail = (nftId) => {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await nftApi.getNFTById(nftId);
        setNft(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchNFT();
    }
  }, [nftId]);

  return { nft, loading, error };
};

