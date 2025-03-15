import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';

export const alt = 'M.T.R.E. Giardinaggio - Galleria';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #15803d, #166534)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: '20px' }}>
          M.T.R.E. Giardinaggio
        </div>
        <div style={{ fontSize: 48, textAlign: 'center' }}>
          {t('title')}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 