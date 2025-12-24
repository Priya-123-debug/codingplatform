// components/Navbar.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../store/authSlice";

const Navbar = ({ filter, setfilter, isUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            Leetcode
          </NavLink>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost">
            <div tabIndex={0} className="btn btn-ghost">
              {user?.firstname || user?.email || "User"}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box"
          >
            <li>
              <button onClick={handleLogout} className="btn btn-ghost text-xl">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Render filter only for users, not admins */}
      {isUser && user?.role !== "admin" && filter && setfilter && (
        <div className="flex gap-4 mb-4 pt-4 px-4 bg-base-100 shadow">
          <select
            className="select select-bordered"
            value={filter.status}
            onChange={(e) => setfilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered"
            value={filter.difficulty}
            onChange={(e) =>
              setfilter({ ...filter, difficulty: e.target.value })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            value={filter.tag}
            onChange={(e) => setfilter({ ...filter, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="LinkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">Dp</option>
          </select>
        </div>
      )}
    </>
  );
};

export default Navbar;
