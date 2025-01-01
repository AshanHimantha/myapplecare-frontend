import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children, accessType }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const hasAccess = useAuthStore(state => state.hasAccess);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Handle multiple access types
  const requiredAccess = Array.isArray(accessType) ? accessType : [accessType];
  if (!hasAccess(requiredAccess)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;