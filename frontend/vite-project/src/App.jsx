import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { checkAuth } from "./store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProblemList from "./pages/admin/AdminProblemList";
import ProblemForm from "./pages/admin/ProblemForm";
import AdminRoute from "./pages/AdminRoute";
import Editpages from "./pages/admin/Editpages";
import CodeEditor from "./pages/CodeEditor";

function App() {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root route: redirect based on role */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Homepage />
            )
          ) : (
            <Navigate to="/signup" />
          )
        }
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route path="/problem/:id" element={<CodeEditor />} />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminProblemList />} />
        <Route path="create" element={<ProblemForm />} />
        <Route path="edit/:id" element={<Editpages />} />
      </Route>
    </Routes>
  );
}

export default App;
