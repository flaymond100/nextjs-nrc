"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Loader } from "@/components/loader";
import { useAuth } from "@/contexts/auth-context";
import { Navbar, Footer } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter your password"),
});

export default function LoginPage() {
  const [disabled, setDisabled] = useState(false);
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const formik = useFormik<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setDisabled(true);
      try {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          toast.error(error.message || "Authentication failed");
        } else {
          toast.success("Successfully logged in!");
          resetForm();
          router.push("/");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
    validationSchema: loginValidationSchema,
  });

  // Don't render if already logged in (will redirect)
  if (loading || user) {
    return (
      <>
        <Navbar />
        <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <Loader />
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold leading-6 text-gray-900 mb-2">
                Login
              </h1>
              <p className="text-md text-gray-500">
                Sign in to access your rider profile
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.email && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="email"
                  type="email"
                  disabled={disabled}
                  name="email"
                  placeholder="Your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.password && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="password"
                  type="password"
                  disabled={disabled}
                  name="password"
                  placeholder="Your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center start mb-4">
                <button
                  className={`w-full ${
                    disabled
                      ? "bg-gray-500"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors`}
                  type="submit"
                  disabled={disabled}
                >
                  {disabled ? <Loader /> : "Login"}
                </button>
              </div>

              <div className="text-center space-y-2">
                <Link
                  href="/register"
                  className="block text-sm text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Don't have an account? Sign up
                </Link>
                <Link
                  href="/"
                  className="block text-sm text-gray-600 hover:text-gray-800 hover:underline"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

