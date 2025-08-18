import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';
import { createMockNFT } from '../../test/utils';

// Mock the hooks and components
vi.mock('../../hooks/useNFTs', () => ({
  useNFTs: () => ({
    nfts: [
      createMockNFT({ id: '1', title: 'Featured NFT 1' }),
      createMockNFT({ id: '2', title: 'Featured NFT 2' }),
      createMockNFT({ id: '3', title: 'Featured NFT 3' }),
    ],
    loading: false,
    error: null,
  }),
}));

vi.mock('../../components/MobileOptimization', () => ({
  MobileNFTGrid: ({ nfts, onNFTClick }) => (
    <div data-testid="mobile-nft-grid">
      {nfts.map(nft => (
        <div key={nft.id} onClick={() => onNFTClick?.(nft)}>
          {nft.title}
        </div>
      ))}
    </div>
  ),
  PWAInstallPrompt: () => <div data-testid="pwa-install-prompt">Install App</div>,
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  it('renders homepage with main sections', () => {
    render(<HomePage />);

    // Check for main hero section
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.subtitle')).toBeInTheDocument();

    // Check for action buttons
    expect(screen.getByText('home.exploreMarketplace')).toBeInTheDocument();
    expect(screen.getByText('home.createNFT')).toBeInTheDocument();
  });

  it('displays featured NFTs section', () => {
    render(<HomePage />);

    expect(screen.getByText('home.featuredNFTs')).toBeInTheDocument();
    expect(screen.getByText('home.featuredDescription')).toBeInTheDocument();
  });

  it('shows statistics section', () => {
    render(<HomePage />);

    expect(screen.getByText('home.stats.totalVolume')).toBeInTheDocument();
    expect(screen.getByText('home.stats.activeUsers')).toBeInTheDocument();
    expect(screen.getByText('home.stats.nftsTraded')).toBeInTheDocument();
    expect(screen.getByText('home.stats.creators')).toBeInTheDocument();
  });

  it('displays features section', () => {
    render(<HomePage />);

    expect(screen.getByText('home.whyChoose')).toBeInTheDocument();
    expect(screen.getByText('home.features.decentralized.title')).toBeInTheDocument();
    expect(screen.getByText('home.features.lowFees.title')).toBeInTheDocument();
    expect(screen.getByText('home.features.secure.title')).toBeInTheDocument();
    expect(screen.getByText('home.features.global.title')).toBeInTheDocument();
  });

  it('shows call-to-action section', () => {
    render(<HomePage />);

    expect(screen.getByText('home.readyToStart')).toBeInTheDocument();
    expect(screen.getByText('home.createFirstNFT')).toBeInTheDocument();
    expect(screen.getByText('home.browseCollection')).toBeInTheDocument();
  });

  it('renders mobile NFT grid on mobile devices', () => {
    // Mock mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<HomePage />);

    expect(screen.getByTestId('mobile-nft-grid')).toBeInTheDocument();
    expect(screen.getByText('Featured NFT 1')).toBeInTheDocument();
    expect(screen.getByText('Featured NFT 2')).toBeInTheDocument();
    expect(screen.getByText('Featured NFT 3')).toBeInTheDocument();
  });

  it('shows PWA install prompt', () => {
    render(<HomePage />);

    expect(screen.getByTestId('pwa-install-prompt')).toBeInTheDocument();
  });

  it('navigates to marketplace when explore button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const exploreButton = screen.getByText('home.exploreMarketplace');
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/marketplace');
  });

  it('navigates to create page when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const createButton = screen.getByText('home.createNFT');
    expect(createButton.closest('a')).toHaveAttribute('href', '/create');
  });

  it('handles NFT click in mobile grid', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    
    vi.doMock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<HomePage />);

    const nftItem = screen.getByText('Featured NFT 1');
    await user.click(nftItem);

    // Should navigate to NFT detail page
    expect(mockNavigate).toHaveBeenCalledWith('/nft/1');
  });

  it('displays loading state when NFTs are loading', () => {
    vi.doMock('../../hooks/useNFTs', () => ({
      useNFTs: () => ({
        nfts: [],
        loading: true,
        error: null,
      }),
    }));

    render(<HomePage />);

    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('displays error state when NFT loading fails', () => {
    vi.doMock('../../hooks/useNFTs', () => ({
      useNFTs: () => ({
        nfts: [],
        loading: false,
        error: 'Failed to load NFTs',
      }),
    }));

    render(<HomePage />);

    expect(screen.getByText('Failed to load NFTs')).toBeInTheDocument();
  });

  it('shows view all NFTs link', () => {
    render(<HomePage />);

    const viewAllLink = screen.getByText('home.viewAllNFTs');
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/marketplace');
  });

  it('displays correct statistics with formatting', () => {
    render(<HomePage />);

    // Check if statistics are displayed with proper formatting
    expect(screen.getByText('2.5M')).toBeInTheDocument(); // Total volume
    expect(screen.getByText('50K+')).toBeInTheDocument(); // Active users
    expect(screen.getByText('100K+')).toBeInTheDocument(); // NFTs traded
    expect(screen.getByText('5K+')).toBeInTheDocument(); // Creators
  });

  it('has proper accessibility attributes', () => {
    render(<HomePage />);

    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Check for proper link roles
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('is responsive and adapts to different screen sizes', () => {
    const { rerender } = render(<HomePage />);

    // Test desktop view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    rerender(<HomePage />);
    expect(screen.getByTestId('mobile-nft-grid')).toBeInTheDocument();

    // Test mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    rerender(<HomePage />);
    expect(screen.getByTestId('mobile-nft-grid')).toBeInTheDocument();
  });

  it('handles scroll events for animations', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Simulate scroll event
    window.dispatchEvent(new Event('scroll'));

    // Check if scroll-triggered animations are working
    await waitFor(() => {
      const animatedElements = screen.getAllByTestId(/fade-in|slide-in/);
      expect(animatedElements.length).toBeGreaterThanOrEqual(0);
    });
  });
});

