import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Also apply the fix to isAdminOpen
content = content.replace(
  "  const [isAdminOpen, setIsAdminOpen] = useState(false);",
  `  const [isAdminOpenState, setIsAdminOpenState] = useState(false);
  const setIsAdminOpen = (open: boolean) => {
    if (open) pushModal();
    else if (window.history.state?.modalOpen) window.history.back();
    setIsAdminOpenState(open);
  };
  const isAdminOpen = isAdminOpenState;`
);

content = content.replace(
  "      setIsCalculatorOpenState(false);",
  "      setIsCalculatorOpenState(false);\n      setIsAdminOpenState(false);"
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Patched isAdminOpen successfully");
