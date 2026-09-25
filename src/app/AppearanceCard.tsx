import { Card } from '../components/Card';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { useStore } from '../store/useStore';

/** Theme setting on each role's profile, same control as the desktop panel */
export const AppearanceCard = () => {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-body font-bold text-ink">Appearance</p>
      <ThemeSwitch value={theme} onChange={setTheme} />
    </Card>
  );
};
