import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Replace standard state hooks for modals
content = content.replace(
  "  const [isCartOpen, setIsCartOpen] = useState(false);\n" +
  "  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);\n" +
  "  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);\n" +
  "  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);\n" +
  "  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(null);\n" +
  "  const [isAdminOpen, setIsAdminOpen] = useState(false);\n" +
  "  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);",
  
  `  const [isCartOpenState, setIsCartOpenState] = useState(false);
  const [isCheckoutOpenState, setIsCheckoutOpenState] = useState(false);
  const [isSuccessModalOpenState, setIsSuccessModalOpenState] = useState(false);
  const [selectedProductState, setSelectedProductState] = useState<Product | null>(null);
  const [selectedGuideState, setSelectedGuideState] = useState<GuideArticle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCalculatorOpenState, setIsCalculatorOpenState] = useState(false);

  const pushModal = () => {
    window.history.pushState({ modalOpen: true }, '');
  };

  const setIsCartOpen = (open: boolean) => {
    if (open) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setIsCartOpenState(open);
  };

  const setIsCheckoutOpen = (open: boolean) => {
    if (open) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setIsCheckoutOpenState(open);
  };

  const setIsSuccessModalOpen = (open: boolean) => {
    if (open) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setIsSuccessModalOpenState(open);
  };

  const setSelectedProduct = (p: Product | null) => {
    if (p) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setSelectedProductState(p);
  };

  const setSelectedGuide = (g: GuideArticle | null) => {
    if (g) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setSelectedGuideState(g);
  };

  const setIsCalculatorOpen = (open: boolean) => {
    if (open) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setIsCalculatorOpenState(open);
  };
  
  const isCartOpen = isCartOpenState;
  const isCheckoutOpen = isCheckoutOpenState;
  const isSuccessModalOpen = isSuccessModalOpenState;
  const selectedProduct = selectedProductState;
  const selectedGuide = selectedGuideState;
  const isCalculatorOpen = isCalculatorOpenState;`
);

// Modify handlePopState
content = content.replace(
  "    const handlePopState = () => {\n      handleInitialRoute();\n    };",
  `    const handlePopState = () => {
      setIsCartOpenState(false);
      setIsCheckoutOpenState(false);
      setIsSuccessModalOpenState(false);
      setSelectedProductState(null);
      setSelectedGuideState(null);
      setIsCalculatorOpenState(false);
      handleInitialRoute();
    };`
);

// Fix handleInitialRoute
content = content.replace(
  "      if (validRoutes.includes(hash as AppRoute) || hash.startsWith('search')) {\n        setCurrentRouteState(hash.startsWith('search') ? 'search' : (hash as AppRoute));\n      }\n    }\n  };",
  `      if (validRoutes.includes(hash as AppRoute) || hash.startsWith('search')) {
        setCurrentRouteState(hash.startsWith('search') ? 'search' : (hash as AppRoute));
      }
    } else {
      setCurrentRouteState('home');
    }
  };`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Patched successfully");
