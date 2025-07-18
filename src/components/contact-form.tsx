"use client";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";

const contactValidationSchema = Yup.object().shape({
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  textarea: Yup.string().nullable().required("Please enter a message"),
});

export const FormSection = () => {
  const [disabled, setDisabled] = useState(false);
  const [_, setFormSubmitted] = useState(false);
  const formik = useFormik<{
    email: string;
    firstName: string | null;
    lastName: string | null;
    textarea: string | null;
  }>({
    initialValues: {
      email: "",
      firstName: null,
      lastName: null,
      textarea: null,
    },
    validateOnBlur: false,
    validateOnChange: false,
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
            toast.success(
              "You're all set! We'll email you within 24 hours, so keep an eye on your inbox.",
              {
                style: { color: "white", background: "green" },
                duration: 40000,
              }
            );
            // router.back();
            setFormSubmitted(true);
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
    <section className="  list-item bg-cover bg-center bg-no-repeat relative">
      <div className=" px-8 container mx-auto text-center">
        <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold"
        >
          Contact Us
        </h1>
        <div className="flex-row justify-center align-middle">
          <div className="flex justify-center mb-6">
            <p className="leter-spacing-1 text-xl max-w-3xl">
              Leave a request and we will contact you back shortly.
            </p>
          </div>
          <br />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="px-8  pb-8 flex justify-center items-center">
          <form
            onSubmit={formik.handleSubmit}
            className="min-w-[300px] md:min-w-[700px]"
          >
            <div className="flex justify-between ">
              <div className="mb-8 w-4/5 mr-10">
                <label
                  className="block   text-lg font-bold mb-2"
                  htmlFor="text"
                >
                  First Name
                </label>
                <input
                  className={`shadow min-h-14 appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
                  id="firstName"
                  type="text"
                  disabled={disabled}
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="mb-6 w-4/5">
                <label
                  className="block   text-lg font-bold mb-2"
                  htmlFor="text"
                >
                  Last Name
                </label>
                <input
                  className={`shadow min-h-14 appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
                  id="lastName"
                  type="text"
                  disabled={disabled}
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-lg font-bold mb-2" htmlFor="email">
                Email*
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.email && "border-red-500"
                } rounded w-full py-2 px-3   min-h-14  leading-tight focus:outline-none focus:shadow-outline`}
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
            <div className="mb-4">
              <label className="block   text-lg font-bold mb-2" htmlFor="email">
                Leave your message*
              </label>
              <textarea
                className={`shadow appearance-none border ${
                  formik.errors.textarea && "border-red-500"
                } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline min-h-36`}
                id="textarea"
                disabled={disabled}
                name="textarea"
                placeholder="Leave your message here"
                value={formik.values.textarea ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.textarea && (
                <p className="text-red-500 text-xs italic">
                  {formik.errors.textarea}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end mt-8">
              <Button
                className={` ${
                  disabled && "bg-gray-500"
                } text-black px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg`}
                style={{ background: "#37007d", color: "white" }}
                type="submit"
                value="Submit"
                disabled={disabled}
              >
                {disabled ? <Loader /> : <>Submit</>}
              </Button>{" "}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
