'use client';

import dynamic from 'next/dynamic';
import { Box, Text } from '@/components/ui/primitives';

const MapApp = dynamic(() => import('@/components/MapApp'), {
  ssr: false,
  loading: () => (
    <Box className="flex items-center justify-center h-screen bg-bg">
      <Text className="font-mono text-[14px] text-gold tracking-[0.1em]">
        טוען מפה... LOADING MAP...
      </Text>
    </Box>
  ),
});

export default function HomePage() {
  return <MapApp />;
}
