import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const DashboardNav = () => {
 
  const axiosSec = useAxiosSecure();
  const {user, logOut} = useAuth();
  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    await logOut()
    .then(()=>{
        navigate('/login');
        console.log('Log out successful!');
        
    });
    
  };

     //get userData from DB
  const {data, isLoading, error} = useQuery({
    queryKey: ['dashboard-role', user.email],
    queryFn : async () => {
      const res = await axiosSec.get(`/api/get-user-data/${user.email}`);
      return res.data;
    }
  });

  const userData = data || [];
  console.log(userData.role);
  
 
  
  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      {/* Mobile Menu Toggle */}
      <div className="flex-none lg:hidden">
        <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
          <Menu size={24} />
        </label>
      </div>

      {/* Page Title */}
      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Right Side */}
      <div className="flex-none gap-2">
        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.photoURL} alt={user.displayName} />
            </div>
          </label>
          <ul className="dropdown-content mt-3 z-[1] p-2 shadow menu menu-sm bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span className="text-base font-bold">{user.displayName}</span>
              <span className="text-xs opacity-60">{user.email}</span>
              <span className="badge badge-primary badge-sm mt-1 capitalize">{userData.role}</span>
            </li>
            <div className="divider my-1"></div>
            <li><Link to="/dashboard/profile">Profile</Link></li>
            <li><Link to="/dashboard/settings">Settings</Link></li>
            <div className="divider my-1"></div>
            <li>
              
              <button className="text-error" onClick={()=>{handleLogOut()}}>
            <LogOut size={16} />
            Logout
          </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;