import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportWidget } from './SupportWidget';

describe('SupportWidget', () => {
     const mockDiscordUrl = 'https://discord.gg/test-community';

     it('should render the support button with default text', () => {
          render(<SupportWidget discordUrl={mockDiscordUrl} />);

          const button = screen.getByTestId('support-button');
          expect(button).toHaveTextContent('Join our Caregiver Support Group');
     });

     it('should render custom button text when provided', () => {
          render(
               <SupportWidget
                    discordUrl={mockDiscordUrl}
                    buttonText="Connect with Community"
               />
          );

          const button = screen.getByTestId('support-button');
          expect(button).toHaveTextContent('Connect with Community');
     });

     it('should open Discord link in new tab', () => {
          render(<SupportWidget discordUrl={mockDiscordUrl} />);

          const button = screen.getByTestId('support-button');
          expect(button).toHaveAttribute('href', mockDiscordUrl);
          expect(button).toHaveAttribute('target', '_blank');
          expect(button).toHaveAttribute('rel', 'noopener noreferrer');
     });

     it('should have accessible link attributes', () => {
          render(<SupportWidget discordUrl={mockDiscordUrl} />);

          const button = screen.getByRole('link');
          expect(button).toBeInTheDocument();
     });
});
