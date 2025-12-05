"use client";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const registerValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  firstName: Yup.string()
    .required("First name is required")
    .min(1, "First name is required"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(1, "Last name is required"),
});

export const RegisterSection = () => {
  const [disabled, setDisabled] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const formik = useFormik<RegisterData>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        const userMetadata = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
        };

        const { data: authData, error: authError } = await signUp(
          values.email,
          values.password,
          userMetadata
        );

        if (authError) {
          toast.error(authError.message || "Failed to create account");
          setDisabled(false);
          return;
        }

        if (!authData || !authData.user) {
          toast.error("Account creation failed");
          setDisabled(false);
          return;
        }

        // Success - redirect to success page
        router.push("/register/success");
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  return (
    <section className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
          Join NRC International Team
        </h1>
        <p className="leter-spacing-1 text-xl max-w-3xl mx-auto">
          Create your account to get started
        </p>
        <p className="leter-spacing-1 text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link href="/?login=true" className="text-purple-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="min-w-[300px] md:min-w-[500px] bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.email && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="email"
              type="email"
              name="email"
              placeholder="your.email@example.com"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.password && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
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

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.confirmPassword && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.firstName && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.firstName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.lastName && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.lastName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              style={{ background: "#f06723" }}
              placeholder={""}
              color="gray"
              disabled={disabled}
              className="w-full md:w-auto px-8"
            >
              {disabled ? <Loader /> : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
