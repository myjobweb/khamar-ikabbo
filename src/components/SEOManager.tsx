import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SEOManager: React.FC = () => {
  const { currentRoute, selectedProduct, selectedGuide, siteSettings } = useApp();

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;

    // 1. Determine Title, Description, and Indexing based on current route
    let title = siteSettings.bengaliName ? `${siteSettings.bengaliName} — ${siteSettings.tagline || 'খামারের যত্নে, খামারির পাশে'}` : 'খামারি কাব্য — গরুর খাদ্য, ফিড, সাপ্লিমেন্ট ও ঔষধ';
    let description = 'খামারি কাব্য থেকে গরুর খাদ্য, ফিড কাঁচামাল, সাপ্লিমেন্ট, ঔষধ ও কম্বিনেশন পণ্য সহজে অর্ডার করুন। খামারিদের জন্য প্রয়োজনীয় তথ্য ও গাইড এক জায়গায়।';
    let canonical = `${baseUrl}/#/${currentRoute}`;
    let noindex = false;
    let imageUrl = selectedProduct?.image || siteSettings.heroImage || `${baseUrl}/favicon.ico`;
    let jsonLdType = 'WebSite';
    let jsonLdData: any = null;

    if (selectedProduct) {
      title = `${selectedProduct.nameBn} — খামারি কাব্য`;
      description = selectedProduct.shortDescBn || description;
      canonical = `${baseUrl}/#/product/${selectedProduct.slug || selectedProduct.id}`;
      imageUrl = selectedProduct.image;
      jsonLdType = 'Product';
      jsonLdData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: selectedProduct.nameBn,
        image: [imageUrl],
        description: selectedProduct.shortDescBn,
        sku: selectedProduct.sku || selectedProduct.id,
        brand: {
          '@type': 'Brand',
          name: 'খামারি কাব্য'
        },
        offers: {
          '@type': 'Offer',
          url: canonical,
          priceCurrency: 'BDT',
          price: selectedProduct.price,
          availability: selectedProduct.inStock && selectedProduct.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition'
        }
      };
    } else if (selectedGuide) {
      title = `${selectedGuide.titleBn} — খামারি কাব্য গাইড`;
      description = selectedGuide.summaryBn || description;
      canonical = `${baseUrl}/#/guide/${selectedGuide.slug}`;
      imageUrl = selectedGuide.image;
      jsonLdType = 'Article';
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: selectedGuide.titleBn,
        image: [imageUrl],
        author: {
          '@type': 'Person',
          name: selectedGuide.author || 'খামারি কাব্য এক্সপার্ট টিম'
        },
        publisher: {
          '@type': 'Organization',
          name: 'খামারি কাব্য',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.ico`
          }
        },
        description: selectedGuide.summaryBn
      };
    } else {
      switch (currentRoute) {
        case 'home':
          title = siteSettings.bengaliName ? `${siteSettings.bengaliName} — ${siteSettings.tagline || 'গরুর খাদ্য, ফিড, সাপ্লিমেন্ট ও ঔষধ'}` : 'খামারি কাব্য — গরুর খাদ্য, ফিড, সাপ্লিমেন্ট ও ঔষধ';
          canonical = `${baseUrl}/`;
          jsonLdData = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'খামারি কাব্য',
            alternateName: 'Khamari Kabbo',
            url: baseUrl,
            logo: `${baseUrl}/favicon.ico`,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: siteSettings.hotlinePhone,
              contactType: 'customer service',
              areaServed: 'BD',
              availableLanguage: ['Bengali', 'English']
            },
            sameAs: [siteSettings.facebookUrl].filter(Boolean)
          };
          break;
        case 'feed':
          title = 'রেডিমেড ফিড — খামারি কাব্য';
          description = 'উচ্চ পুষ্টিগুণসম্পন্ন গরুর রেডিমেড ফিড, মোটাতাজাকরণ ও ডেইরি ফিড সাশ্রয়ী মূল্যে অর্ডার করুন।';
          canonical = `${baseUrl}/#/feed`;
          break;
        case 'feed-motatajakaron':
          title = 'গরু মোটাতাজাকরণ ফিড — খামারি কাব্য';
          description = 'বিজ্ঞানসম্মত উপায়ে গরু দ্রুত মোটাতাজাকরণের জন্য সেরা পুষ্টিকর ফিড।';
          canonical = `${baseUrl}/#/feed-motatajakaron`;
          break;
        case 'feed-shar':
          title = 'ষাঁড় গরুর ফিড — খামারি কাব্য';
          description = 'কোরবানি ও মাংস উৎপাদনের জন্য পুষ্টিকর ষাঁড় গরুর ফিড।';
          canonical = `${baseUrl}/#/feed-shar`;
          break;
        case 'feed-gavi':
          title = 'গাভীর ফিড ও দুধ বাড়ানোর খাদ্য — খামারি কাব্য';
          description = 'দুধ উৎপাদন বাড়াতে এবং গাভীর স্বাস্থ্য সুরক্ষায় বিশেষ ডেইরি ফিড।';
          canonical = `${baseUrl}/#/feed-gavi`;
          break;
        case 'raw-materials':
          title = 'ফিড কাঁচামাল ও দানাদার খাদ্য — খামারি কাব্য';
          description = 'ভুট্টার গুঁড়া, গমের ভুসি, চালের কুঁড়া, খৈল ও উচ্চ প্রোটিনসমৃদ্ধ ফিড কাঁচামাল।';
          canonical = `${baseUrl}/#/raw-materials`;
          break;
        case 'supplements':
          title = 'ভিটামিন ও খনিজ সাপ্লিমেন্ট — খামারি কাব্য';
          description = 'মিনারেল মিক্সচার, ক্যালসিয়াম ও ভিটামিন সাপ্লিমেন্ট যা গরুর রোগ প্রতিরোধ ক্ষমতা বাড়ায়।';
          canonical = `${baseUrl}/#/supplements`;
          break;
        case 'medicines':
          title = 'পশু চিকিৎসায় ভেটেরিনারি ঔষধ — খামারি কাব্য';
          description = 'কৃমিনাশক, হজমবর্ধक এবং গবাদিপশুর প্রয়োজনীয় ভেটেরিনারি ওষুধ।';
          canonical = `${baseUrl}/#/medicines`;
          break;
        case 'combinations':
          title = 'কম্বিনেশন প্যাকেজ ও সাশ্রয়ী কম্বো — খামারি কাব্য';
          description = 'ফিড ও সাপ্লিমেন্টের বিশেষ কম্বো প্যাকেজ ক্রয়ে সর্বোচ্চ সাশ্রয় ও ফ্রি হোম ডেলিভারি।';
          canonical = `${baseUrl}/#/combinations`;
          break;
        case 'guides':
          title = 'খামারি গাইড ও বিশেষজ্ঞ পরামর্শ — খামারি কাব্য';
          description = 'গরু পালন, সঠিক খাদ্য তালিকা, মোটাতাজাকরণ ও রোগ প্রতিরোধে খামারিদের জন্য দরকারি গাইড।';
          canonical = `${baseUrl}/#/guides`;
          break;
        case 'contact':
          title = 'যোগাযোগ ও হেল্পলাইন — খামারি কাব্য';
          description = 'যেকোনো প্রয়োজনে খামারি কাব্য হটলাইন নম্বরে কল করুন অথবা WhatsApp এ মেসেজ পাঠান।';
          canonical = `${baseUrl}/#/contact`;
          break;
        case 'cart':
        case 'checkout':
        case 'order-success':
        case 'track-order':
        case 'search':
        case 'admin':
          noindex = true;
          if (currentRoute === 'cart') title = 'শপিং কার্ট — খামারি কাব্য';
          if (currentRoute === 'checkout') title = 'অর্ডার চেকআউট — খামারি কাব্য';
          if (currentRoute === 'order-success') title = 'অর্ডার সফল হয়েছে — খামারি কাব্য';
          if (currentRoute === 'track-order') title = 'অর্ডার ট্র্যাক করুন — খামারি কাব্য';
          if (currentRoute === 'search') title = 'পণ্য অনুসন্ধান — খামারি কাব্য';
          if (currentRoute === 'admin') title = 'অ্যাডমিন ড্যাশবোর্ড — খামারি কাব্য';
          break;
        default:
          title = 'খামারি কাব্য — খামারের যত্নে, খামারির পাশে';
          break;
      }
    }

    // Apply to Document
    document.title = title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    const setOgMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:url', canonical);
    setOgMeta('og:type', selectedProduct ? 'product' : selectedGuide ? 'article' : 'website');
    setOgMeta('og:image', imageUrl);
    setOgMeta('og:locale', 'bn_BD');
    setOgMeta('og:site_name', 'খামারি কাব্য');

    // Twitter Card
    const setTwitterMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', title);
    setTwitterMeta('twitter:description', description);
    setTwitterMeta('twitter:image', imageUrl);

    // Structured Data JSON-LD
    let scriptLd = document.querySelector('#seo-json-ld');
    if (!scriptLd) {
      scriptLd = document.createElement('script');
      scriptLd.setAttribute('id', 'seo-json-ld');
      scriptLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptLd);
    }
    if (jsonLdData) {
      scriptLd.textContent = JSON.stringify(jsonLdData);
    } else {
      scriptLd.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'খামারি কাব্য',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/#/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      });
    }

  }, [currentRoute, selectedProduct, selectedGuide, siteSettings]);

  return null;
};
