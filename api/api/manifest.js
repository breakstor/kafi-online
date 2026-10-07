export default async function handler(req, res) {
  const slug = req.query.slug || '';
  const SUPABASE_URL = 'https://kmkthmaztyhhvxkousmd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_BcEbJczP_CqFlwUwqQrPXA_JjywBSV5';

  if (!slug) {
    return res.status(200).json({
      name: 'كافي أونلاين',
      short_name: 'كافي',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#6366F1',
      icons: [
        { src: '/icons/Icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/Icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/online_store_settings?slug=eq.${encodeURIComponent(slug)}&select=store_name,logo_url,slug,primary_color,description&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    const store = (data && data.length > 0) ? data[0] : null;

    const storeName = store ? (store.store_name || 'كافي أونلاين') : 'كافي أونلاين';
    const logoUrl = store ? store.logo_url : null;
    const primaryColor = store ? (store.primary_color || '#6366F1') : '#6366F1';
    const desc = store ? (store.description || `تسوق مباشرة من متجر ${storeName}`) : 'تسوق بسهولة من متجرك المفضل';
    const startUrl = `/${slug}`;

    const icons = logoUrl
      ? [
          { src: logoUrl, sizes: '192x192', type: 'image/png' },
          { src: logoUrl, sizes: '512x512', type: 'image/png' },
          { src: logoUrl, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: logoUrl, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      : [
          { src: '/icons/Icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/Icon-512.png', sizes: '512x512', type: 'image/png' }
        ];

    const manifest = {
      name: storeName,
      short_name: storeName,
      start_url: startUrl,
      scope: startUrl,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: primaryColor,
      description: desc,
      orientation: 'portrait-primary',
      lang: 'ar',
      dir: 'rtl',
      icons: icons
    };

    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(manifest);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
