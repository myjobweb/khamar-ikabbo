import { Category, Product, GuideArticle, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    nameBn: 'রেডিমেড ফিড',
    nameEn: 'Ready-made Feed',
    slug: 'feed',
    descriptionBn: 'গবাদিপশুর প্রয়োজন অনুযায়ী বিভিন্ন ধরনের প্রস্তুত সুষম দানাদার খাদ্য',
    icon: 'Wheat',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'sub-1',
        slug: 'motatajakaron',
        nameBn: 'গরু মোটাতাজাকরণ ফিড',
        descriptionBn: 'দ্রুত মাংস ও ওজন বৃদ্ধির জন্য বিশেষ হাই-প্রোটিন পেলিট ও ম্যাশ ফিড'
      },
      {
        id: 'sub-2',
        slug: 'shar',
        nameBn: 'ষাঁড় গরুর ফিড',
        descriptionBn: 'কুরবানি ষাঁড় ও প্রজনন ষাঁড়ের দৈহিক গঠন ও শক্তির জন্য শক্তিশালী ফিড'
      },
      {
        id: 'sub-3',
        slug: 'gavi',
        nameBn: 'গাভীর ফিড',
        descriptionBn: 'দুগ্ধবতী গাভীর দুধের উৎপাদন বৃদ্ধি ও ফ্যাট বৃদ্ধির পুষ্টিকর খাদ্য'
      }
    ]
  },
  {
    id: 'cat-2',
    nameBn: 'ফিড কাঁচামাল',
    nameEn: 'Raw Materials',
    slug: 'raw-materials',
    descriptionBn: 'খামারের খাদ্য তৈরির প্রয়োজনীয় বিভিন্ন খাঁটি ও উন্নত কাঁচামাল',
    icon: 'Sprout',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-3',
    nameBn: 'সাপ্লিমেন্ট',
    nameEn: 'Supplements',
    slug: 'supplements',
    descriptionBn: 'গবাদিপশুর পুষ্টি, হজমশক্তি ও রোগ প্রতিরোধে প্রয়োজনীয় সাপ্লিমেন্ট',
    icon: 'Pill',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-4',
    nameBn: 'ঔষধ',
    nameEn: 'Veterinary Medicines',
    slug: 'medicines',
    descriptionBn: 'গবাদিপশুর প্রয়োজনীয় নিবন্ধিত পশু চিকিৎসা ও স্বাস্থ্য সুরক্ষা পণ্য',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat-5',
    nameBn: 'কম্বিনেশন প্যাকেজ',
    nameEn: 'Combination Packages',
    slug: 'combinations',
    descriptionBn: 'একাধিক প্রয়োজনীয় পণ্য একসাথে নিয়ে সাশ্রয়ী মূল্যে তৈরি বিশেষ খামার প্যাকেজ',
    icon: 'PackageCheck',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. রেডিমেড ফিড - মোটাতাজাকরণ
  {
    id: 'prod-feed-1',
    nameBn: 'খামারি কাব্য গরু মোটাতাজাকরণ স্পেশাল ফিড',
    nameEn: 'Khamari Kabbo Cattle Fattening Special Feed',
    slug: 'cattle-fattening-special-feed',
    categorySlug: 'feed',
    subcategorySlug: 'motatajakaron',
    price: 2450,
    regularPrice: 2600,
    unit: '৫০ কেজি বস্তা',
    inStock: true,
    stockCount: 120,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'দ্রুত মাংস ও দৈহিক বৃদ্ধির জন্য উচ্চ প্রোটিনযুক্ত ও হজমযোগ্য সুষম পেলিট ফিড।',
    descriptionBn: 'খামারি কাব্য গরু মোটাতাজাকরণ স্পেশাল ফিড বিশেষভাবে তৈরি করা হয়েছে কুরবানি ও বাণিজ্যিক ফ্যাটেনিং প্রজেক্টের জন্য। এতে রয়েছে ১৮% এর অধিক অপরিশোধিত প্রোটিন, প্রয়োজনীয় অ্যামিনো এসিড, রুমেন বাফার ও ট্রেস মিনারেলস যা গরুর খাদ্য রূপান্তর হার (FCR) উল্লেখযোগ্য হারে বৃদ্ধি করে।',
    featuresBn: [
      'উচ্চ অপরিশোধিত প্রোটিন (১৮%+) এবং পর্যাপ্ত শক্তি',
      'রুমেনের স্বাস্থ্য ভালো রাখে এবং গ্যাস সৃষ্টি প্রতিরোধ করে',
      'দৈনিক ১.২ কেজি থেকে ১.৮ কেজি পর্যন্ত ওজন বৃদ্ধিতে সহায়তা করে',
      '১০০% প্রাকৃতিক উপাদান দিয়ে প্রস্তুত, কোনো ক্ষতিকারক হরমোন নেই'
    ],
    usageBn: 'দৈনিক গরুর দৈহিক ওজনের ১.৫% থেকে ২% হারে দানাদার খাবারের সাথে মিশিয়ে অথবা সরাসরি খেতে দিন। সাথে পর্যাপ্ত তাজা পানি ও আঁশযুক্ত কাঁচা ঘাস সরবরাহ করুন।',
    compositionBn: 'অপরিশোধিত প্রোটিন: ১৮.৫%, অপরিশোধিত চর্বি: ৩.৮%, ফাইবার: ৬.৫%, ক্যালসিয়াম: ১.২%, ফসফরাস: ০.৬%, মেটাবলাইজেবল এনার্জি: ২৮০০ Kcal/kg',
    rating: 4.9,
    reviewsCount: 84,
    badge: 'সেরা বিক্রয়'
  },
  {
    id: 'prod-feed-2',
    nameBn: 'প্রিমিয়াম বুস্টার ফ্যাটেনিং ফিড (ম্যাশ)',
    nameEn: 'Premium Booster Fattening Mash Feed',
    slug: 'premium-booster-fattening-mash',
    categorySlug: 'feed',
    subcategorySlug: 'motatajakaron',
    price: 2350,
    regularPrice: 2500,
    unit: '৫০ কেজি বস্তা',
    inStock: true,
    stockCount: 85,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'দানাদার ভুট্টার দানা ও সয়াবিনের সংমিশ্রণে তৈরি প্রাকৃতিক সুগন্ধযুক্ত ম্যাশ ফিড।',
    descriptionBn: 'ঐতিহ্যবাহী ম্যাশ ফরম্যাটে পছন্দ করা খামারিদের জন্য আদর্শ পছন্দ। এতে খাঁটি ভুট্টা ভাঙা, গমের ভুসি, সয়াবিন মিল ও ভিটামিন প্রি-মিক্স সুষম অনুপাতে মিশ্রিত রয়েছে।',
    featuresBn: [
      'চমৎকার স্বাদ ও সুঘ্রাণে গরু দ্রুত খাদ্য গ্রহণ করে',
      'পেশির বৃদ্ধি ত্বরান্বিত করে এবং চামড়া উজ্জ্বল করে',
      'সহজলভ্য শক্তি সরবরাহ করে'
    ],
    usageBn: 'পানি দিয়ে ভিজিয়ে বা শুকনো অবস্থায় ভুসি ও চিটাগুড়ের সাথে মিশিয়ে খাওয়ানো যায়।',
    compositionBn: 'প্রোটিন: ১৬.৮%, ফাইবার: ৭.২%, এনার্জি: ২৭৫০ Kcal/kg',
    rating: 4.8,
    reviewsCount: 42
  },

  // 1. রেডিমেড ফিড - ষাঁড়
  {
    id: 'prod-feed-3',
    nameBn: 'হাই-প্রোটিন ষাঁড় গরুর গ্রোথ ও মাসল ফিড',
    nameEn: 'High-Protein Bull Growth & Muscle Feed',
    slug: 'high-protein-bull-growth-feed',
    categorySlug: 'feed',
    subcategorySlug: 'shar',
    price: 2550,
    regularPrice: 2750,
    unit: '৫০ কেজি বস্তা',
    inStock: true,
    stockCount: 65,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'বড় আকারের ষাঁড় ও শাহিওয়াল, ব্রাহমা জাতের গরুর পেশির শক্তিবৃদ্ধির জন্য উপযুক্ত।',
    descriptionBn: 'ভারী ও বড় জাতের ষাঁড় গরুর হাড়ের মজবুতি ও পেশিবহুল শরীরের জন্য বিশেষ পুষ্টিগুণ সম্পন্ন পেলিট ফিড। কুরবানির হাটে সর্বোচ্চ আকর্ষণীয় লুক পেতে খামারিদের প্রথম পছন্দ।',
    featuresBn: [
      'অর্গানিক জিংক ও বায়োটিন সমৃদ্ধ হওয়ায় খুর ও ত্বক চকচকে থাকে',
      'হাড় ও পেশির সামঞ্জস্যপূর্ণ বৃদ্ধি ঘটায়',
      'হজমশক্তি বৃদ্ধি করে পায়খানা পরিষ্কার রাখে'
    ],
    usageBn: 'প্রতি ১০০ কেজি দৈহিক ওজনের জন্য প্রতিদিন ১ কেজি থেকে ১.৫ কেজি পরিমাণ দিন।',
    compositionBn: 'প্রোটিন: ১৯.০%, ফ্যাট: ৪.০%, ক্যালসিয়াম: ১.৪%, ফসফরাস: ০.৭%',
    rating: 4.9,
    reviewsCount: 56,
    badge: 'প্রিমিয়াম'
  },
  {
    id: 'prod-feed-4',
    nameBn: 'শাহিওয়াল ও শঙ্কর ষাঁড় স্পেশাল ফিড',
    nameEn: 'Sahiwal & Cross Bull Feed',
    slug: 'sahiwal-cross-bull-feed',
    categorySlug: 'feed',
    subcategorySlug: 'shar',
    price: 1320,
    regularPrice: 1450,
    unit: '২৫ কেজি বস্তা',
    inStock: true,
    stockCount: 90,
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
    shortDescBn: '২৫ কেজির সাশ্রয়ী প্যাকেজে ছোট ও মাঝারি খামারিদের জন্য আদর্শ ষাঁড় ফিড।',
    descriptionBn: 'সহজে বহনযোগ্য ২৫ কেজি প্যাকেজিংয়ে শাহিওয়াল ও ফ্রিজিয়ান শঙ্কর ষাঁড়ের দৈনন্দিন পুষ্টি চাহিদা পূরণ করে।',
    featuresBn: [
      'সাশ্রয়ী ও সহজে সংরক্ষণযোগ্য',
      'প্রাকৃতিক খনিজ ও ভিটামিনের ব্যালান্সড অনুপাত',
      'ওজন ধরে রাখতে সাহায্য করে'
    ],
    usageBn: 'সকালে ও বিকেলে নির্দিষ্ট সময়ে কাঁচা ঘাসের সাথে মিশিয়ে দিন।',
    compositionBn: 'প্রোটিন: ১৭.২%, ফাইবার: ৬.৮%',
    rating: 4.7,
    reviewsCount: 31
  },

  // 1. রেডিমেড ফিড - গাভী
  {
    id: 'prod-feed-5',
    nameBn: 'হাই-ইল্ডিং গাভীর মিল্ক-প্লাস ফিড',
    nameEn: 'High-Yielding Dairy Cow Milk-Plus Feed',
    slug: 'dairy-cow-milk-plus-feed',
    categorySlug: 'feed',
    subcategorySlug: 'gavi',
    price: 2400,
    regularPrice: 2550,
    unit: '৫০ কেজি বস্তা',
    inStock: true,
    stockCount: 110,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'দুগ্ধবতী গাভীর দৈনিক দুধের পরিমাণ এবং ফ্যাট ও এসএনএফ বৃদ্ধির জন্য প্রস্তুত।',
    descriptionBn: 'উচ্চ দুধ উৎপাদনশীল অস্ট্রেলিয়ান, ফ্রিজিয়ান ও জার্সি শঙ্কর গাভীর জন্য মিল্ক-প্লাস ফিড নিশ্চিত করে সর্বোচ্চ দুধ উৎপাদন। এটি দুগ্ধকালীন সময়ে গাভীর শরীর ক্ষয় হওয়া রোধ করে এবং নিয়মিত হিটে আসতে সহায়তা করে।',
    featuresBn: [
      'দুধের ফ্যাট (Fat %) ও এসএনএফ (SNF) বৃদ্ধি করে',
      'দুধ দোয়ানোর পর শরীরের দুর্বলতা দ্রুত কাটিয়ে তোলে',
      'প্রজনন স্বাস্থ্য সুস্থ রাখে এবং সময়ে গর্ভধারণ নিশ্চিত করে',
      'মেস্টাইটিস (ওলান প্রদাহ) প্রতিরোধক ইমিউনো উপাদান যুক্ত'
    ],
    usageBn: 'গাভীর শরীরের রক্ষণাবেক্ষণের জন্য ২ কেজি এবং প্রতি ৩ লিটার দুধ উৎপাদনের জন্য অতিরিক্ত ১ কেজি করে প্রতিদিন সরবরাহ করুন।',
    compositionBn: 'প্রোটিন: ২০.২%, বাইপাস ফ্যাট: ৪.৫%, ক্যালসিয়াম: ১.৬%, ফসফরাস: ০.৮%, ভিটামিন এ, ডি৩, ই সমৃদ্ধ',
    rating: 4.9,
    reviewsCount: 98,
    badge: 'জনপ্রিয়'
  },
  {
    id: 'prod-feed-6',
    nameBn: 'দুগ্ধবতী দেশি ও শঙ্কর গাভীর সুষম ফিড',
    nameEn: 'Deshi & Cross Dairy Cow Feed',
    slug: 'deshi-cross-dairy-feed',
    categorySlug: 'feed',
    subcategorySlug: 'gavi',
    price: 2250,
    regularPrice: 2400,
    unit: '৫০ কেজি বস্তা',
    inStock: true,
    stockCount: 75,
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'গ্রামাঞ্চলের দেশি ও শঙ্কর গাভীর নিয়মিত দুধ ও সুস্থতার জন্য সাশ্রয়ী সুষম ফিড।',
    descriptionBn: 'স্থানীয় কাঁচামাল ও ভিটামিন-মিনারেলে সমৃদ্ধ ফর্মুলেশন যা দেশি ও মাঝারি জাতের গাভীর নিয়মিত পুষ্টি সরবরাহ করে।',
    featuresBn: [
      'বাজেট বান্ধব দাম ও চমৎকার কার্যকারিতা',
      'দুধের স্বাদ ও ঘনত্ব উন্নত করে',
      'গাভীর রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে'
    ],
    usageBn: 'দৈনিক সকাল ও সন্ধ্যায় ১.৫ কেজি থেকে ২.৫ কেজি পর্যন্ত দিন।',
    compositionBn: 'প্রোটিন: ১৬.৫%, এনার্জি: ২৬৫০ Kcal/kg',
    rating: 4.7,
    reviewsCount: 38
  },

  // 2. ফিড কাঁচামাল (Raw Materials)
  {
    id: 'prod-raw-1',
    nameBn: 'উন্নত ভাঙা ভুট্টার দানা (মেইজ গ্রেইনস)',
    nameEn: 'Cracked Maize Corn Grains',
    slug: 'cracked-maize-corn-grains',
    categorySlug: 'raw-materials',
    price: 40,
    regularPrice: 45,
    unit: 'কেজি',
    inStock: true,
    stockCount: 5000,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'খাদ্যের প্রধান শক্তি উৎস — আর্দ্রতামুক্ত ও পরিষ্কার গ্রেড-১ ভুট্টার দানা।',
    descriptionBn: '১০০% পরিষ্কার, ধুলাবালি ও ছত্রাকমুক্ত শুকনো ভুট্টার দানা যা গরুর শর্করার প্রধান উৎস। এটি খাদ্যের হজমশক্তি বাড়িয়ে গরুকে দ্রুত চাঙ্গা ও মোটাতাজা করে।',
    featuresBn: [
      'আর্দ্রতা ১২% এর নিচে, দীর্ঘস্থায়ী সংরক্ষণ উপযোগী',
      'দানাদার আকার নিখুঁতভাবে ভাঙা যেন গরু সহজে চিবাতে পারে',
      'উচ্চ মেটাবলাইজেবল এনার্জি সমৃদ্ধ'
    ],
    usageBn: 'খামারের নিজস্ব মিক্সচার তৈরিতে মোট দানাদার খাদ্যের ৩০% থেকে ৫০% পর্যন্ত ভুট্টা ব্যবহার করা যায়।',
    compositionBn: 'শর্করা: ৭০%, প্রোটিন: ৯%, ফ্যাট: ৩.৫%',
    rating: 4.8,
    reviewsCount: 112,
    badge: 'ডিমান্ডিং'
  },
  {
    id: 'prod-raw-2',
    nameBn: 'উন্নত গমের ভুসি (চিকন ও মিষ্টি)',
    nameEn: 'Premium Wheat Bran',
    slug: 'premium-wheat-bran',
    categorySlug: 'raw-materials',
    price: 50,
    regularPrice: 55,
    unit: 'কেজি',
    inStock: true,
    stockCount: 3500,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'গরুর অত্যন্ত পছন্দের হজম সহায়ক প্রাকৃতিক মিষ্টি গমের ভুসি।',
    descriptionBn: 'অটো ফ্লাওয়ার মিল থেকে সরাসরি সংগৃহীত পরিষ্কার গমের ভুসি। এতে প্রচুর পরিমানে ফসফরাস ও ডায়েটারি ফাইবার থাকে যা পাকস্থলীর কাজ সক্রিয় রাখে।',
    featuresBn: [
      'কোনো ভেজাল কাঠের গুঁড়া বা ধূলোবালি মুক্ত',
      'প্রাকৃতিক সুবাসযুক্ত ও সুস্বাদু',
      'হজমের সমস্যা ও কোষ্ঠকাঠিন্য দূর করে'
    ],
    usageBn: 'পানি বা ভাতের মাড়ের সাথে মিশিয়ে বা শুকনো দানাদারের সাথে দেওয়া যায়।',
    compositionBn: 'প্রোটিন: ১৪.৫%, ফাইবার: ৯.৫%, ফসফরাস: ১.১%',
    rating: 4.9,
    reviewsCount: 77
  },
  {
    id: 'prod-raw-3',
    nameBn: 'সরিষার খৈল (ঘানি ভাঙা ১০০% খাঁটি)',
    nameEn: 'Pure Mustard Oil Cake',
    slug: 'pure-mustard-oil-cake',
    categorySlug: 'raw-materials',
    price: 55,
    regularPrice: 60,
    unit: 'কেজি',
    inStock: true,
    stockCount: 2200,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'প্রাকৃতিক প্রোটিনের চমৎকার উৎস — গরুর দুধ ও স্বাস্থ্যের জন্য অপরিহার্য।',
    descriptionBn: 'দেশি সরিষা থেকে তেল নিষ্কাশনের পর প্রাপ্ত খাঁটি খৈল। এটি ভিজিয়ে রাখলে চমৎকার ঘ্রাণ ছড়ায় এবং খাবারে প্রোটিনের ঘাটতি পূরণ করে।',
    featuresBn: [
      '৩০% এর বেশি উদ্ভিজ্জ প্রোটিন',
      'দুধের ননি ও চর্বি বৃদ্ধিতে সহায়ক',
      'ক্ষতিকর কেমিক্যাল ও ভেজালমুক্ত'
    ],
    usageBn: 'খাওয়ানোর অন্তত ৪-৬ ঘণ্টা আগে পর্যাপ্ত পানিতে ভিজিয়ে রেখে নরম করে খাবারের সাথে মিশিয়ে দিন।',
    compositionBn: 'প্রোটিন: ৩১.০%, ফ্যাট: ৮.০%, ফাইবার: ৫.৫%',
    rating: 4.8,
    reviewsCount: 65
  },
  {
    id: 'prod-raw-4',
    nameBn: 'সয়াবিন মিল (হাই প্রোটিন ৪৮%)',
    nameEn: 'Soybean Meal High Protein 48%',
    slug: 'soybean-meal-high-protein',
    categorySlug: 'raw-materials',
    price: 68,
    regularPrice: 75,
    unit: 'কেজি',
    inStock: true,
    stockCount: 1800,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'উদ্ভিজ্জ প্রোটিনের রাজকীয় উৎস — দ্রুততম দৈহিক বৃদ্ধির গোপন ফর্মুলা।',
    descriptionBn: 'আন্তর্জাতিক মানের ডি-অয়েলড সয়াবিন মিল। ৪৮% অপরিশোধিত প্রোটিন সমৃদ্ধ যা আধুনিক ডেইরি ও ক্যাটল ফার্মিংয়ে সর্বোচ্চ ফলন দেয়।',
    featuresBn: [
      'সর্বোচ্চ অ্যামিনো এসিড প্রোফাইল (লাইসিন ও মেথিওনিন)',
      'গরুর মাংসপেশি সুদৃঢ় করে',
      'বাচ্চা ও বড় সব ধরনের গবাদিপশুর জন্য নিরাপদ'
    ],
    usageBn: 'দানাদার মিশ্রণে ১০% থেকে ২৫% হারে প্রয়োগ করুন।',
    compositionBn: 'প্রোটিন: ৪৮.৫%, ফাইবার: ৩.৮%, আর্দ্রতা: ১১%',
    rating: 4.9,
    reviewsCount: 54,
    badge: 'সেরা মান'
  },
  {
    id: 'prod-raw-5',
    nameBn: 'হাইব্রিড নেপিয়ার তাজা ঘাস কাটিং ও সাইলেজ উপযোগী',
    nameEn: 'Hybrid Napier Fresh Grass Cut',
    slug: 'hybrid-napier-fresh-grass',
    categorySlug: 'raw-materials',
    price: 20,
    regularPrice: 24,
    unit: 'কেজি',
    inStock: true,
    stockCount: 10000,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'রসাল, সুস্বাদু ও পুষ্টিকর হাইব্রিড নেপিয়ার তাজা কাঁচা ঘাস।',
    descriptionBn: 'খামারের পাশ্ববর্তী নিজস্ব আধুনিক ঘাসের খামার থেকে প্রতিদিন সকালে কেটে প্রক্রিয়াজাত করা নেপিয়ার ঘাস। এতে কাঁচা আঁশ ও ভিটামিন ক্যারোটিন ভরপুর থাকে।',
    featuresBn: [
      'সরাসরি খেতে দেওয়ার উপযোগী ও কোমল কাণ্ড',
      'রুমেনের মাইক্রোফ্লোরা সতেজ রাখে',
      'দুধের ফ্লো বাড়াতে সাহায্য করে'
    ],
    usageBn: 'প্রতিদিন প্রতিটি পূর্ণবয়স্ক গরুকে ১৫-২৫ কেজি কাঁচা ঘাস দিন।',
    compositionBn: 'আর্দ্রতা: ৮০-৮৫%, ড্রাই ম্যাটার প্রোটিন: ৯-১২%',
    rating: 4.6,
    reviewsCount: 29
  },
  {
    id: 'prod-raw-6',
    nameBn: 'খাঁটি আখের চিটাগুড় / মোলাসেস',
    nameEn: 'Pure Sugarcane Molasses',
    slug: 'pure-sugarcane-molasses',
    categorySlug: 'raw-materials',
    price: 35,
    regularPrice: 40,
    unit: 'কেজি',
    inStock: true,
    stockCount: 3000,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'খাবারের রুচি বৃদ্ধি, ইউরিয়া মোলাসেস স্ট্র (UMS) ও সাইলেজ তৈরির মিষ্টি উপাদান।',
    descriptionBn: 'চিনিকল থেকে সংগৃহীত ঘন কালো আখের চিটাগুড়। এটি খড়ের পুষ্টিগুণ বহুগুণ বৃদ্ধি করে এবং খাবারে আকর্ষণীয় স্বাদ এনে দেয়।',
    featuresBn: [
      'উচ্চ ঘনমাত্রার ফ্রুক্টোজ ও গ্লুকোজ সমৃদ্ধ ইনস্ট্যান্ট এনার্জি',
      'খড় ভিজিয়ে খাওয়ানোর জন্য অত্যন্ত কার্যকর',
      'শীতকালে গরুর শরীর উষ্ণ রাখে'
    ],
    usageBn: 'খড়ে বা দানাদারে ৫%-১০% মোলাসেস পানিতে গুলে ছিটিয়ে দিন।',
    compositionBn: 'ব্রিক্স মান: ৮০°+, সুগার: ৫০%+',
    rating: 4.8,
    reviewsCount: 48
  },

  // 3. সাপ্লিমেন্ট (Supplements)
  {
    id: 'prod-supp-1',
    nameBn: 'খামারি ভাইটাল মিনারেল মিক্সচার প্রিমিক্স',
    nameEn: 'Khamari Vital Mineral Mixture Premix',
    slug: 'vital-mineral-mixture-premix',
    categorySlug: 'supplements',
    price: 380,
    regularPrice: 420,
    unit: '১ কেজি প্যাকেট',
    inStock: true,
    stockCount: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'ক্যালসিয়াম, ফসফরাস, জিংক, কপার ও সেলেনিয়াম সমৃদ্ধ বিশেষ খনিজ ফর্মুলা।',
    descriptionBn: 'গবাদিপশুর দৈনন্দিন খাবারে খনিজের ঘাটতি পূরণের জন্য অপরিহার্য। মাটি ও ঘাসে খনিজ কম থাকলে গরু মাটি চাটা, পলিথিন খাওয়া বা অনিয়মিত হিটের সমস্যায় পড়ে। এই মিনারেল মিক্স নিয়মিত খাওয়ালে এসকল সমস্যা দূর হয়।',
    featuresBn: [
      'গরুর মাটি খাওয়া, পলিথিন চিবানোর বদভ্যাস দূর করে',
      'প্রজনন ক্ষমতা ও যথাসময়ে হিটে আসার হার বাড়ায়',
      'দুধের পরিমাণ বাড়াতে এবং খুর শক্ত করতে সহায়ক'
    ],
    usageBn: 'বড় গরুর জন্য প্রতিদিন ৩০-৫০ গ্রাম এবং বাছুরের জন্য ১৫-২০ গ্রাম দানাদার খাবারের সাথে মিশিয়ে দিন।',
    compositionBn: 'ক্যালসিয়াম: ২৪%, ফসফরাস: ১২%, জিংক: ৯৬০০mg, কপার: ১২০০mg, আয়োডিন: ৩২৫mg, সেলেনিয়াম: ২০mg, কোবাল্ট: ১৫০mg',
    rating: 4.9,
    reviewsCount: 120,
    badge: 'অপরিহার্য'
  },
  {
    id: 'prod-supp-2',
    nameBn: 'লিকুইড ক্যালসিফোর্ড প্লাস (ক্যালসিয়াম + ভিটামিন D3)',
    nameEn: 'Liquid Calcifort Plus (Calcium + Vit D3)',
    slug: 'liquid-calcifort-plus',
    categorySlug: 'supplements',
    price: 450,
    regularPrice: 500,
    unit: '১ লিটার বোতল',
    inStock: true,
    stockCount: 95,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'দুগ্ধবতী গাভীর মিল্ক ফিভার প্রতিরোধ এবং হাড়ের ক্যালসিয়াম ঘাটতি পূরণের সিরাপ।',
    descriptionBn: 'উচ্চ মাত্রার আয়নিত ক্যালসিয়াম, ফসফরাস এবং ভিটামিন ডি৩ এর বিশেষ লিকুইড সিরাপ যা দ্রুত রক্তে শোষিত হয়। বাচ্চা প্রসবের আগে ও পরে মিল্ক ফিভার রোধে অত্যন্ত কার্যকরী।',
    featuresBn: [
      'বাচ্চা প্রসবের পর গাভীর দাঁড়াতে না পারার সমস্যা দূর করে',
      'দুধের ফ্লো দ্বিগুণ হারে বৃদ্ধি করে',
      'সহজে মুখে খাওয়ানো যায় বা খাবারের সাথে মেশানো যায়'
    ],
    usageBn: 'দুগ্ধবতী গাভীকে প্রতিদিন ১০০ মিলি করে নিয়মিত খাওয়ান। প্রসবের দিনে ২০০ মিলি দিন।',
    compositionBn: 'প্রতি ১০০ মিলিতে: ক্যালসিয়াম: ৩২৫০mg, ফসফরাস: ১৬৫০mg, ভিটামিন D3: ৮০০০ IU, ভিটামিন B12: ১০০mcg',
    rating: 4.8,
    reviewsCount: 88
  },
  {
    id: 'prod-supp-3',
    nameBn: 'সুপার গ্রোথ প্রো-অ্যাক্টিভ পাউডার',
    nameEn: 'Super Growth Pro-Active Powder',
    slug: 'super-growth-pro-active',
    categorySlug: 'supplements',
    price: 520,
    regularPrice: 580,
    unit: '৫০০ গ্রাম',
    inStock: true,
    stockCount: 80,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'লাইভ ইস্ট ও এনজাইম সমৃদ্ধ যা রুমেনের কার্যক্ষমতা ও খাদ্য হজম বহুগুণ বাড়ায়।',
    descriptionBn: 'গরু অনেক খেলেও স্বাস্থ্য বাড়ে না? সুপার গ্রোথ প্রো-অ্যাক্টিভ পাউডারে রয়েছে প্রোবায়োটিক লাইভ ইস্ট ও প্রোটিন-ডাইজেস্টিং এনজাইম যা খাদ্যের পুষ্টি সম্পূর্ণ শরীরে লাগাতে সাহায্য করে।',
    featuresBn: [
      'খাবারের হজম ক্ষমতা ৩০% পর্যন্ত বৃদ্ধি করে',
      'অরুচি ও বদহজম দ্রুত নিরাময় করে',
      'পেট ফাঁপা ও অ্যাসিডোসিস প্রতিরোধ করে'
    ],
    usageBn: 'দৈনিক ১০-১৫ গ্রাম পাউডার দানাদার খাবারের সাথে দিন।',
    compositionBn: 'Saccharomyces cerevisiae: ৫x১০^৯ CFU, Protease, Amylase, Phytase, Rumen Buffers',
    rating: 4.9,
    reviewsCount: 63,
    badge: 'সেরা ফলাফল'
  },
  {
    id: 'prod-supp-4',
    nameBn: 'মিল্ক বুস্টার এইচ ও বায়োটিন ভিটামিন টনিক',
    nameEn: 'Milk Booster H & Biotin Tonic',
    slug: 'milk-booster-h-biotin',
    categorySlug: 'supplements',
    price: 650,
    regularPrice: 720,
    unit: '৫০০ মিলি বোতল',
    inStock: true,
    stockCount: 60,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'ওলানের কোষ বৃদ্ধি, মেস্টাইটিস প্রতিরোধ এবং সর্বোচ্চ দুধের ফ্যাট পাওয়ার টনিক।',
    descriptionBn: 'উচ্চ ক্ষমতাসম্পন্ন ভিটামিন এইচ (বায়োটিন), ভিটামিন এ, ডি৩ এবং ভিটামিন ই এর সংমিশ্রণ। গাভীর ওলানের পেশী মজবুত করে এবং মেস্টাইটিস রোগের হাত থেকে ওলান সুরক্ষা দেয়।',
    featuresBn: [
      'ওলান সুস্থ ও নরম রাখে এবং ছিদ্র বন্ধ হওয়া প্রতিরোধ করে',
      'চামড়ায় মসৃণ চকচকে ভাব এনে দেয়',
      'দুধের ফ্যাট পার্সেন্টেজ বাড়ায়'
    ],
    usageBn: 'দৈনিক ১০ মিলি করে টানা ২০ দিন খাওয়ান।',
    compositionBn: 'Biotin (Vit H): ১২.৫mg, Vit A: ২৫০,০০০ IU, Vit D3: ৫০,০০০ IU, Vit E: ২৫০mg',
    rating: 4.9,
    reviewsCount: 52
  },

  // 4. পশু চিকিৎসা ও ঔষধ (Veterinary Medicines)
  {
    id: 'prod-med-1',
    nameBn: 'ফাস্টভেট ওরাল সাসপেনশন (হজম ও লিভার টনিক)',
    nameEn: 'FastVet Oral Suspension',
    slug: 'fastvet-oral-suspension',
    categorySlug: 'medicines',
    price: 280,
    regularPrice: 310,
    unit: '৫০০ মিলি',
    inStock: true,
    stockCount: 70,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'পশু চিকিৎসকের পরামর্শে ব্যবহার্য — পেটের গোলযোগ ও লিভারের কার্যক্ষমতা বর্ধক।',
    descriptionBn: 'গবাদিপশুর লিভার সুস্থ রাখতে ও বিভিন্ন অ্যান্টিবায়োটিক চিকিৎসার পরবর্তী দুর্বলতা কাটাতে এই সাসপেনশনটি ব্যবহৃত হয়।',
    featuresBn: [
      'ক্ষুধামন্দা ও ক্ষুধাহীনতা দূরীকরণে সহায়ক',
      'টক্সিন বা বিষাক্ততা লিভার থেকে নিষ্কাশন করে',
      'দ্রুত এনার্জি ফিরিয়ে আনে'
    ],
    usageBn: 'পশু চিকিৎসকের প্রেসক্রিপশন অনুযায়ী সঠিক মাত্রায় খাওয়ান। সাধারণ ক্ষেত্রে বড় গরুকে দৈনিক ৫০-১০০ মিলি।',
    compositionBn: 'Silymarin, Choline Chloride, L-Carnitine, Vitamin B-Complex',
    rating: 4.7,
    reviewsCount: 39,
    isVetMedicine: true
  },
  {
    id: 'prod-med-2',
    nameBn: 'এস্ট্রাভেট বোলাস (ব্যথানাশক ও জ্বর উপশমকারী)',
    nameEn: 'AstraVet Bolus (Analgesic & Antipyretic)',
    slug: 'astravet-bolus',
    categorySlug: 'medicines',
    price: 180,
    regularPrice: 200,
    unit: '১০ বোলাস স্ট্রিপ',
    inStock: true,
    stockCount: 110,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'পশু চিকিৎসকের পরামর্শ অনুযায়ী — গরুর জ্বর, শরীরের ব্যথা ও ফোলা কমানোর বোলাস।',
    descriptionBn: 'আঘাতজনিত ফোলা, খুরের ক্ষতজনিত তীব্র ব্যথা এবং মৌসুমী জ্বরে তাৎক্ষণিক আরাম দিতে চিকিৎসকদের নির্দেশিত ওষুধ।',
    featuresBn: [
      'উচ্চ কার্যকারিতা সম্পন্ন পেইন কিলার ও অ্যান্টি-ইনফ্ল্যামেটরি',
      'সহজে পানিতে গুলে বা গুড়ের সাথে খাওয়ানো যায়'
    ],
    usageBn: 'নিবন্ধিত পশু চিকিৎসকের পরামর্শ অনুযায়ী নির্ধারিত মাত্রায় সেব্য।',
    compositionBn: 'Paracetamol BP 2000mg, Meloxicam BP 100mg',
    rating: 4.8,
    reviewsCount: 45,
    isVetMedicine: true
  },
  {
    id: 'prod-med-3',
    nameBn: 'থিয়োভেট অ্যান্টি-রেসপিরেটরি ও কফ কেয়ার',
    nameEn: 'Thiovet Respiratory Care',
    slug: 'thiovet-respiratory-care',
    categorySlug: 'medicines',
    price: 320,
    regularPrice: 360,
    unit: '১০০ গ্রাম প্যাকেট',
    inStock: true,
    stockCount: 85,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'শীতকাল বা ঋতু পরিবর্তনের ঠান্ডাজনিত কাশি, শ্বাসকষ্ট ও নিউমোনিয়ায় ব্যবহৃত পাউডার।',
    descriptionBn: 'গবাদিপশুর ফুসফুসের শ্লেষ্মা তরল করে শ্বাসপ্রশ্বাস সহজ করে। শীতকালীন কাশি ও সর্দি প্রতিরোধে সাহায্য করে।',
    featuresBn: [
      'শ্বাসনালীর প্রদাহ উপশম করে',
      'কফ পরিষ্কার করে আরামদায়ক শ্বাস নিশ্চিত করে'
    ],
    usageBn: 'পশু চিকিৎসকের প্রেসক্রিপশন অনুযায়ী কুসুম গরম পানিতে মিশিয়ে সেব্য।',
    compositionBn: 'Bromhexine HCl, Ammonium Chloride, Menthol & Herbal Extracts',
    rating: 4.6,
    reviewsCount: 28,
    isVetMedicine: true
  },
  {
    id: 'prod-med-4',
    nameBn: 'ভায়োডিন অ্যান্টিসেপ্টিক ও উন্ড হিলিং সলিউশন',
    nameEn: 'Viodine Antiseptic Solution 10%',
    slug: 'viodine-antiseptic-solution',
    categorySlug: 'medicines',
    price: 190,
    regularPrice: 220,
    unit: '১০০ মিলি বোতল',
    inStock: true,
    stockCount: 140,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'খুরপাকা, ক্ষত, পোকা লাগা এবং সার্জারি পরবর্তী চামড়ার ক্ষত জীবাণুমুক্ত করার দ্রবণ।',
    descriptionBn: 'পোভিডন আয়োডিন ১০% জীবাণুনাশক দ্রবণ। খামারের প্রতিটি গরুর প্রাথমিক চিকিৎসার জন্য অতি প্রয়োজনীয় সুরক্ষা উপাদান।',
    featuresBn: [
      'জীবাণু, ব্যাকটেরিয়া ও ছত্রাক দ্রুত ধ্বংস করে',
      'ক্ষত দ্রুত শুকাতে সাহায্য করে ও মাছির সংক্রমণ ঠেকায়'
    ],
    usageBn: 'ক্ষতস্থান পরিষ্কার পানি দিয়ে ধুয়ে তুলোর সাহায্যে সরাসরি দিনে ২-৩ বার প্রয়োগ করুন।',
    compositionBn: 'Povidone Iodine USP 10% w/v',
    rating: 4.9,
    reviewsCount: 89,
    isVetMedicine: true,
    badge: 'জরুরি ফার্স্ট এইড'
  },

  // 5. কম্বিনেশন প্যাকেজ (Combinations)
  {
    id: 'prod-combo-1',
    nameBn: 'খামারি কাব্য মোটাতাজাকরণ কম্বো (১০০ দিন স্পেশাল)',
    nameEn: 'Khamari Kabbo 100-Day Cattle Fattening Combo',
    slug: 'khamari-kabbo-100-day-fattening-combo',
    categorySlug: 'combinations',
    price: 5990,
    regularPrice: 6700,
    unit: 'সম্পূর্ণ প্যাকেজ',
    inStock: true,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'একটি গরুর দ্রুত মাংস বৃদ্ধি ও চমৎকার গঠনের জন্য প্রয়োজনীয় খাদ্য ও সাপ্লিমেন্টের সেরা সাশ্রয়ী বান্ডেল।',
    descriptionBn: 'কুরবানি বা মাংসের খামারিদের জন্য ১০০ দিনের ফুল প্রফেশনাল প্যাকেজ। এতে প্রয়োজনীয় হাই-প্রোটিন পেলিট ফিড, ভাইটাল মিনারেল প্রিমিক্স, গ্রোথ এনজাইম এবং হজম সহায়ক ইস্ট পাউডার একসাথে সাশ্রয়ী মূল্যে অন্তর্ভুক্ত রয়েছে।',
    featuresBn: [
      'আলাদা আলাদা কেনার চেয়ে ৮০০+ টাকা সাশ্রয়ী',
      'দৈনিক ১.৫ কেজি+ ওজন বৃদ্ধির প্রমাণিত ফর্মুলা',
      'খাবারের সম্পূর্ণ রুটিন ও চার্ট প্যাকেজের সাথে ফ্রি',
      '১০০% স্বাস্থ্যকর ও প্রাকৃতিক উপাদান'
    ],
    isCombo: true,
    comboItems: [
      { productName: 'গরু মোটাতাজাকরণ স্পেশাল ফিড', quantity: '২ বস্তা (১০০ কেজি)' },
      { productName: 'খামারি ভাইটাল মিনারেল মিক্সচার', quantity: '২ কেজি' },
      { productName: 'সুপার গ্রোথ প্রো-অ্যাক্টিভ পাউডার', quantity: '১ কেজি' },
      { productName: 'খাঁটি আখের চিটাগুড় / মোলাসেস', quantity: '৫ কেজি' },
      { productName: 'ফ্রি মোটাতাজাকরণ গাইড বই ও চার্ট', quantity: '১ কপি' }
    ],
    usageBn: 'প্যাকেজের সাথে সরবরাহকৃত রুটিন নির্দেশিকা অনুসরণ করে প্রতিদিন পরিমাণমতো খাবার ও সাপ্লিমেন্ট সরবরাহ করুন।',
    rating: 5.0,
    reviewsCount: 142,
    badge: 'সেরা কম্বো প্যাকেজ'
  },
  {
    id: 'prod-combo-2',
    nameBn: 'গাভী কেয়ার ও মিল্ক-ম্যাক্সিমাইজার কম্বো',
    nameEn: 'Dairy Cow Care & Milk-Maximizer Combo',
    slug: 'dairy-cow-care-milk-maximizer-combo',
    categorySlug: 'combinations',
    price: 5850,
    regularPrice: 6500,
    unit: 'সম্পূর্ণ প্যাকেজ',
    inStock: true,
    stockCount: 35,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'গাভীর দুধের পরিমাণ বৃদ্ধি, ওলানের সুরক্ষা এবং দ্রুত সুস্থতার অল-ইন-ওয়ান ডেইরি প্যাক।',
    descriptionBn: 'দুধ উৎপাদনশীল গাভীর জন্য তৈরি বিশেষ কেয়ার কম্বো। দুধের ফ্যাট বৃদ্ধি, ক্যালসিয়াম ঘাটতি পূরণ এবং ওলানের রোগমুক্তির জন্য মিল্ক-প্লাস ফিডের সাথে উন্নত লিকুইড ক্যালসিয়াম ও ভিটামিন এইচ এর সেরা সমন্বয়।',
    featuresBn: [
      'দুধের ফলন ৩-৫ লিটার পর্যন্ত বৃদ্ধিতে সহায়ক',
      'গাভীর প্রসব পরবর্তী জটিলতা দূর করে',
      'দুধে ফ্যাট ও ক্রিমের পরিমাণ চমৎকার বৃদ্ধি পায়',
      'প্যাকেজে ৬৫০ টাকা নগদ ছাড়'
    ],
    isCombo: true,
    comboItems: [
      { productName: 'হাই-ইল্ডিং গাভীর মিল্ক-প্লাস ফিড', quantity: '২ বস্তা (১০০ কেজি)' },
      { productName: 'লিকুইড ক্যালসিফোর্ড প্লাস (ক্যালসিয়াম+D3)', quantity: '২ লিটার' },
      { productName: 'মিল্ক বুস্টার এইচ ও বায়োটিন ভিটামিন', quantity: '১ বোতল (৫০০ মিলি)' },
      { productName: 'খামারি ভাইটাল মিনারেল মিক্সচার', quantity: '১ কেজি' }
    ],
    usageBn: 'প্রতিদিন মিল্কিং শিডিউল অনুযায়ী ফিড এবং ক্যালসিয়াম-ভিটামিন নির্দিষ্ট মাত্রায় মিশিয়ে দিন।',
    rating: 4.9,
    reviewsCount: 86,
    badge: 'ডেইরি স্পেশাল'
  },
  {
    id: 'prod-combo-3',
    nameBn: 'কুরবানি ষাঁড় প্রিমিয়াম ফিনিশিং কম্বো',
    nameEn: 'Qurbani Bull Premium Finishing Combo',
    slug: 'qurbani-bull-premium-finishing-combo',
    categorySlug: 'combinations',
    price: 6200,
    regularPrice: 6900,
    unit: 'সম্পূর্ণ প্যাকেজ',
    inStock: true,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'কুরবানির হাটে রাজকীয় লুক, চকচকে চামড়া ও পেশীবহুল বডি নিশ্চিত করার ফিনিশার কম্বো।',
    descriptionBn: 'হাটে তোলার শেষ ৬০-৯০ দিনের জন্য বিশেষ ফিনিশিং প্যাক। ওজন বাড়ানোর পাশাপাশি ষাঁড়ের আকৃতি ও গায়ের লোম উজ্জ্বল ও ঝকঝকে করতে অতুলনীয়।',
    featuresBn: [
      'পেশির আকর্ষণীয় বৃদ্ধি ও পিঠের কুঁজ ভরাট করে',
      'ত্বকের তেলতেলে চকচকে ভাব এনে ক্রেতার দৃষ্টি কাড়ে',
      'খাবারের রুচি ও চঞ্চলতা ধরে রাখে'
    ],
    isCombo: true,
    comboItems: [
      { productName: 'হাই-প্রোটিন ষাঁড় গরুর গ্রোথ ফিড', quantity: '২ বস্তা (১০০ কেজি)' },
      { productName: 'সয়াবিন মিল হাই প্রোটিন', quantity: '১০ কেজি' },
      { productName: 'আখের মোলাসেস / চিটাগুড়', quantity: '১০ কেজি' },
      { productName: 'খামারি ভাইটাল মিনারেল', quantity: '১ কেজি' }
    ],
    usageBn: 'প্রতিদিন সকালে ও বিকেলে নিয়মমাফিক দানাদারের সাথে মিশিয়ে খাওয়ান।',
    rating: 5.0,
    reviewsCount: 73,
    badge: 'কুরবানি অফার'
  },
  {
    id: 'prod-combo-4',
    nameBn: 'খামার সুরক্ষা প্রাথমিক চিকিৎসা কিট',
    nameEn: 'Farm Protection First Aid Emergency Kit',
    slug: 'farm-protection-first-aid-kit',
    categorySlug: 'combinations',
    price: 1850,
    regularPrice: 2150,
    unit: 'মেডিকেল বক্স',
    inStock: true,
    stockCount: 50,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
    shortDescBn: 'খামারে যেকোনো সময় গরুর আঘাত, ক্ষত, জ্বর বা বদহজমে জরুরি চিকিৎসার ফার্স্ট এইড বক্স।',
    descriptionBn: 'প্রতিটি ডেইরি ও ফ্যাটেনিং খামারে সবসময় প্রস্তুত রাখার মতো একটি জরুরি প্রাথমিক চিকিৎসা কিট। এতে ক্ষত জীবাণুনাশক, পেইন কিলার, জ্বর ও পেট ফাঁপার জরুরি ওষুধ রাখা হয়েছে।',
    featuresBn: [
      'রাত-বিরাতে বা ছুটির দিনে জরুরি বিপদে সুরক্ষা',
      'প্রয়োজনীয় ব্যান্ডেজ ও ফার্স্ট এইড গাইড সম্বলিত বক্স',
      'ডাক্তার আসার পূর্ব মুহূর্তের কার্যকর সমাধান'
    ],
    isCombo: true,
    comboItems: [
      { productName: 'ভায়োডিন অ্যান্টিসেপ্টিক সলিউশন', quantity: '২ বোতল' },
      { productName: 'এস্ট্রাভেট বোলাস (ব্যথা ও জ্বর)', quantity: '১ বক্স (২০ বোলাস)' },
      { productName: 'ফাস্টভেট সাসপেনশন (হজম ও গ্যাস)', quantity: '১ বোতল' },
      { productName: 'মেডিকেল কটন ব্যান্ডেজ ও থার্মোমিটার', quantity: '১ সেট' }
    ],
    usageBn: 'জরুরি পরিস্থিতিতে ফার্স্ট এইড নির্দেশিকা দেখে অথবা চিকিৎসকের পরামর্শে প্রয়োগ করুন।',
    rating: 4.9,
    reviewsCount: 67
  }
];

