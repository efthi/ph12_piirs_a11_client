import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Users,
  UserCog,
  CreditCard,
  Home,
  Settings,
  AlertCircle,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import testimage from "../../assets/logo/port-city-piirs-logo_neon.png";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Sidebar = () => {
  const location = useLocation();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await logOut()
    .then(()=>{
        navigate('/login');
        console.log('Log out successful!');
        
    });
    
  };

  const axiosSec = useAxiosSecure();
  const {data, isLoading, isError} = useQuery({
    queryKey: ["sidebar-role", user?.email],
    queryFn: async ()=> {
      const res = await axiosSec.get(`/api/get-user-data/${user.email}`);
      return res.data;
    },
    enabled:!!user.email,
  });
  const userData = data || [];
//  console.log(userData.role);
    

  // Role-based menu configuration
  const getMenuItems = (role) => {
    const commonItems = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ];

    const roleSpecificItems = {
      citizen: [
        { icon: FileText, label: "My Issues", path: "/dashboard/my-issues" },
        {
          icon: PlusCircle,
          label: "Report Issue",
          path: "/dashboard/report-issue",
        },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ],
      staff: [
        {
          icon: FileText,
          label: "Assigned Issues",
          path: "/dashboard/assigned-issues",
        },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ],
      admin: [
        {
          icon: AlertCircle,
          label: "All Issues",
          path: "/dashboard/all-issues",
        },
        {
          icon: PlusCircle,
          label: "Create Staff",
          path: "/dashboard/add-staff",
        },
        {
          icon: UserCog,
          label: "Manage Staff",
          path: "/dashboard/manage-staff",
        },
        { icon: Users, label: "Manage Users", path: "/dashboard/manage-users" },
        { icon: CreditCard, label: "Payments", path: "/dashboard/payment-history" },
        { icon: User, label: "Profile", path: "/dashboard/profile" },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[role] || [])];
  };

  const menuItems = getMenuItems(userData.role);

  return (
    <aside className="min-h-full w-64 bg-base-100 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-base-300">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          {/* <div className="bg-primary p-2 rounded-lg">
            <AlertCircle className="text-primary-content" size={24} />
          </div> */}
            <img src={testimage} alt="" />
          {/* <div>
            <h2 className="font-bold text-lg">Port City PIIRS</h2>
            <p className="text-xs opacity-60 capitalize">{userRole} Panel</p>
          </div> */}
        </Link>
      </div>

      {/* Menu Items */}
      <ul className="menu menu-lg p-4 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link to={item.path} className={isActive ? "active" : ""}>
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}

        <div className="divider">Other</div>

        <li>
          <Link to="/">
            <Home size={20} />
            Home
          </Link>
        </li>
        <li>
          <a className="text-error" onClick={()=>{handleLogOut()}}>
            <LogOut size={20} />
            Logout
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
