import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine title based on path
  let title = "Dashboard";
  if (location.pathname.includes("map")) title = "Map View";
  if (location.pathname.includes("reports")) title = "Reports";

  return (
    <div className="bg-surface text-on-background min-h-screen overflow-hidden flex">
      <Sidebar />
      <TopBar title={title} />
      <main className="ml-72 mt-20 p-10 flex-1 h-[calc(100vh-5rem)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
