"use client";
// components
import { Navbar, Footer, Loader } from "@/components";

// sections
import Prices, { StripePricingTable } from "../prices";
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import Image from "next/image";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PersonalCoaching />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}

export function PersonalCoaching() {
  return (
    <section className="px-8 pt-10 pb-10" id="stripe-pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-400/50 via-gray-100/60 to-white mix-blend-multiply"></div>

      <div className="container mx-auto mb-0 sm:mb-10 text-center">
        <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
          Personal Coaching
        </h1>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pl-44 lg:pr-44 lg:mb-20">
        <div
          className="overflow-hidden h-[466px] md:h-[560px]"
          style={{ zIndex: 2 }}
        >
          <Image
            width={370}
            height={300}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/kosta-coach.webp`}
            className="animate-in slide-in-from-left duration-1000 "
            alt=""
          />
        </div>
        <div className="animate-in slide-in-from-right duration-1000">
          <h2 className="mb-4 text-3xl font-bold">Konstantin</h2>
          <h3 className="mb-4 text-xl">
            As a founder of NRC International Team I offer personal coaching to
            athletes who want to take their performance to the next level.
            <br />
          </h3>
          <p className="">
            My coaching philosophy focuses on creating personalized training
            plans according to your specific needs and goals. With over a 8
            years of coaching experience in professional sport, I apply the best
            practices to make the training process as enjoyable as it might be.
            <br />
            <br />
            I believe that the key to success is becoming a friend of the
            athlete. For me coaching is more than just write trainings, it's
            about being a part of the athlete's journey and support you in a
            good or bad moments.
            <br />
            <br />
            Whether you're a beginner or an experienced athelte, I'm here to
            help you reach your potential in cycling, triathlon or running.
            Start your free trial now and let's achieve your goals together!
          </p>
        </div>
      </div>
      <FormSection />
      <div className="container mx-auto">
        <h3 className="mb-10 leter-spacing-1 text-3xl text-center">
          OR START YOUR FREE TRIAL NOW
        </h3>
      </div>
      <StripePricingTable />
    </section>
  );
}

const contactValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  textarea: Yup.string().nullable().required("Please enter a message"),
});

const FormSection = () => {
  const [disabled, setDisabled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formik = useFormik<{
    email: string;
    firstName: string;
    lastName: string;
    textarea: string | null;
  }>({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
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
    <section className="px-8 relative z-100">
      <div className="container mx-auto text-center">
        {/* <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold"
        >
          Get Started Today
        </h1> */}
        <div className="flex-row justify-center align-middle">
          <div className="flex justify-center mb-6">
            <h3 className="leter-spacing-1 text-3xl max-w-3xl">
              DROP A MESSAGE AND WE'LL GET BACK TO YOU WITHIN 24 HOURS
            </h3>
          </div>
          <br />
        </div>
      </div>

      <div
        style={{ alignItems: "flex-start" }}
        className="flex-row md:container md:mx-auto md:flex items-center justify-between"
      >
        <div className="md:px-8 pt-6 pb-8 mb-4  md:ml-16 w-full">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between ">
              <div className="mb-6 w-4/5 mr-10">
                <label
                  className="block   text-sm font-bold mb-2"
                  htmlFor="text"
                >
                  First Name*
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
                  Last Name*
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
                Email*
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
                Leave your message
              </label>
              <textarea
                className={`shadow appearance-none border ${
                  formik.errors.textarea && "border-red-500"
                } rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline min-h-28`}
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
};
