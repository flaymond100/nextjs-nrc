"use client";
// components
import { Navbar, Footer, Loader } from "@/components";

// sections
import emailjs from "@emailjs/browser";
import Faq from "../faq";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <FormSection />
      <Faq />
      <Footer />
    </>
  );
}

const contactValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  textarea: Yup.string().nullable(),
  trainingTime: Yup.number().required("Please enter your training time"),
});

function FormSection() {
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(false);

  const formik = useFormik<{
    email: string;
    firstName: string;
    lastName: string;
    textarea: string | null;
    trainingTime: number | null;
  }>({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      textarea: null,
      trainingTime: null,
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
    <section className="px-8 pt-20 pb-20">
      <div className="container mx-auto mb-10 text-center">
        <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold"
        >
          Join Us Today
        </h1>

        <div className="flex-row justify-center align-middle">
          <div className="flex justify-center mb-6">
            <p className="leter-spacing-1 text-xl max-w-3xl">
              We are here to help you reach your maximum potential and encourage
              you to maintain a healthy lifestyle. We are more than just that -
              we are the ones who will support and keep you motivated throughout
              your journey to become a better version of yourself!
            </p>
          </div>
          <br />
          <p className=" leter-spacing-1 text-md">
            Leave a request and we will contact you back shortly and tell you
            how to start training with us.
          </p>
        </div>
      </div>
      <div className="flex-row md:container md:mx-auto md:flex items-center justify-between">
        <div className=" mt-10 grid gap-6 lg:mt-0 w-full">
          <Image
            width={568}
            height={568}
            src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/image/join-us.jpg`}
            className="animate-in fade-in zoom-in duration-1000  mb-10 rounded-lg shadow-md "
            alt="Join Us Today"
          />
        </div>
        {/* <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  ml-16 w-full"> */}
        <div className="md:px-8 pt-6 pb-8 mb-4  md:ml-16 w-full">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between ">
              <div className="mb-6 w-4/5 mr-10">
                <label
                  className="block   text-sm font-bold mb-2"
                  htmlFor="text"
                >
                  First Name
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.firstName && "border-red-500"
                  } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
                  id="firstName"
                  type="text"
                  disabled={disabled}
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.firstName && (
                  <div className="text-red-500 text-xs italic">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              <div className="mb-6 w-4/5">
                <label
                  className="block   text-sm font-bold mb-2"
                  htmlFor="text"
                >
                  Last Name
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.lastName && "border-red-500"
                  } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
                  id="lastName"
                  type="text"
                  disabled={disabled}
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.lastName && (
                  <div className="text-red-500 text-xs italic">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.email && "border-red-500"
                } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
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
              <label className="block   text-sm font-bold mb-2" htmlFor="email">
                About You
              </label>
              <textarea
                className={`shadow appearance-none border ${
                  formik.errors.textarea && "border-red-500"
                } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline min-h-28`}
                id="textarea"
                disabled={disabled}
                name="textarea"
                placeholder="Quick summary of your goals and expectations"
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

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                How many hours per week you can train?
              </label>
              <select
                className={`shadow appearance-none border ${
                  formik.errors.trainingTime && "border-red-500"
                } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline`}
                id="trainingTime"
                disabled={disabled}
                name="trainingTime"
                value={formik.values.trainingTime!}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option onChange={formik.handleChange}>1</option>
                <option onChange={formik.handleChange}>2</option>
                <option onChange={formik.handleChange}>3</option>
                <option onChange={formik.handleChange}>4</option>
                <option onChange={formik.handleChange}>5</option>
                <option onChange={formik.handleChange}>6</option>
                <option onChange={formik.handleChange}>7</option>
                <option onChange={formik.handleChange}>8</option>
                <option onChange={formik.handleChange}>9</option>
                <option onChange={formik.handleChange}>10</option>
                <option onChange={formik.handleChange}>11</option>
                <option onChange={formik.handleChange}>12</option>
                <option onChange={formik.handleChange}>13</option>
                <option onChange={formik.handleChange}>14</option>
                <option onChange={formik.handleChange}>15</option>
                <option onChange={formik.handleChange}>16</option>
                <option onChange={formik.handleChange}>17</option>
                <option onChange={formik.handleChange}>18</option>
                <option onChange={formik.handleChange}>19</option>
                <option onChange={formik.handleChange}>20</option>
                <option onChange={formik.handleChange}>21</option>
                <option onChange={formik.handleChange}>22</option>
                <option onChange={formik.handleChange}>23</option>
                <option onChange={formik.handleChange}>24</option>
                <option onChange={formik.handleChange}>25</option>
                <option onChange={formik.handleChange}>26</option>
                <option onChange={formik.handleChange}>27</option>
                <option onChange={formik.handleChange}>28</option>
                <option onChange={formik.handleChange}>29</option>
                <option onChange={formik.handleChange}>30</option>
              </select>
              {formik.errors.trainingTime && (
                <p className="text-red-500 text-xs italic">
                  {formik.errors.trainingTime}
                </p>
              )}
            </div>
            <div className="flex items-center start mt-8">
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
    </section>
  );
}
