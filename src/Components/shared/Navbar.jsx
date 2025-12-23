import { useState } from 'react';
import { Link , NavLink, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo/port-city-piirs-logo_neon.png';
import ThemeChange from './ThemeChange';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Demo - পরে authentication থেকে আসবে
  // const user = {
  //   name: "John Doe",
  //   email: "john@example.com",
  //   photo: "https://i.pravatar.cc/150?img=12"
  // };
  const {user, logOut} = useAuth();
  const navigate = useNavigate();
    const handleLogOut = async () => {
    await logOut()
    .then(()=>{
        navigate('/');
        console.log('Log out successful!');
        
    });
    
  };

  const isLoggedIn = true; // Demo

  // Mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Profile dropdown toggle
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close mobile menu when link clicked
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg md:sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button 
            onClick={toggleMenu}
            className="btn btn-ghost btn-circle"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Logo */}
        <Link to="/" className="">
          <img src={logo} alt="" width="300px" height="50px" />
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><NavLink to="/" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>Home</NavLink></li>
          <li>{user ? (<NavLink to="/dashboard" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>Dashboard</NavLink>) : 
          (<NavLink to="/register" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>Register</NavLink>)}</li>
          <li><NavLink to="/all-issues" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>All Issues</NavLink></li>
          <li><NavLink to="/dashboard/my-issues" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""} >My Issues</NavLink></li>
          <li><NavLink to="/about" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>About</NavLink></li>
          <li><NavLink to="/contact" className={({isActive})=> isActive ? "btn btn-outline btn-secondary" : ""}>Contact</NavLink></li>
          <li> <ThemeChange></ThemeChange> </li>
        </ul>
      </div>
      
      {/* Profile/Login */}
      <div className="navbar-end">
       
        {user ? (
          <div className="dropdown dropdown-end">
            <button 
              onClick={toggleProfile}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.photoURL} alt={user?.displayName} referrerPolicy='no-referrer' />
              </div>
            </button>
            {user && (
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user.displayName}</span>
                  <span className="text-xs opacity-60">{user.email}</span>
                </li>
                <li><Link to="/dashboard" onClick={() => setIsProfileOpen(false)}>Dashboard</Link></li>
                <li><Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link></li>
                <li><button onClick={()=>{handleLogOut()}} >Logout</button></li>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link> 
        )}
      </div>

      {/* Mobile Menu Drawer - Full Screen */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-lg z-40">
          <ul className="menu menu-vertical w-full p-4 gap-2">
            <li>
              <Link to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-issues" onClick={closeMobileMenu}>
                All Issues
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
            
            {/* Mobile - If logged in show dashboard/logout */}
            {isLoggedIn && (
              <>
                <div className="divider"></div>
                <li>
                  <Link to="/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={closeMobileMenu}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={closeMobileMenu}>
                    Logout
                  </button>
                </li>
              </>
            )}
            
            {/* Mobile - If not logged in */}
            {!isLoggedIn && (
              <>
                <div className="divider"></div>
                <li>
                  <Link to="/login" className="btn btn-primary" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;