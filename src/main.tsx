import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { SCENARIOS } from './data/scenarios';
import type { Role, Scenario } from './data/types';
import { useStore } from './store/useStore';
import { initialTheme } from './lib/theme';

// Seed state from ?scenario=&role= before the first render, so deep links resolve (deterministic screenshots)
const q = new URLSearchParams(window.location.search);
const scenario = q.get('scenario') as Scenario | null;
if (scenario && SCENARIOS.includes(scenario)) useStore.getState().loadScenario(scenario);
const role = q.get('role') as Role | null;
if (role) useStore.getState().setRole(role);
// A ?theme= link shows that theme without overwriting the viewer's saved choice
useStore.getState().setTheme(initialTheme(window.location.search), false);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
