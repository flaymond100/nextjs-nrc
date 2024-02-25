"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Field, FieldProps, Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";

const contactValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  phone: Yup.string(),
});

function Modal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const pathname = usePathname();

  const formik = useFormik<{
    email: string;
    phone: string;
  }>({
    initialValues: {
      email: "",
      phone: "",
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      emailjs
        .send(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_TEMPLATE_ID!,
          values,
          process.env.NEXT_PUBLIC_PUBLIC_KEY!
        )
        .then(
          () => {
            resetForm();
          },
          (error: { text: any }) => {
            console.log(error.text);
          }
        );
    },
    validationSchema: contactValidationSchema,
  });

  return (
    <>
      {modal && (
        <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="sm:w-1/2 lg:w-96">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
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
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    You are one step closer to your goal
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Leave a request and we will contact you back shortly and
                      tell you how to start training with us.
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
                    id="username"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && (
                    <p className="text-red-500 text-xs italic">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Phone
                  </label>
                  <input
                    className={`shadow appearance-none border ${
                      formik.errors.phone && "border-red-500"
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="username"
                    type="phone"
                    name="phone"
                    placeholder="Your phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.phone && (
                    <div className="text-red-500 text-xs italic">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>

                {formik.errors.phone && (
                  <p className="text-danger">{formik.errors.phone}</p>
                )}
                <div className="flex items-center start">
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    value="Submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default Modal;
