import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useTheme } from 'next-themes';
import type { CurrencyCode } from '@/types';

const currencyCodes: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'NGN', label: 'NGN - Nigerian Naira' },
];

const locales = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-FR', label: 'Français (France)' },
];

const weekStartDays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
];

export const ProfilePreferences = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();

  const handleCurrencyChange = (value: string) => {
    updatePreferences({ defaultCurrency: value as CurrencyCode });
  };

  const handleLocaleChange = (value: string) => {
    updatePreferences({ locale: value });
  };

  const handleWeekStartChange = (value: string) => {
    updatePreferences({ weekStartsOn: Number(value) as 0 | 1 });
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="default-currency">Default Currency</Label>
          <Select
            value={preferences?.defaultCurrency || 'USD'}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyCodes.map((cc) => (
                <SelectItem key={cc.value} value={cc.value}>
                  {cc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="locale">Language & Region</Label>
          <Select
            value={preferences?.locale || 'en-US'}
            onValueChange={handleLocaleChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select locale" />
            </SelectTrigger>
            <SelectContent>
              {locales.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="week-start">Week Starts On</Label>
          <Select
            value={String(preferences?.weekStartsOn || 0)}
            onValueChange={handleWeekStartChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {weekStartDays.map((day) => (
                <SelectItem key={day.value} value={String(day.value)}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={handleThemeToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};