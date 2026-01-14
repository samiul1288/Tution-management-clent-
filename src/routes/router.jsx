import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// public pages
import Home from "../pages/Home/Home";
import TuitionsList from "../pages/Tuitions/TuitionsList";
import TuitionDetails from "../pages/Tuitions/TuitionDetails";
import TutorsList from "../pages/Tutors/TutorsList";
import TutorProfile from "../pages/Tutors/TutorProfile";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound404 from "../pages/Error/NotFound404";
import Unauthorized from "../pages/Shared/Unauthorized";
import About from "../pages/about/About";

// ✅ payment
import Checkout from "../pages/Payment/Checkout";

// dashboard pages
import DashboardIndex from "../pages/Dashboard";
import StudentDashboardHome from "../pages/Dashboard/Student/StudentDashboardHome";
import MyTuitions from "../pages/Dashboard/Student/MyTuitions";
import PostNewTuition from "../pages/Dashboard/Student/PostNewTuition";
import AppliedTutors from "../pages/Dashboard/Student/AppliedTutors";
import Payments from "../pages/Dashboard/Student/Payments";
import ProfileSettings from "../pages/Dashboard/Student/ProfileSettings";

import TutorDashboardHome from "../pages/Dashboard/Tutor/TutorDashboardHome";
import MyApplications from "../pages/Dashboard/Tutor/MyApplications";
import OngoingTuitions from "../pages/Dashboard/Tutor/OngoingTuitions";
import RevenueHistory from "../pages/Dashboard/Tutor/RevenueHistory";

import AdminDashboardHome from "../pages/Dashboard/Admin/AdminDashboardHome";
import UsersManagement from "../pages/Dashboard/Admin/UsersManagement";
import TuitionsManagement from "../pages/Dashboard/Admin/TuitionsManagement";
import ReportsAnalytics from "../pages/Dashboard/Admin/ReportsAnalytics";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC LAYOUT */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tuitions" element={<TuitionsList />} />
        <Route path="tuitions/:id" element={<TuitionDetails />} />

        <Route path="about" element={<About />} />
        <Route path="tutors" element={<TutorsList />} />
        <Route path="tutors/:id" element={<TutorProfile />} />
        <Route path="contact" element={<Contact />} />

        {/* ✅ keep public checkout if you want (optional) */}
        <Route path="checkout" element={<Checkout />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>

      {/* DASHBOARD LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardIndex />} />

        {/* STUDENT */}
        <Route
          path="student"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <StudentDashboardHome />
            </RoleBasedRoute>
          }
        />
        <Route
          path="student/my-tuitions"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <MyTuitions />
            </RoleBasedRoute>
          }
        />
        <Route
          path="student/post-tuition"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <PostNewTuition />
            </RoleBasedRoute>
          }
        />
        <Route
          path="student/applied-tutors"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <AppliedTutors />
            </RoleBasedRoute>
          }
        />
        <Route
          path="student/payments"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <Payments />
            </RoleBasedRoute>
          }
        />
        <Route
          path="student/profile"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <ProfileSettings />
            </RoleBasedRoute>
          }
        />

        {/* ✅✅ FIXED: dashboard student checkout route added */}
        <Route
          path="student/checkout"
          element={
            <RoleBasedRoute allowedRoles={["student"]}>
              <Checkout />
            </RoleBasedRoute>
          }
        />

        {/* TUTOR */}
        <Route
          path="tutor"
          element={
            <RoleBasedRoute allowedRoles={["tutor"]}>
              <TutorDashboardHome />
            </RoleBasedRoute>
          }
        />
        <Route
          path="tutor/my-applications"
          element={
            <RoleBasedRoute allowedRoles={["tutor"]}>
              <MyApplications />
            </RoleBasedRoute>
          }
        />
        <Route
          path="tutor/ongoing-tuitions"
          element={
            <RoleBasedRoute allowedRoles={["tutor"]}>
              <OngoingTuitions />
            </RoleBasedRoute>
          }
        />
        <Route
          path="tutor/revenue"
          element={
            <RoleBasedRoute allowedRoles={["tutor"]}>
              <RevenueHistory />
            </RoleBasedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboardHome />
            </RoleBasedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UsersManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="admin/tuitions"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <TuitionsManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <ReportsAnalytics />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

export default AppRouter;
