import { useTheme } from "next-themes";
import { BsSun } from "react-icons/bs";
import { FaRegMoon } from "react-icons/fa";

export const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => {
        if (resolvedTheme === "dark") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      }}
      className="flex w-full items-center gap-4 rounded-md px-2.5 py-2 transition duration-200 hover:bg-slate-200"
    >
      <span>
        {resolvedTheme === "light" && <BsSun size={20} />}
        {resolvedTheme === "dark" && <FaRegMoon size={20} />}
      </span>
      <span className="text-sm">Theme</span>
    </button>
  );
};
