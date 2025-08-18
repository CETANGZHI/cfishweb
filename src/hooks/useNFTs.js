import { useState, useEffect } from 'react';
import { mockAPI } from '../data/mockData';

export const useNFTs = (filters = {}) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mockAPI.getNFTs(filters);
        setNfts(data);
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
      const updatedNFT = await mockAPI.toggleLike(nftId);
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === nftId ? updatedNFT : nft
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const toggleCart = (nftId) => {
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
          const data = await mockAPI.getNFTs(filters);
          setNfts(data);
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
        const data = await mockAPI.getNFTById(nftId);
        setNft(data);
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

