import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const newLoad = `  const loadAllData = async () => {
    try {
      const localProds = localStorage.getItem('khamari_products_v1');
      const localCats = localStorage.getItem('khamari_categories_v1');
      const localSets = localStorage.getItem('khamari_settings_v1');
      const localGuides = localStorage.getItem('khamari_guides_v1');
      
      const seedData = (!localProds || !localCats || !localSets || !localGuides) 
        ? await import('../data/seedData') 
        : null;

      if (localProds) {
        setProducts(JSON.parse(localProds));
      } else if (seedData) {
        setProducts(seedData.INITIAL_PRODUCTS);
      }
      
      if (localCats) {
        setCategories(JSON.parse(localCats));
      } else if (seedData) {
        setCategories(seedData.INITIAL_CATEGORIES);
      }

      if (localSets) {
        setSiteSettings(JSON.parse(localSets));
      } else if (seedData) {
        setSiteSettings(seedData.INITIAL_SITE_SETTINGS);
      }

      if (localGuides) {
        setGuides(JSON.parse(localGuides));
      } else if (seedData) {
        setGuides(seedData.INITIAL_GUIDE_ARTICLES);
      }
      
      setIsLoading(false); // Instantly stop loading to show cached/seed data
    } catch (e) {
      console.warn('Error reading local cache', e);
      setIsLoading(true);
    }

    try {
      const [prods, cats, ords, sets, gds] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchSiteSettings(),
        fetchGuides()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSiteSettings(sets);
      setGuides(gds);
    } catch (err) {
      console.error('Error loading store data:', err);
    }
  };`;

content = content.replace(
  /  const loadAllData = async \(\) => {[\s\S]*?console\.error\('Error loading store data:', err\);\n    }\n  };/,
  newLoad
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Patched loadAllData full fallback");
