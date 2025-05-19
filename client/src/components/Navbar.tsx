import { BookmarkCheck, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeController from "./ThemeController";
import { type Dispatch, type SetStateAction } from "react";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <header className="fixed top-0 left-0 w-full h-20 bg-card/90 backdrop-blur border-b border-gray-200 px-6 flex items-center justify-between z-50 shadow-lg">
    <div className="flex items-center gap-3">
      <Menu
        className="text-primary-500 cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <span className="text-2xl font-bold flex items-center gap-2 tracking-tight">
        <BookmarkCheck className="text-primary-500" />
        <Link to="/">TaskFlow</Link>
      </span>
    </div>
    <div className="flex items-center gap-4">
      <ThemeController />
      <Link to="/profile" className="avatar">
        <div className="w-10 rounded-full ring ring-primary-500 ring-offset-2">
          <img
            src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            alt="User avatar"
          />
        </div>
      </Link>
    </div>
  </header>
);

export default Navbar;
