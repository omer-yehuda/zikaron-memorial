import dynamic from 'next/dynamic';

const MapApp = dynamic(() => import('@/components/MapApp'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a0a0f',
        color: '#f4a261',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '14px',
        letterSpacing: '0.1em',
      }}
    >
      טוען מפה... LOADING MAP...
    </div>
  ),
});

export default function HomePage() {
  return <MapApp />;
}
