import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  LogOut,
  Plane,
  Settings,
  Menu,
  Plus,
  User2,
} from "lucide-react";
import styles from "./NavBar.module.css";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../isMobile.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext.jsx";

const NavBar = ({ components }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useUser();
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [sidebarItems, setSidebarItems] = useState([
    { id: "home", label: "Home", icon: Home, active: false, route: `/blog` },
    {
      id: "join",
      label: "Join a trip",
      icon: Users,
      active: false,
      route: "/swipe",
    },
    {
      id: "create",
      label: "Create a trip",
      icon: Plus,
      active: false,
      route: "/AddTrip",
    },
    {
      id: "plans",
      label: "Travel plans",
      icon: Calendar,
      active: false,
      route: "/trips",
    },
    {
      id: "chats",
      label: "Chats",
      icon: MessageSquare,
      active: false,
      route: "/chats",
    },
    { id: "Profile", label: "Profile", icon: User2, active: false ,route:"/profile" },
  ]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    const path = location.pathname;
    sidebarItems.forEach((item) => {
      item.active = item.route === path;
    });
    setSidebarItems([...sidebarItems]);
  }, []);

  const setActive = (id) => {
    setSidebarItems(
      sidebarItems.map((i) => {
        return { ...i, active: i.id === id };
      })
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    toast.info("Logging User Out");
    setTimeout(() => {
      sessionStorage.removeItem("userToken");
      dispatch({ type: "CLEAR_USER" });
      navigate("/", { replace: true });
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.close}`}
        ref={sidebarRef}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Plane size={24} className={styles.logoIcon} />
            <span className={styles.logoText}>Travel</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => (
            <div key={item.id} onClick={() => {setActive(item.id); isMobile && toggleSidebar();}}>
              <Link
                className={`${styles.sidebarItem} ${
                  item.active ? styles.activeItem : ""
                }`}
                to={item.route}
              >
                <div className={styles.sidebarItemContent}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
              </Link>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.headerButton} onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <div className={styles.headerActions}>
            <button className={styles.headerButton}>
              <Settings size={20} />
            </button>
            <button className={styles.headerButton}>
              <MessageSquare size={20} />
            </button>
            <div
              className={styles.profileButton}
              ref={dropdownRef}
              onClick={toggleDropdown}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                alt="Profile"
                className={styles.profileImage}
              />
              {isDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {components}
      </div>
    </div>
  );
};

export default NavBar;
