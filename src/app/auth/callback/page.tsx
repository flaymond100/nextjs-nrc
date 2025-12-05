"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Navbar, Footer } from "@/components";
import { Loader } from "@/components/loader";

function parseHashParams(hash: string) {
  const clean = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(clean);
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    expires_in: params.get("expires_in"),
    token_type: params.get("token_type"),
    type: params.get("type"),
  };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get hash from URL
        const hash = window.location.hash;
        
        if (!hash) {
          // No hash parameters, redirect to login
          router.replace("/login?error=missing_tokens");
          return;
        }

        // Parse hash parameters
        const { access_token, refresh_token, type } = parseHashParams(hash);

        if (!access_token || !refresh_token) {
          setStatus("error");
          setErrorMessage("Missing authentication tokens. Please try again.");
          setTimeout(() => {
            router.replace("/login?error=missing_tokens");
          }, 3000);
          return;
        }

        // Set the session in Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Error setting session:", error);
          setStatus("error");
          setErrorMessage(error.message || "Failed to authenticate. Please try again.");
          setTimeout(() => {
            router.replace("/login?error=invalid_link");
          }, 3000);
          return;
        }

        // If signup, update rider's isEmailConfirmed status
        if (type === "signup" && data?.user) {
          try {
            await supabase
              .from("riders")
              .update({ isEmailConfirmed: true })
              .eq("uuid", data.user.id);
          } catch (updateError) {
            console.error("Error updating rider confirmation status:", updateError);
            // Don't fail the whole flow if this update fails
          }
        }

        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname);

        // Redirect based on type
        if (type === "signup") {
          router.replace("/confirm-email");
        } else {
          // For other types (email change, password reset, etc.), go to home
          const next = searchParams.get("next") || "/";
          router.replace(next);
        }
      } catch (err: any) {
        console.error("Unexpected error in auth callback:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred. Please try again.");
        setTimeout(() => {
          router.replace("/login?error=unexpected");
        }, 3000);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <>
        <Navbar />
        <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Loader />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Completing authentication...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your credentials.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

