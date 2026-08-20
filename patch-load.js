import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const newLoad = `  const loadAllData = async () => {
    try {
      const localProds = localStorage.getItem('khamari_products_v1');
      const localCats = localStorage.getItem('khamari_categories_v1');
      const localSets = localStorage.getItem('khamari_settings_v1');
      const localGuides = localStorage.getItem('khamari_guides_v1');
      
      if (localProds) setProducts(JSON.parse(localProds));
      if (localCats) setCategories(JSON.parse(localCats));
      if (localSets) setSiteSettings(JSON.parse(localSets));
      if (localGuides) setGuides(JSON.parse(localGuides));
      
      if (localProds) setIsLoading(false);
    } catch (e) {
      console.warn('Error reading local cache', e);
    }

    if (!localStorage.getItem('khamari_products_v1')) {
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
    } finally {
      setIsLoading(false);
    }
  };`;

content = content.replace(
  "  const loadAllData = async () => {\n    setIsLoading(true);\n    try {\n      const [prods, cats, ords, sets, gds] = await Promise.all([\n        fetchProducts(),\n        fetchCategories(),\n        fetchOrders(),\n        fetchSiteSettings(),\n        fetchGuides()\n      ]);\n      setProducts(prods);\n      setCategories(cats);\n      setOrders(ords);\n      setSiteSettings(sets);\n      setGuides(gds);\n    } catch (err) {\n      console.error('Error loading store data:', err);\n      showToast('ডাটা লোড করতে সমস্যা হয়েছে। লোকাল মেমোরি ব্যবহার করা হচ্ছে।', 'warning');\n    } finally {\n      setIsLoading(false);\n    }\n  };",
  newLoad
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Patched loadAllData");