export const INITIAL_GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-0',
    slug: 'cattle-fattening-proper-method',
    titleBn: 'গরু মোটাতাজাকরণের সঠিক ও বৈজ্ঞানিক পদ্ধতি',
    subtitleBn: 'কম খরচে ৩ মাসে সর্বোচ্চ ওজন বৃদ্ধির নিয়মাবলি',
    categoryBn: 'মোটাতাজাকরণ টিপস',
    readTimeBn: '৫ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য গবেষণা দল',
    status: 'published',
    featured: true,
    summaryBn: 'কোনো ক্ষতিকর স্টেরয়েড বা হরমোন ছাড়া শুধুমাত্র সঠিক সুষম দানাদার খাদ্য, কাঁচা ঘাস ও খনিজের সমন্বয়ে ৯০-১০০ দিনে একটি গরুকে আকর্ষণীয় স্বাস্থ্যবান করার আধুনিক পদ্ধতি।',
    keyPointsBn: [
      'শুরুতেই কৃমিনাশক ও লিভার টনিক দেওয়া আবশ্যক',
      'দৈহিক ওজনের ভিত্তিতে দানাদার খাদ্যের অনুপাত নির্ধারণ',
      'কাঁচা ঘাস ও শুকনা খড়ের সঠিক অনুপাত (৭০:৩০)',
      'পর্যাপ্ত বিশুদ্ধ খাবার পানি সরবরাহ নিশ্চিত করা'
    ],
    sections: [
      {
        headingBn: '১. প্রাথমিক প্রস্তুতি ও স্বাস্থ্য পরীক্ষা',
        contentBn: [
          'মোটাতাজাকরণ শুরুর প্রথম সপ্তাহেই গরুকে উপযুক্ত কৃমিনাশক ওষুধ দিয়ে ডি-ওয়ার্মিং সম্পন্ন করতে হবে।',
          'কৃমিনাশক দেওয়ার পর টানা ৫-৭ দিন লিভার টনিক ও হজম সহায়ক ইস্ট খাওয়ালে কৃমিমুক্ত পেটে খাদ্য দ্রুত শোষণ হতে শুরু করে।',
          'তড়কা, বাদলা ও ক্ষুরারোগের টিকা সময়মতো দেওয়া আছে কিনা তা নিশ্চিত হতে হবে।'
        ]
      },
      {
        headingBn: '২. দৈনিক খাদ্য অনুপাত (রেশন ফর্মুলা)',
        contentBn: [
          'একটি ২০০ কেজি ওজনের গরুর জন্য প্রতিদিন প্রায় ৩.০ কেজি থেকে ৩.৫ কেজি উন্নত মানের দানাদার খাদ্য (ভুট্টা, ভুসি, খৈল, পেলিট ফিড) প্রয়োজন।',
          'পাশাপাশি ৮-১০ কেজি কাঁচা নেপিয়ার ঘাস এবং ২-৩ কেজি শুকনা খড় দিতে হবে।',
          'দানাদার খাবারের সাথে প্রতিদিন ৩০-৪০ গ্রাম ভাইটাল মিনারেল মিক্সচার ও ১০ গ্রাম প্রো-বায়োটিক ইস্ট মেশানো বাধ্যতামূলক।'
        ]
      },
      {
        headingBn: '৩. খামারের পরিবেশ ও আলো-বাতাস',
        contentBn: [
          'গরু যেন দিনে অন্তত ৮-১০ ঘণ্টা নিরিবিলিতে জাবর কাটতে পারে এমন খোলামেলা ও শুকনা জায়গার ব্যবস্থা রাখতে হবে।',
          'গরুকে অতিরিক্ত রোদে বা তীব্র গরমে রাখা যাবে না, ফ্যানের ব্যবস্থা রাখলে গরুর হিট স্ট্রেস কমে দ্রুত ওজন বাড়ে।'
        ]
      }
    ],
    rationTable: [
      {
        cattleType: 'ছোট ষাঁড় (১৫০ - ২০০ কেজি)',
        weightRange: '১৫০-২০০ কেজি',
        greenGrass: '৮ - ১০ কেজি',
        dryStraw: '২ কেজি',
        concentrateFeed: '২.৫ - ৩.০ কেজি',
        mineralMix: '২৫ গ্রাম'
      },
      {
        cattleType: 'মাঝারি ষাঁড় (২০১ - ৩০০ কেজি)',
        weightRange: '২০১-৩০০ কেজি',
        greenGrass: '১২ - ১৫ কেজি',
        dryStraw: '৩ কেজি',
        concentrateFeed: '৩.৫ - ৪.৫ কেজি',
        mineralMix: '৩৫ গ্রাম'
      },
      {
        cattleType: 'বড় কুরবানি ষাঁড় (৩০০+ কেজি)',
        weightRange: '৩০০-৪৫০ কেজি',
        greenGrass: '১৮ - ২২ কেজি',
        dryStraw: '৪ কেজি',
        concentrateFeed: '৫.০ - ৬.৫ কেজি',
        mineralMix: '৫০ গ্রাম'
      }
    ]
  },
  {
    id: 'guide-1',
    slug: 'cattle-fattening-method',
    titleBn: 'গরু মোটাতাজাকরণের সঠিক পদ্ধতি ও বৈজ্ঞানিক নির্দেশিকা',
    subtitleBn: 'কম খরচে দ্রুত ওজন ও মাংস বৃদ্ধির আধুনিক কৌশল',
    categoryBn: 'গরু মোটাতাজাকরণ',
    readTimeBn: '৫ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    author: 'ড. মো: সাইফুর রহমান (ভেটেরিনারি সার্জন)',
    status: 'published',
    featured: true,
    summaryBn: 'গরু মোটাতাজাকরণ একটি অত্যন্ত লাভজনক ব্যবসা যদি সঠিক গরু নির্বাচন, কৃমিনাশক প্রদান, ও সুষম খাবার নিশ্চিত করা যায়। ৯০ থেকে ১২০ দিনের স্পেশাল প্রোগ্রামে সর্বোচ্চ লাভ পাওয়া সম্ভব।',
    keyPointsBn: [
      'উন্নত জাতের ১.৫ থেকে ২ বছর বয়সী ষাঁড় নির্বাচন',
      'প্রথমে কৃমিনাশক ও লিভার টনিক প্রয়োগ করা',
      'উচ্চ প্রোটিন (১৮%+) সমৃদ্ধ পেলিট বা ম্যাশ ফিড খাওয়ানো',
      'নিয়মিত তাজা পানি ও ভাইটাল মিনারেল সরবরাহ'
    ],
    sections: [
      {
        headingBn: '১. প্রাথমিক প্রস্তুতি ও স্বাস্থ্য পরীক্ষা',
        contentBn: [
          'মোটাতাজাকরণ শুরুর প্রথম সপ্তাহেই গরুকে উপযুক্ত কৃমিনাশক ওষুধ দিয়ে ডি-ওয়ার্মিং সম্পন্ন করতে হবে।',
          'কৃমিনাশক দেওয়ার পর টানা ৫-৭ দিন লিভার টনিক ও হজম সহায়ক ইস্ট খাওয়ালে কৃমিমুক্ত পেটে খাদ্য দ্রুত শোষণ হতে শুরু করে।',
          'তড়কা, বাদলা ও ক্ষুরারোগের টিকা সময়মতো দেওয়া আছে কিনা তা নিশ্চিত হতে হবে।'
        ]
      },
      {
        headingBn: '২. দৈনিক খাদ্য অনুপাত (রেশন ফর্মুলা)',
        contentBn: [
          'একটি ২০০ কেজি ওজনের গরুর জন্য প্রতিদিন প্রায় ৩.০ কেজি থেকে ৩.৫ কেজি উন্নত মানের দানাদার খাদ্য (ভুট্টা, ভুসি, খৈল, পেলিট ফিড) প্রয়োজন।',
          'পাশাপাশি ৮-১০ কেজি কাঁচা নেপিয়ার ঘাস এবং ২-৩ কেজি শুকনা খড় দিতে হবে।',
          'দানাদার খাবারের সাথে প্রতিদিন ৩০-৪০ গ্রাম ভাইটাল মিনারেল মিক্সচার ও ১০ গ্রাম প্রো-বায়োটিক ইস্ট মেশানো বাধ্যতামূলক।'
        ]
      }
    ],
    rationTable: [
      {
        cattleType: 'ছোট ষাঁড় (১৫০ - ২০০ কেজি)',
        weightRange: '১৫০-২০০ কেজি',
        greenGrass: '৮ - ১০ কেজি',
        dryStraw: '২ কেজি',
        concentrateFeed: '২.৫ - ৩.০ কেজি',
        mineralMix: '২৫ গ্রাম'
      },
      {
        cattleType: 'মাঝারি ষাঁড় (২০১ - ৩০০ কেজি)',
        weightRange: '২০১-৩০০ কেজি',
        greenGrass: '১২ - ১৫ কেজি',
        dryStraw: '৩ কেজি',
        concentrateFeed: '৩.৫ - ৪.৫ কেজি',
        mineralMix: '৩৫ গ্রাম'
      },
      {
        cattleType: 'বড় কুরবানি ষাঁড় (৩০০+ কেজি)',
        weightRange: '৩০০-৪৫০ কেজি',
        greenGrass: '১৮ - ২২ কেজি',
        dryStraw: '৪ কেজি',
        concentrateFeed: '৫.০ - ৬.৫ কেজি',
        mineralMix: '৫০ গ্রাম'
      }
    ]
  },
  {
    id: 'guide-2',
    slug: 'balanced-cattle-diet-importance',
    titleBn: 'গরুর জন্য সুষম খাদ্য কেন প্রয়োজন ও কীভাবে প্রস্তুত করবেন?',
    subtitleBn: 'প্রোটিন, এনার্জি, ফাইবার ও খনিজের আদর্শ সমন্বয়',
    categoryBn: 'খাদ্য ব্যবস্থাপনা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য পুষ্টি বিশেষজ্ঞ দল',
    status: 'published',
    featured: true,
    summaryBn: 'শুধু খড় বা শুধু ভুসি খাওয়ালে গরু পুষ্টিহীনতায় ভোগে। একটি আদর্শ সুষম খাদ্যে শর্করা, উদ্ভিজ্জ প্রোটিন, চর্বি, ভিটামিন ও খনিজ সুনির্দিষ্ট অনুপাতে থাকা প্রয়োজন।',
    keyPointsBn: [
      'ভুট্টা ও রাইস পলিশ শক্তির মূল উৎস (৫০-৫৫%)',
      'সয়াবিন মিল ও সরিষার খৈল প্রোটিনের উৎস (২৫-৩০%)',
      'গমের ভুসি ও অটো ব্রান ফাইবারের উৎস (১৫-২০%)',
      'মিনারেল প্রিমিক্স ও লবণ (২-৩%)'
    ],
    sections: [
      {
        headingBn: 'সুষম খাদ্যের প্রধান উপাদানসমূহ',
        contentBn: [
          '১০০ কেজি দানাদার খাদ্য তৈরিতে: ভুট্টা ভাঙা ৪০ কেজি + গমের ভুসি ২০ কেজি + সয়াবিন মিল ১৫ কেজি + সরিষার খৈল ১৫ কেজি + চিটাগুড় ৭ কেজি + মিনারেল প্রিমিক্স ২ কেজি + খাবার লবণ ১ কেজি।',
          'এই মিশ্রণে প্রায় ১৮% প্রোটিন এবং ২৮০০ কিলো-ক্যালরি শক্তি থাকে যা গরুর স্বাস্থ্যের জন্য সেরা।'
        ]
      }
    ]
  },
  {
    id: 'guide-3',
    slug: 'how-to-make-cattle-diet-chart',
    titleBn: 'গরুর খাদ্য তালিকা কীভাবে তৈরি করবেন? (সহজ ফর্মুলা)',
    subtitleBn: 'ওজন অনুযায়ী দানাদার ও কাঁচা ঘাসের হিসাব নির্নয়',
    categoryBn: 'খাদ্য ব্যবস্থাপনা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    author: 'ড. মো: সাইফুর রহমান',
    status: 'published',
    featured: false,
    summaryBn: 'গরুর দৈহিক ওজনের ১০-১৫% শুষ্ক পদার্থ (Dry Matter) খাদ্যের ভিত্তি। সঠিক খাদ্য তালিকা অনুসরণে খাবারের অপচয় কমে এবং দৈনিক ওজন বৃদ্ধি নিশ্চিত হয়।',
    keyPointsBn: [
      'গরুর দৈহিক ওজনের ১.৫%-২% হবে দানাদার খাবার',
      'কাঁচা ঘাস ও শুকনা খড়ের সঠিক অনুপাত রাখা',
      'খাবারের সময়সূচি নির্দিষ্ট রাখা'
    ],
    sections: [
      {
        headingBn: 'খাদ্য তালিকার সহজ নিয়ম',
        contentBn: [
          'প্রতি ১০০ কেজি গরুর ওজনের জন্য ১.৫ কেজি থেকে ২ কেজি দানাদার ফিড প্রয়োজন। অর্থাৎ ৩০০ কেজি ওজনের গরুর জন্য ৪.৫ থেকে ৬ কেজি দানাদার খাদ্য প্রয়োজন।'
        ]
      }
    ]
  },
  {
    id: 'guide-4',
    slug: 'dairy-cow-daily-feed-chart',
    titleBn: 'গাভীর যত্ন ও খাদ্য ব্যবস্থাপনা (দুধ উৎপাদন বৃদ্ধি)',
    subtitleBn: 'দুধ উৎপাদন বৃদ্ধি ও নিয়মিত হিটে আনার খাদ্য ব্যবস্থাপনা',
    categoryBn: 'গাভীর যত্ন',
    readTimeBn: '৫ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য কনসালট্যান্ট টিম',
    status: 'published',
    featured: true,
    summaryBn: 'উচ্চ উৎপাদনশীল গাভীকে তার রক্ষণাবেক্ষণ এবং দুধের পরিমাণের উপর ভিত্তি করে খাবার দিতে হয়। দুধ দোয়ানোর ক্যালসিয়াম ঘাটতি পূরণে লিকুইড ক্যালসিয়াম ও ভিটামিন এইচ অত্যন্ত কার্যকর ভূমিকা রাখে।',
    keyPointsBn: [
      'গাভীর রক্ষণাবেক্ষণে ২ কেজি এবং প্রতি ৩ লিটার দুধে ১ কেজি দানাদার',
      'প্রসবের পর নিয়মিত লিকুইড ক্যালসিয়াম ৫০-১০০ মিলি',
      'সবুজ তাজা ঘাস দৈনিক অন্তত ১৫-২০ কেজি',
      'সঠিক সময়ে কৃমিনাশক ও মেস্টাইটিস প্রতিরোধমূলক যত্ন'
    ],
    sections: [
      {
        headingBn: 'দুধের ফ্যাট ও ঘনত্ব বৃদ্ধির উপায়',
        contentBn: [
          'দুধের ফ্যাট মূলত আসে রুমেনে তৈরি হওয়া অ্যাসিটেট থেকে যা আসে কাঁচা ঘাস ও শুকনা খড়ের ভালো আঁশ থেকে। তাই গাভীকে কখনই শুধু দানাদার খাবার দেওয়া যাবে না, পর্যাপ্ত কাঁচা ঘাস ও খড় দেওয়া আবশ্যক।'
        ]
      }
    ]
  },
  {
    id: 'guide-5',
    slug: 'bull-cattle-feed-management',
    titleBn: 'ষাঁড় গরুর খাদ্য ব্যবস্থাপনা ও পেশির বিকাশ',
    subtitleBn: 'কুরবানির বড় ষাঁড় ও প্রজনন ষাঁড়ের বিশেষ পুষ্টি গাইড',
    categoryBn: 'গরু মোটাতাজাকরণ',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    author: 'ভেটেরিনারি সার্ভিসেস',
    status: 'published',
    featured: false,
    summaryBn: 'বড় ষাঁড় গরুর হাড়ের মজবুতি ও পেশিবহুল শারীরিক গঠনের জন্য জৈব জিংক, অ্যামিনো এসিড ও উচ্চ মেটাবলাইজেবল এনার্জি ফিড প্রয়োজন।',
    keyPointsBn: [
      'হাড় ও পেশির সামঞ্জস্যপূর্ণ বৃদ্ধি',
      'ত্বক ও লোমের উজ্জ্বলতা বৃদ্ধিতে অর্গানিক জিংক',
      'অ্যাসিডোসিস রোধে বাফার মিক্স'
    ],
    sections: [
      {
        headingBn: 'ষাঁড় গরুর স্পেশাল ডায়েট',
        contentBn: [
          'বড় জাতের ষাঁড় যেমন ব্রাহমা বা শাহিওয়ালকে প্রোটিন ১৮-১৯% যুক্ত পেলিট ফিডের পাশাপাশি ভুট্টার সাইলেজ দিলে দ্রুত বডি শেপ চমৎকার হয়।'
        ]
      }
    ]
  },
  {
    id: 'guide-6',
    slug: 'cattle-nutrition-minerals-guide',
    titleBn: 'গরুর জন্য সাপ্লিমেন্ট ব্যবহারের প্রয়োজনীয়তা ও উপকারিতা',
    subtitleBn: 'অদৃশ্য পুষ্টি ঘাটতি কীভাবে খামারের বড় লোকসান তৈরি করে',
    categoryBn: 'স্বাস্থ্য পরিচর্যা',
    readTimeBn: '৩ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য পুষ্টি গবেষণা',
    status: 'published',
    featured: false,
    summaryBn: 'ক্যালসিয়াম, ফসফরাস, আয়রন, জিংক, কপার ও সেলেনিয়ামের মতো খনিজের ঘাটতি থাকলে গরু ঠিকমতো খায় না, হিটে আসে না এবং গর্ভধারণ ব্যর্থ হয়।',
    keyPointsBn: [
      'মাটি চাটা ও নিজের গা চাটা বন্ধে মিনারেল মিক্স অত্যন্ত জরুরি',
      'গাভীর ওলান ও ত্বকের স্বাস্থ্য ভালো রাখে অর্গানিক জিংক ও ভিটামিন এইচ',
      'বাছুরের দ্রুত বৃদ্ধি নিশ্চিত করে ক্যালসিয়াম ও ভিটামিন ডি৩'
    ],
    sections: [
      {
        headingBn: 'দৈনিক মাত্রায় মিনারেল ব্যবহার',
        contentBn: [
          'প্রতিটি বড় গরুকে দৈনিক ৩০-৫০ গ্রাম ভাইটাল মিনারেল খাবারের সাথে মিশিয়ে দেওয়া হলে অন্যান্য বড় ধরনের অসুখ ও প্রজনন সমস্যা থেকে প্রায় ৯০% মুক্ত থাকা সম্ভব।'
        ]
      }
    ]
  },
  {
    id: 'guide-7',
    slug: 'seasonal-cattle-care-tips',
    titleBn: 'গরুর সাধারণ স্বাস্থ্য পরিচর্যা ও রোগ প্রতিরোধ',
    subtitleBn: 'বর্ষা, শীত ও তীব্র গরমে খামারের গবাদিপশু সুস্থ রাখার গাইড',
    categoryBn: 'স্বাস্থ্য পরিচর্যা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
    author: 'ড. মো: সাইফুর রহমান',
    status: 'published',
    featured: false,
    summaryBn: 'ঋতু পরিবর্তনের সময় গবাদিপশু সবচেয়ে বেশি রোগে আক্রান্ত হয়। সঠিক যত্ন, শেডের তাপমাত্রা নিয়ন্ত্রণ ও পরিচ্ছন্নতা রোগবালাই থেকে খামারকে নিরাপদ রাখে।',
    keyPointsBn: [
      'গ্রীষ্মকালে ইলেকট্রোলাইট ও অতিরিক্ত পানি সরবরাহ',
      'বর্ষাকালে খুরপাকা রোগ থেকে বাঁচতে মেঝে শুকনো রাখা',
      'শীতকালে বাছুরের কুয়াশা ও ঠাণ্ডা বাতাস থেকে রক্ষা'
    ],
    sections: [
      {
        headingBn: 'শেড জীবাণুমুক্তকরণ রুটিন',
        contentBn: [
          'সপ্তাহে অন্তত একবার পুরো শেডে ব্লিচিং পাউডার বা জীবাণুনাশক স্প্রে করুন। খাবারের পাত্র ও পানির পাত্র প্রতিদিন পরিষ্কার পানি দিয়ে ধুয়ে পরিষ্কার রাখুন।'
        ]
      }
    ]
  },
  {
    id: 'guide-8',
    slug: 'raw-materials-role-in-feed',
    titleBn: 'গরুর খাবারে ফিড কাঁচামালের ভূমিকা ও গুণগত মান পরীক্ষা',
    subtitleBn: 'ভুট্টা ভাঙা, সয়াবিন মিল, রাইস পলিশ ও খৈলের কার্যকারিতা',
    categoryBn: 'খাদ্য ব্যবস্থাপনা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য ফিড ল্যাব',
    status: 'published',
    featured: false,
    summaryBn: 'খামারে নিজে খাদ্য প্রস্তুত করার সময় কাঁচামালের আদ্রতা ও গুঁড়া মান যাচাই করা জরুরি। ভালো মানের ভুট্টা ও খাঁটি সয়াবিন মিল খাদ্যের প্রধান শক্তি ও প্রোটিন নিশ্চিত করে।',
    keyPointsBn: [
      'ভুট্টায় আদ্রতা ১২% এর নিচে থাকা আবশ্যক',
      'সয়াবিন মিল প্রোটিনের সেরা উৎস (৪৫%+)',
      'খৈল ব্যবহারের পূর্বে ছত্রাক ও ফাঙ্গাস পরীক্ষা'
    ],
    sections: [
      {
        headingBn: 'কাঁচামাল সংরক্ষণের নিয়ম',
        contentBn: [
          'ফিড কাঁচামাল মেঝেতে সরাসরি না রেখে কাঠের প্যালেটের উপর রাখুন এবং আর্দ্রতামুক্ত শুষ্ক স্থানে সংরক্ষণ করুন।'
        ]
      }
    ]
  },
  {
    id: 'guide-9',
    slug: 'cattle-fattening-common-mistakes',
    titleBn: 'গরু মোটাতাজাকরণের সময় যেসব ভুল এড়িয়ে চলবেন',
    subtitleBn: 'খামারিদের সাধারণ ১০টি ভুল যা লোকসানের প্রধান কারণ',
    categoryBn: 'খামার ব্যবস্থাপনা',
    readTimeBn: '৪ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    author: 'খামারি কাব্য কনসালট্যান্ট টিম',
    status: 'published',
    featured: false,
    summaryBn: 'হঠাৎ খাবার পরিবর্তন, কৃমিনাশক না দেওয়া, ক্ষতিকর হরমোন বা স্টেরয়েড ব্যবহার খামারের জন্য মারাত্মক ক্ষতির কারণ হতে পারে। বৈজ্ঞানিক নিয়ম মেনেই লাভ সম্ভব।',
    keyPointsBn: [
      'হঠাৎ খাবারের মাত্রা না বাড়ানো',
      'কৃমিনাশক ছাড়া শুধু ফিড না খাওয়ানো',
      'ক্ষতিকর স্টেরয়েড বা ইনজেকশন পুরোপুরি নিষিদ্ধ'
    ],
    sections: [
      {
        headingBn: 'সঠিক পরিবর্তন পদ্ধতি',
        contentBn: [
          'নতুন কোনো খাবার বা ফিড শুরু করার সময় ৫-৭ দিন ধরে ধীরে ধীরে পুরানো খাবারের সাথে নতুন খাবার মিশিয়ে গরুর পাকস্থলীকে খাপ খাওয়াতে হয়।'
        ]
      }
    ]
  },
  {
    id: 'guide-10',
    slug: 'farm-hygiene-and-sanitation',
    titleBn: 'খামারে পরিষ্কার-পরিচ্ছন্নতার গুরুত্ব ও জীবাণুমুক্তকরণ',
    subtitleBn: 'রোগবালাই ৮০% কমিয়ে আনার সহজ খামার ব্যবস্থাপনা',
    categoryBn: 'খামার ব্যবস্থাপনা',
    readTimeBn: '৩ মিনিট পাঠ',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    author: 'ভেটেরিনারি হেলথ সার্ভিস',
    status: 'published',
    featured: false,
    summaryBn: 'মেঝে নিয়মিত পরিষ্কার না করলে পায়ে ক্ষত, খুরপাকা ও ওলান ফোলা রোগ হতে পারে। প্রতিদিন গোবর অপসারণ ও শুকনা মেঝে নিশ্চিত করা স্বাস্থ্যকর খামারের শর্ত।',
    keyPointsBn: [
      'প্রতিদিন দুইবার গোবর ও মূত্র নিষ্কাশন',
      'পানির পাত্র নিয়মিত ধুয়ে পরিষ্কার রাখা',
      'মাছি ও মশা তাড়ানোর নিরাপদ ব্যবস্থা'
    ],
    sections: [
      {
        headingBn: 'জৈব নিরাপত্তা বা বায়োসিকিউরিটি',
        contentBn: [
          'খামারের প্রবেশমুখে পটাশ জলের ফুটবাথ রাখুন যেন বাইরে থেকে আসা জুতার মাধ্যমে জীবাণু শেডে না প্রবেশ করতে পারে।'
        ]
      }
    ]
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hotlinePhone: '01712-345678',
  whatsappNumber: '8801712345678',
  facebookUrl: 'https://facebook.com/khamarikabbo',
  email: 'info@khamarikabbo.com',
  addressBn: 'প্রধান কার্যালয় ও কেন্দ্রীয় ওয়্যারহাউস: শ্রীপুর রোড, মাওনা চৌরাস্তা, গাজীপুর, বাংলাদেশ',
  deliveryChargeDhaka: 120,
  deliveryChargeOutside: 180,
  freeDeliveryThreshold: 5000,
  announcementTextBn: '🚚 সারা বাংলাদেশে দ্রুত ক্যাটল ফিড ও সাপ্লিমেন্ট হোম ডেলিভারি দেওয়া হচ্ছে! ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।',
  showAnnouncement: true,
  websiteName: 'Khamari Kabbo',
  bengaliName: 'খামারি কাব্য',
  tagline: 'খামারের যত্নে, খামারির পাশে',
  heroHeading: 'আপনার খামারের প্রয়োজনীয় सबकुछ, এক জায়গায়',
  heroDescription: 'গরুর খাদ্য, ফিড কাঁচামাল, সাপ্লিমেন্ট, ঔষধ ও প্রয়োজনীয় কম্বিনেশন—সহজে অর্ডার করুন।',
  heroImage: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80',
  heroButtonText: 'পণ্য দেখুন',
  heroButtonLink: '#categories',
  footerText: '© 2026 খামারি কাব্য — সর্বস্বত্ব সংরক্ষিত। গবাদিপশুর খাদ্য ও পুষ্টি সুরক্ষায় আপনার বিশ্বস্ত ডিজিটাল অংশীদার।',
  sectionVisibility: {
    hero: true,
    categories: true,
    featuredProducts: true,
    combination: true,
    guide: true,
    whyUs: true,
    howToOrder: true,
    trust: true,
    contact: true
  }
};

