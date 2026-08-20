import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const newLoad = `  const loadAllData = async () => {
    try {
      const localProds = localStorage.getItem('khamari_products_v1');
      const localCats = localStorage.getItem('khamari_categories_v1');
      const localSets = localStorage.getItem('khamari_settings_v1');
      const localGuides = localStorage.getItem('khamari_guides_v1');
      
      if (localProds) {
        setProducts(JSON.parse(localProds));
      } else {
        // Fallback to avoid loading screen
        const seedData = await import('../data/seedData');
        setProducts(seedData.INITIAL_PRODUCTS);
      }
      
      if (localCats) setCategories(JSON.parse(localCats));
      if (localSets) setSiteSettings(JSON.parse(localSets));
      if (localGuides) setGuides(JSON.parse(localGuides));
      
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
  /  const loadAllData = async \(\) => {[\s\S]*?finally {\s*setIsLoading\(false\);\s*}\s*};/,
  newLoad
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Patched loadAllData twice");
