'use client';

import { usePathname } from 'next/navigation';
import SageNav from './SageNav';

export default function ClientNavWrapper() {
  const pathname = usePathname();
  const showNav = !pathname?.startsWith('/auth');

  return showNav ? <SageNav /> : null;
}
