import PatientDashboard from "../../patient-dashboard";
import DoctorDashboard from "../../doctor-dashboard";
import AdminDashboard from "../../admin-dashboard";

const RoleDashboardView = ({ role }) => {
  if (role === "doctor") return <DoctorDashboard />;
  if (role === "admin") return <AdminDashboard />;
  return <PatientDashboard />;
};

export default RoleDashboardView;
