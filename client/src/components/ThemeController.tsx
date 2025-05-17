import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeController = () => {
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button className="btn btn-ghost btn-circle" onClick={() => setDark((d) => !d)}>
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeController;
