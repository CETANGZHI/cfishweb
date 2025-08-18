// Mock data for CFISH platform

export const mockNFTs = [
  {
    id: 1,
    title: "Cosmic Whale #001",
    creator: "ArtistDAO",
    creatorAvatar: "/api/placeholder/40/40",
    price: "2.5 SOL",
    priceUSD: "$125",
    priceType: "fixed",
    category: "art",
    likes: 234,
    views: 1205,
    isLiked: false,
    inCart: false,
    tags: ["Digital Art", "Abstract", "Cosmic"],
    rarity: "Rare",
    commission: "5%",
    description: "A stunning digital artwork featuring a cosmic whale swimming through the stars. This piece represents the harmony between nature and the universe.",
    properties: [
      { trait: "Background", value: "Cosmic", rarity: "15%" },
      { trait: "Color Scheme", value: "Blue-Purple", rarity: "25%" },
      { trait: "Style", value: "Abstract", rarity: "30%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "ArtistDAO", date: "2024-01-15" },
      { event: "Listed", price: "2.5 SOL", from: "ArtistDAO", to: null, date: "2024-01-16" }
    ],
    image: "/api/placeholder/400/400"
  },
  {
    id: 2,
    title: "Digital Dreams",
    creator: "CryptoVision",
    creatorAvatar: "/api/placeholder/40/40",
    price: "1,500 CFISH",
    priceUSD: "$75",
    priceType: "fixed",
    category: "art",
    likes: 189,
    views: 892,
    isLiked: true,
    inCart: false,
    tags: ["Surreal", "Dreams", "Digital"],
    rarity: "Common",
    commission: "3%",
    description: "An ethereal journey through the digital dreamscape, where reality and imagination merge into one beautiful vision.",
    properties: [
      { trait: "Theme", value: "Dreams", rarity: "40%" },
      { trait: "Technique", value: "Digital Painting", rarity: "60%" },
      { trait: "Mood", value: "Ethereal", rarity: "20%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "CryptoVision", date: "2024-01-10" },
      { event: "Listed", price: "1,500 CFISH", from: "CryptoVision", to: null, date: "2024-01-11" }
    ],
    image: "/api/placeholder/400/400"
  },
  {
    id: 3,
    title: "Neon City #42",
    creator: "FutureArt",
    creatorAvatar: "/api/placeholder/40/40",
    price: "3.8 SOL",
    priceUSD: "$190",
    priceType: "auction",
    category: "art",
    likes: 456,
    views: 2341,
    isLiked: false,
    inCart: true,
    tags: ["Cyberpunk", "City", "Neon"],
    rarity: "Epic",
    commission: "7%",
    description: "A cyberpunk cityscape illuminated by neon lights, depicting the future of urban life in a digital age.",
    properties: [
      { trait: "Setting", value: "Cyberpunk City", rarity: "8%" },
      { trait: "Lighting", value: "Neon", rarity: "12%" },
      { trait: "Time", value: "Night", rarity: "35%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "FutureArt", date: "2024-01-08" },
      { event: "Auction Started", price: "3.8 SOL", from: "FutureArt", to: null, date: "2024-01-09" }
    ],
    image: "/api/placeholder/400/400",
    auctionEndTime: "2024-02-01T12:00:00Z",
    currentBid: "3.8 SOL",
    bidders: 12
  },
  {
    id: 4,
    title: "Melodic Waves",
    creator: "SoundMaster",
    creatorAvatar: "/api/placeholder/40/40",
    price: "1.2 SOL",
    priceUSD: "$60",
    priceType: "fixed",
    category: "music",
    likes: 123,
    views: 567,
    isLiked: false,
    inCart: false,
    tags: ["Electronic", "Ambient", "Waves"],
    rarity: "Uncommon",
    commission: "4%",
    description: "An ambient electronic composition that captures the essence of ocean waves through digital soundscapes.",
    properties: [
      { trait: "Genre", value: "Ambient Electronic", rarity: "25%" },
      { trait: "Duration", value: "3:45", rarity: "50%" },
      { trait: "BPM", value: "120", rarity: "30%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "SoundMaster", date: "2024-01-12" },
      { event: "Listed", price: "1.2 SOL", from: "SoundMaster", to: null, date: "2024-01-13" }
    ],
    image: "/api/placeholder/400/400",
    audioPreview: "/api/audio/melodic-waves-preview.mp3"
  },
  {
    id: 5,
    title: "Pixel Warriors",
    creator: "GameDev Studio",
    creatorAvatar: "/api/placeholder/40/40",
    price: "800 CFISH",
    priceUSD: "$40",
    priceType: "barter",
    category: "gaming",
    likes: 345,
    views: 1789,
    isLiked: true,
    inCart: false,
    tags: ["Gaming", "Pixel Art", "Warriors"],
    rarity: "Rare",
    commission: "6%",
    description: "Retro-style pixel art warriors ready for battle in the digital realm. Perfect for gaming enthusiasts and collectors.",
    properties: [
      { trait: "Class", value: "Warrior", rarity: "20%" },
      { trait: "Weapon", value: "Sword", rarity: "35%" },
      { trait: "Armor", value: "Legendary", rarity: "5%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "GameDev Studio", date: "2024-01-05" },
      { event: "Listed for Barter", price: "800 CFISH", from: "GameDev Studio", to: null, date: "2024-01-06" }
    ],
    image: "/api/placeholder/400/400",
    barterOffers: [
      { from: "PixelCollector", offer: "Cyber Knight #23", status: "pending" },
      { from: "RetroGamer", offer: "Magic Sword +5", status: "declined" }
    ]
  },
  {
    id: 6,
    title: "Sunset Landscape",
    creator: "PhotoPro",
    creatorAvatar: "/api/placeholder/40/40",
    price: "2.1 SOL",
    priceUSD: "$105",
    priceType: "auction",
    category: "photography",
    likes: 278,
    views: 1456,
    isLiked: false,
    inCart: false,
    tags: ["Photography", "Landscape", "Sunset"],
    rarity: "Rare",
    commission: "5%",
    description: "A breathtaking sunset landscape captured at the perfect moment when day meets night.",
    properties: [
      { trait: "Location", value: "Mountain Peak", rarity: "15%" },
      { trait: "Time", value: "Golden Hour", rarity: "25%" },
      { trait: "Weather", value: "Clear", rarity: "40%" }
    ],
    history: [
      { event: "Minted", price: null, from: null, to: "PhotoPro", date: "2024-01-07" },
      { event: "Auction Started", price: "2.1 SOL", from: "PhotoPro", to: null, date: "2024-01-08" }
    ],
    image: "/api/placeholder/400/400",
    auctionEndTime: "2024-01-25T18:00:00Z",
    currentBid: "2.1 SOL",
    bidders: 8
  }
];

export const mockUsers = [
  {
    id: 1,
    username: "ArtistDAO",
    displayName: "Artist DAO",
    avatar: "/api/placeholder/100/100",
    bio: "Digital artist exploring the intersection of technology and creativity",
    verified: true,
    followers: 1234,
    following: 567,
    totalSales: "45.2 SOL",
    nftsOwned: 23,
    nftsCreated: 15,
    joinDate: "2023-06-15",
    socialLinks: {
      twitter: "@artistdao",
      instagram: "@artistdao_official",
      website: "https://artistdao.com"
    }
  },
  {
    id: 2,
    username: "CryptoVision",
    displayName: "Crypto Vision",
    avatar: "/api/placeholder/100/100",
    bio: "Visionary digital artist creating the future of NFT art",
    verified: false,
    followers: 892,
    following: 234,
    totalSales: "28.7 SOL",
    nftsOwned: 45,
    nftsCreated: 32,
    joinDate: "2023-08-22",
    socialLinks: {
      twitter: "@cryptovision",
      website: "https://cryptovision.art"
    }
  }
];

export const mockCollections = [
  {
    id: 1,
    name: "Cosmic Whales",
    creator: "ArtistDAO",
    description: "A collection of majestic cosmic whales swimming through the digital universe",
    floorPrice: "2.1 SOL",
    totalVolume: "156.8 SOL",
    items: 100,
    owners: 67,
    banner: "/api/placeholder/800/300",
    avatar: "/api/placeholder/100/100",
    verified: true,
    category: "art"
  },
  {
    id: 2,
    name: "Neon Cities",
    creator: "FutureArt",
    description: "Cyberpunk cityscapes illuminated by neon dreams",
    floorPrice: "3.2 SOL",
    totalVolume: "234.5 SOL",
    items: 50,
    owners: 42,
    banner: "/api/placeholder/800/300",
    avatar: "/api/placeholder/100/100",
    verified: true,
    category: "art"
  }
];

export const mockTransactions = [
  {
    id: 1,
    type: "purchase",
    nft: mockNFTs[0],
    from: "seller123",
    to: "buyer456",
    price: "2.5 SOL",
    priceUSD: "$125",
    timestamp: "2024-01-20T10:30:00Z",
    txHash: "0x1234567890abcdef",
    status: "completed"
  },
  {
    id: 2,
    type: "bid",
    nft: mockNFTs[2],
    from: "bidder789",
    to: null,
    price: "4.0 SOL",
    priceUSD: "$200",
    timestamp: "2024-01-20T09:15:00Z",
    txHash: "0xabcdef1234567890",
    status: "pending"
  }
];

export const mockNotifications = [
  {
    id: 1,
    type: "bid",
    title: "New bid on your NFT",
    message: "Someone placed a bid of 4.0 SOL on Neon City #42",
    timestamp: "2024-01-20T10:30:00Z",
    read: false,
    nftId: 3
  },
  {
    id: 2,
    type: "sale",
    title: "NFT sold successfully",
    message: "Your NFT Cosmic Whale #001 has been sold for 2.5 SOL",
    timestamp: "2024-01-20T09:15:00Z",
    read: false,
    nftId: 1
  },
  {
    id: 3,
    type: "follow",
    title: "New follower",
    message: "CryptoCollector started following you",
    timestamp: "2024-01-19T18:45:00Z",
    read: true,
    userId: 2
  }
];

export const mockStakingData = {
  totalStaked: "50,000 CFISH",
  totalStakedUSD: "$2,500",
  stakingAPY: "12.5%",
  userStaked: "1,250 CFISH",
  userStakedUSD: "$62.50",
  pendingRewards: "15.6 CFISH",
  pendingRewardsUSD: "$0.78",
  stakingPools: [
    {
      id: 1,
      name: "CFISH Staking Pool",
      apy: "12.5%",
      totalStaked: "50,000 CFISH",
      userStaked: "1,250 CFISH",
      lockPeriod: "30 days",
      status: "active"
    },
    {
      id: 2,
      name: "NFT-CFISH LP Pool",
      apy: "18.2%",
      totalStaked: "25,000 LP",
      userStaked: "500 LP",
      lockPeriod: "90 days",
      status: "active"
    }
  ]
};

export const mockGovernanceProposals = [
  {
    id: 1,
    title: "Reduce platform fees from 2% to 1.5%",
    description: "Proposal to reduce the platform trading fees to increase user adoption and trading volume",
    proposer: "CommunityDAO",
    status: "active",
    votesFor: 15420,
    votesAgainst: 3280,
    totalVotes: 18700,
    quorum: 20000,
    endTime: "2024-02-01T12:00:00Z",
    category: "fees"
  },
  {
    id: 2,
    title: "Add support for Ethereum NFTs",
    description: "Proposal to add cross-chain support for Ethereum-based NFTs on the CFISH platform",
    proposer: "TechTeam",
    status: "pending",
    votesFor: 8750,
    votesAgainst: 2100,
    totalVotes: 10850,
    quorum: 20000,
    endTime: "2024-02-15T12:00:00Z",
    category: "features"
  }
];

// API simulation functions
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // NFT operations
  async getNFTs(filters = {}) {
    await delay(500);
    let filteredNFTs = [...mockNFTs];
    
    if (filters.category && filters.category !== 'all') {
      filteredNFTs = filteredNFTs.filter(nft => nft.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredNFTs = filteredNFTs.filter(nft => 
        nft.title.toLowerCase().includes(searchLower) ||
        nft.creator.toLowerCase().includes(searchLower) ||
        nft.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return filteredNFTs;
  },

  async getNFTById(id) {
    await delay(300);
    return mockNFTs.find(nft => nft.id === parseInt(id));
  },

  async toggleLike(nftId) {
    await delay(200);
    const nft = mockNFTs.find(n => n.id === nftId);
    if (nft) {
      nft.isLiked = !nft.isLiked;
      nft.likes += nft.isLiked ? 1 : -1;
    }
    return nft;
  },

  // User operations
  async getUserProfile(userId) {
    await delay(300);
    return mockUsers.find(user => user.id === userId);
  },

  async getNotifications() {
    await delay(400);
    return mockNotifications;
  },

  // Staking operations
  async getStakingData() {
    await delay(500);
    return mockStakingData;
  },

  // Governance operations
  async getGovernanceProposals() {
    await delay(600);
    return mockGovernanceProposals;
  },

  // Transaction operations
  async getTransactionHistory() {
    await delay(400);
    return mockTransactions;
  }
};

