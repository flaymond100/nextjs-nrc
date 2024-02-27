"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FieldProps, Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import React from "react";
import { Loader } from "./loader";

const contactValidationSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
});

function Modal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const pathname = usePathname();
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(false);

  const formik = useFormik<{
    email: string;
    name: string;
  }>({
    initialValues: {
      email: "",
      name: "",
    },
    onSubmit: (values, { resetForm }) => {
      setDisabled(true);
      emailjs
        .send(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_TEMPLATE_ID!,
          values,
          process.env.NEXT_PUBLIC_PUBLIC_KEY!
        )
        .then(
          () => {
            toast.success("Your message was sent!", {
              style: { color: "white", background: "green" },
              duration: 4000,
            });
            router.back();
            resetForm();
          },
          (error: { text: any }) => {
            toast.error("Error happened, please try again!");
            console.log(error.text);
          }
        )
        .finally(() => {
          setDisabled(false);
        });
    },
    validationSchema: contactValidationSchema,
  });

  return (
    <>
      {modal && (
        <dialog
          id="modal"
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
        >
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
                  <h3 className=" font-bold leading-6 text-gray-900 text-2xl">
                    You are one step closer to your goal
                  </h3>
                  <div className="mt-2">
                    <p className="text-md text-gray-500">
                      Leave a request and we will contact you back shortly and
                      tell you how to start training with us.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="text"
                  >
                    Name
                  </label>
                  <input
                    className={`shadow appearance-none border ${
                      formik.errors.name && "border-red-500"
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="username"
                    type="text"
                    disabled={disabled}
                    name="name"
                    placeholder="Your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && (
                    <div className="text-red-500 text-xs italic">
                      {formik.errors.name}
                    </div>
                  )}
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
                    disabled={disabled}
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
                <div className="flex items-center start">
                  <button
                    className={`w-full  ${
                      disabled
                        ? "bg-gray-500"
                        : "bg-deep-purple-800 hover:bg-deep-purple-400"
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    type="submit"
                    value="Submit"
                    disabled={disabled}
                  >
                    {disabled ? <Loader /> : "Submit"}
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