export const BANGLADESH_DISTRICTS = [
  'ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'নরসিংদী', 'মানিকগঞ্জ', 'মুন্সীগঞ্জ', 'টাঙ্গাইল', 'কিশোরগঞ্জ', 'ফরিদপুর', 'মাদারীপুর', 'শরীয়তপুর', 'গোপালগঞ্জ', 'রাজবাড়ী',
  'চট্টগ্রাম', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'নোয়াখালী', 'ফেনী', 'লক্ষ্মীপুর', 'কক্সবাজার',
  'রাজশাহী', 'পাবনা', 'সিরাজগঞ্জ', 'বগুড়া', 'নাটোর', 'নওগাঁ', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট',
  'রংপুর', 'দিনাজপুর', 'গাইবান্ধা', 'কুড়িগ্রাম', 'নীলফামারী', 'লালমনিরহাট', 'ঠাকুরগাঁও', 'পঞ্চগড়',
  'খুলনা', 'যশোর', 'ঝিনাইদহ', 'কুষ্টিয়া', 'মাগুরা', 'নড়াইল', 'সাতক্ষীরা', 'বাগেরহাট', 'চুয়াডাঙ্গা', 'মেহেরপুর',
  'বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি',
  'সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ',
  'ময়মনসিংহ', 'জামালপুর', 'শেরপুর', 'নেত্রকোণা'
];
