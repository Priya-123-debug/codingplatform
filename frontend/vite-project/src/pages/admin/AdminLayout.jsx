// pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";

const Adminlayout = () => {
 
	 const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  console.log("AdminLayout user:", user);
  console.log("isAuthenticated:", isAuthenticated, "loading:", loading);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main container: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
				
        <div className="w-60 bg-gray-100 p-4 h-screen">
          <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
          <ul className="menu space-y-2">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-600" : "text-gray-700"
                }
              >
                All Problems
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/create"
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-600" : "text-gray-700"
                }
              >
                Create Problem
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 bg-gray-50">
					
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
