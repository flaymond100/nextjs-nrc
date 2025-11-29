import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (authLoading) {
        setLoading(true);
        return;
      }

      if (!user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("is_admin")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error fetching rider admin status:", error);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(data?.is_admin === true);
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, authLoading]);

  return { isAdmin, loading };
}

