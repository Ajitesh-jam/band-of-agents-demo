import { Dashboard } from '@/components/dashboard';
import { CrashGuard } from '@/components/crash-guard';

export const metadata = {
  title: 'Band of Agents - Hackathon Demo',
  description: 'A demo app for BAND OF AGENTS hackathon',
};

export default function Page() {
  return (
    <CrashGuard>
      <Dashboard />
    </CrashGuard>
  );
}

