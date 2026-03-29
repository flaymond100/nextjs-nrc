"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { User } from "@/utils/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean | null; // null = not checked yet, boolean = checked
  adminLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    options?: {
      firstName?: string;
      lastName?: string;
    }
  ) => Promise<{ data: { user: User | null } | null; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const userRef = useRef<User | null>(null);
  const sessionRef = useRef<Session | null>(null);

  const areUsersEquivalent = (current: User | null, next: User | null) => {
    if (current === next) {
      return true;
    }

    if (!current || !next) {
      return current === next;
    }

    return (
      current.id === next.id &&
      current.updated_at === next.updated_at &&
      current.last_sign_in_at === next.last_sign_in_at &&
      current.email === next.email
    );
  };

  const areSessionsEquivalent = (
    current: Session | null,
    next: Session | null
  ) => {
    if (current === next) {
      return true;
    }

    if (!current || !next) {
      return current === next;
    }

    return (
      current.access_token === next.access_token &&
      current.refresh_token === next.refresh_token &&
      current.expires_at === next.expires_at &&
      current.user.id === next.user.id &&
      current.user.updated_at === next.user.updated_at
    );
  };

  const checkAdminStatus = async (userId: string) => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from("riders")
        .select("is_admin")
        .eq("uuid", userId)
        .single();

      if (error) {
        console.error("Error fetching rider admin status:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin === true);
      }
    } catch (err) {
      console.error("Unexpected error checking admin status:", err);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const syncAuthState = (
    event: AuthChangeEvent | "INITIAL_LOAD",
    nextSession: Session | null
  ) => {
    const nextUser = (nextSession?.user as User) ?? null;
    const currentUser = userRef.current;
    const currentSession = sessionRef.current;
    const userChanged = !areUsersEquivalent(currentUser, nextUser);
    const sessionChanged = !areSessionsEquivalent(currentSession, nextSession);
    const userIdChanged = currentUser?.id !== nextUser?.id;

    if (sessionChanged) {
      sessionRef.current = nextSession;
      setSession(nextSession);
    }

    if (userChanged) {
      userRef.current = nextUser;
      setUser(nextUser);
    }

    setLoading(false);

    if (!nextUser?.id) {
      setIsAdmin(false);
      return;
    }

    if (
      userIdChanged ||
      event === "INITIAL_LOAD" ||
      event === "INITIAL_SESSION" ||
      event === "USER_UPDATED"
    ) {
      setTimeout(() => {
        void checkAdminStatus(nextUser.id);
      }, 0);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState("INITIAL_LOAD", session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      syncAuthState(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    options?: {
      firstName?: string;
      lastName?: string;
    }
  ) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nrc-team.com";
    const { data, error } = (await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?type=signup`,
        data: {
          firstName: options?.firstName,
          lastName: options?.lastName,
        },
      },
    })) as { data: { user: User | null }; error: any };
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        adminLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
