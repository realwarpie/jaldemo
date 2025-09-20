import { ThemeProvider } from '../ThemeProvider';
import { Button } from '@/components/ui/button';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="p-4 space-y-4">
        <p className="text-foreground">Theme provider is active</p>
        <Button>Example button</Button>
      </div>
    </ThemeProvider>
  );
}