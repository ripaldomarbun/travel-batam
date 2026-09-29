/**
 * Utility for dynamically updating SEO metadata and Open Graph tags for social sharing previews.
 */
export interface MetaTagOptions {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: string;
}

export function updateMetaTags({
  title,
  description,
  imageUrl,
  url,
  type = 'website'
}: MetaTagOptions): void {
  // 1. Update Document Title
  document.title = title;

  // Helper to set or create meta elements
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Search Engine Descriptions
  setMeta('name', 'description', description);

  // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn, Discord, Telegram, iMessage)
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type);

  // 4. Twitter / X Card Tags
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:card', 'summary_large_image');

  // 5. Canonical / Share URL
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  if (currentUrl) {
    setMeta('property', 'og:url', currentUrl);
  }

  // 6. Social Share Preview Image
  if (imageUrl) {
    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : typeof window !== 'undefined'
      ? `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
      : imageUrl;

    setMeta('property', 'og:image', fullImageUrl);
    setMeta('name', 'twitter:image', fullImageUrl);
  }
}
