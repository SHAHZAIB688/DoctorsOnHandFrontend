import { useAuth } from "../../state/AuthContext";
import RoleDashboardView from "./components/RoleDashboardView";

const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return <RoleDashboardView role={user.role} />;
};

export default DashboardPage;
