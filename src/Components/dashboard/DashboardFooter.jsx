// src/components/dashboard/DashboardFooter.jsx

const DashboardFooter = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300">
      <aside>
        <p className="text-sm">
          Copyright © {new Date().getFullYear()} - Port City PIIRS. All rights reserved.
        </p>
      </aside>
    </footer>
  );
};

export default DashboardFooter;