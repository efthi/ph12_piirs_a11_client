import { Outlet } from 'react-router';
import DashboardNavbar from '../../Components/dashboard/DashboardNav';
import Sidebar from '../../Components/dashboard/Sidebar';
import DashboardFooter from '../../Components/dashboard/DashboardFooter';

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <DashboardNavbar />
        
        {/* Page Content */}
        <main className="flex-1 p-6 bg-base-200">
          <Outlet />
        </main>
        
        {/* Footer */}
        <DashboardFooter />
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;