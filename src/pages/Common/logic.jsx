import { useNavigate } from 'react-router-dom';

// Hook-style helper: returns a handler for the admin button
export function useAdminHandler() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');
  return { goToLogin };
}

// Alternatively export a plain function that accepts a navigate function
export function handleAdminClick(navigate) {
  navigate('/login');
}
