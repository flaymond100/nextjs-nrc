import { useAuth } from "@/contexts/auth-context";

export function useAdmin() {
  const { user, loading: authLoading, isAdmin, adminLoading } = useAuth();

  // Return admin status from context (cached)
  return {
    isAdmin: isAdmin === true,
    loading: authLoading || adminLoading || isAdmin === null,
  };
}

