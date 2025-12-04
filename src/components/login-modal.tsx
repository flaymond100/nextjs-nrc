"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { Loader } from "./loader";
import { useAuth } from "@/contexts/auth-context";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter your password"),
});

function LoginModal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("login");
  const pathname = usePathname();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const { signIn } = useAuth();

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
          router.back();
          resetForm();
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

  if (!modal) return null;

  return (
    <dialog
      id="login-modal"
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
    >
      <div className="sm:w-1/2 lg:w-96">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-end">
              <Link
                className="inline-block align-baseline font-bold text-md text-gray-500 hover:text-gray-800"
                href={pathname}
              >
                <button type="button">X</button>
              </Link>
            </div>
            <div className="mb-4 mt-3 text-center sm:mt-0">
              <h3 className="font-bold leading-6 text-gray-900 text-2xl">
                Login
              </h3>
              <div className="mt-2">
                <p className="text-md text-gray-500">
                  Sign in to access your rider profile
                </p>
              </div>
            </div>

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
                    : "bg-deep-purple-800 hover:bg-deep-purple-400"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={disabled}
              >
                {disabled ? <Loader /> : "Login"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="text-sm text-deep-purple-800 hover:text-deep-purple-600"
                onClick={() => router.back()}
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default LoginModal;
