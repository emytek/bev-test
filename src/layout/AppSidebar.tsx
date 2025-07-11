import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  // CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  // ListIcon,
  // PageIcon,
  // TableIcon,
  // UserCircleIcon,
} from "../icons";
import { 
  LuFactory, LuPackage, LuTruck, 
  LuSettings, LuUsers, 
  LuTrendingUp
} from "react-icons/lu";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { BiBarcodeReader } from "react-icons/bi";
import { useAuth } from "../hooks/useAuth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isAdmin = user?.userRole === "Admin";

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      subItems: [{ name: "Overview", path: "/dashboard", pro: false }],
    },
    {
      icon: <LuFactory />,
      name: "Production Management",
      subItems: [{ name: "Manufacturing Insights", path: "/production", pro: false },
        { name: "Process Production", path: "/production-details", pro: false },
      ],
    },
    {
      icon: <LuTrendingUp />,
      name: "Sales",
      subItems: [{ name: "Sales Overview", path: "/sales", pro: false },
        { name: "Process Sales", path: "/sales-details", pro: false },
      ],
    },
    {
      icon: <LuPackage />,
      name: "Stores Operation",
      path: "/stores",
    },
    {
      icon: <LuTruck />,
      name: "WareHouse Dispatch",
      path: "/warehouse",
    },
    // {
    //   name: "Inventory Overview",
    //   icon: <LuDatabase />,
    //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    // },
    {
      name: "Barcode Scanner",
      icon: <BiBarcodeReader />,
      subItems: [{ name: "Scan code", path: "/scanner", pro: false }],
    }
  ];
  
  const othersItems: NavItem[] = [
    // {
    //   icon: <PieChartIcon />,
    //   name: "Charts",
    //   subItems: [
    //     { name: "Line Chart", path: "/line-chart", pro: false },
    //     { name: "Bar Chart", path: "/bar-chart", pro: false },
    //   ],
    // },
    // {
    //   icon: <BoxCubeIcon />,
    //   name: "UI Elements",
    //   subItems: [
    //     { name: "Alerts", path: "/alerts", pro: false },
    //     { name: "Avatar", path: "/avatars", pro: false },
    //     { name: "Badge", path: "/badge", pro: false },
    //     { name: "Buttons", path: "/buttons", pro: false },
    //     { name: "Images", path: "/images", pro: false },
    //     { name: "Videos", path: "/videos", pro: false },
    //   ],
    // },
    // {
    //   icon: <PlugInIcon />,
    //   name: "Authentication",
    //   subItems: [
    //     { name: "Sign In", path: "/signin", pro: false },
    //     { name: "Sign Up", path: "/signup", pro: false },
    //   ],
    // },
    {
      name: "Settings & Configuration",
      icon: <LuSettings />,
      subItems: [
        { name: "Change Password", path: "/change-password", pro: false },
        { name: "Theme Display", path: "/theme", pro: false }
      ],
    },
    // Conditionally include "User Directory" based on isAdmin
    ...(isAdmin
      ? [
          {
            name: "User Directory",
            icon: <LuUsers />,
            subItems: [
              { name: "Manage Users", path: "/user-list", pro: false },
              { name: "Create User", path: "/create-user", pro: false },
            ],
          },
        ]
      : []), // If not admin, add an empty array, which adds nothing
  ];

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link
          to="/"
          // className="hidden sm:block"
        >
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden w-[45px] h-[20px] lg:w-[80px] lg:h-[40px]"
                src="/images/logo/wyze.png"
                alt="Logo"
              />
              <img
                className="hidden dark:block w-[45px] h-[20px] lg:w-[80px] lg:h-[40px]"
                src="/images/logo/wyze.png"
                alt="Logo"
              />
            </>
          ) : (
            <img
              className="w-[45px] h-[20px] lg:w-[80px] lg:h-[40px]"
              src="/images/logo/wyze.png"
              alt="Logo"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
