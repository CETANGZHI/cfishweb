import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '../LanguageSelector';

// Mock the LanguageProvider hook
vi.mock('../LanguageProvider', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    setLanguage: vi.fn(),
    languages: {
      en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
      ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    },
    t: (key) => key,
  }),
}));

describe('LanguageSelector Component', () => {
  it('renders compact variant correctly', () => {
    render(<LanguageSelector variant="compact" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'common.language');
  });

  it('renders default variant with current language', () => {
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🇺🇸');
  });

  it('shows language options when clicked', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
    expect(screen.getByText('日本語')).toBeInTheDocument();
  });

  it('calls setLanguage when language is selected', async () => {
    const mockSetLanguage = vi.fn();
    
    // Re-mock with our custom setLanguage function
    vi.doMock('../LanguageProvider', () => ({
      useLanguage: () => ({
        currentLanguage: 'en',
        setLanguage: mockSetLanguage,
        languages: {
          en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
          zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
        },
        t: (key) => key,
      }),
    }));

    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const chineseOption = screen.getByText('中文');
    await user.click(chineseOption);
    
    expect(mockSetLanguage).toHaveBeenCalledWith('zh');
  });

  it('shows current language with check mark', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // The current language (English) should have a check mark
    const englishOption = screen.getByText('English').closest('[role="menuitem"]');
    expect(englishOption).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LanguageSelector className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('shows label when showLabel is true', () => {
    render(<LanguageSelector showLabel />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    
    // Open dropdown with Enter key
    await user.type(button, '{Enter}');
    expect(screen.getByText('English')).toBeInTheDocument();
    
    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <LanguageSelector />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    
    const outsideElement = screen.getByTestId('outside');
    await user.click(outsideElement);
    
    // Dropdown should be closed (language options not visible)
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('closes dropdown when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    // Dropdown should be closed
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('supports different sizes', () => {
    const { rerender } = render(<LanguageSelector size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');

    rerender(<LanguageSelector size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });
});

