// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import Image from "next/image";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <TermsAndConditions />
      <Faq />
      <Footer />
    </>
  );
}

const TermsAndConditions = () => {
  return (
    <>
      <section className="mb-20 container text-center md:text-left mt-6 md:mt-10 mx-auto px-6">
        <h1 className="mb-8 text-left text-4xl font-bold">
          Terms and Conditions
        </h1>

        <p className="mb-6">
          These Terms and Conditions ("Terms") govern your use of the online
          coaching services provided by Ventro Coaching ("we," "us," or "our")
          for triathlon, cycling, running, and swimming training plans. By
          accessing and using our services, you agree to abide by these Terms.
          Please read them carefully. 1. Service Description and Packages We
          offer online training plans for triathlon, cycling, running, and
          swimming. We provide three packages: Lite Package - €70, Premium
          Package - €100 and Deluxe Package - €200. 2. Free Trial Period Your
          first 7 days of training are provided for free to allow you to
          evaluate our services. After the free trial period, you must pay for
          the selected package via bank transfer. 3. Payment Payment for the
          selected package must be made via bank transfer. Payment details will
          be provided upon the conclusion of your free trial period. 4.
          Termination of Contract You may terminate your contract with us at any
          time by providing us with one month's notice. Termination requests
          should be sent to info@nrc-team.com 5. Health and Responsibility By
          using our training plans, you acknowledge and agree to the following:
          a. Health Awareness: You should be in good health and consult a
          medical professional before starting any exercise program. We are not
          responsible for any health issues that may arise during your training.
          b. Advisory Nature: Our training plans are advisory in nature and
          should be considered recommendations and support. They are not a
          substitute for professional medical advice, diagnosis, or treatment.
          c. Personal Responsibility: You are solely responsible for your own
          health, well-being, and safety during your training. We do not assume
          any responsibility for the decisions you make regarding your training
          or their outcomes. d. Listening to Your Body: You should listen to
          your body and make responsible decisions regarding your training
          intensity and duration. If you experience any discomfort or pain, you
          should stop the training and seek medical advice if necessary. 6. Data
          Privacy We take your privacy seriously. Please review our Privacy
          Policy to understand how we collect, use, and protect your personal
          information. 7. Intellectual Property All content provided through our
          services, including training plans, coaching materials, and any other
          materials, are protected by copyright and other intellectual property
          laws. You may not use, reproduce, or distribute this content without
          our written permission. 8. Changes to Terms We reserve the right to
          modify or update these Terms at any time. We will provide notice of
          significant changes via email or through our website. Your continued
          use of our services after such changes constitutes your acceptance of
          the updated Terms. 9. Contact Information If you have any questions or
          concerns about these Terms or our services, please contact us at [Your
          Contact Information]. By using our online coaching services, you
          acknowledge that you have read, understood, and agree to these Terms
          and Conditions. Your use of our services is subject to these Terms,
          and any violation may result in the termination of your access to our
          services. Privacy Policy 1. Information We Collect a. Personal
          Information: We may collect personal information such as your name,
          email address, postal address, phone number, and date of birth when
          you sign up for our services. b. Payment Information: When you make
          payments for our services, we may collect payment information, such as
          credit card details or bank account information, as necessary to
          process payments. c. Training Data: As you use our training plans and
          coaching services, we may collect data related to your training
          activities, performance, and progress. d. Communication Data: We may
          collect information about your interactions with us, including emails
          and other forms of communication. 2. How We Use Your Information We
          use the collected information for the following purposes: a. To
          provide and personalize our coaching services, including the
          development of training plans and monitoring your progress. b. To
          process payments and manage your account. c. To communicate with you,
          respond to your inquiries, and provide customer support. d. To improve
          our services and develop new features. e. To comply with legal and
          regulatory obligations. f. To protect our rights, privacy, safety, or
          property, or those of our users or others. g. To conduct research and
          analysis for the purpose of improving our services and understanding
          user behavior. 3. Data Security We employ appropriate technical and
          organizational measures to protect your personal information. However,
          no data transmission over the internet is completely secure, and we
          cannot guarantee the security of your data. You understand that you
          share your information at your own risk. 4. Sharing Your Information
          We do not sell, rent, or trade your personal information to third
          parties. We may share your information with third-party service
          providers or partners to provide our services or for other purposes
          outlined in this Privacy Policy. 5. Your Choices a. Review and Update
          Information: You can review and update your personal information in
          your account settings. b. Opt-Out: You can opt out of receiving
          promotional emails from us by following the unsubscribe instructions
          included in those emails. c. Request Deletion: You can request the
          deletion of your account and associated data, subject to our data
          retention policy. 6. Cookies and Tracking Technologies We use cookies
          and similar tracking technologies to collect information about your
          use of our website. You can manage your cookie preferences in your
          browser settings. 7. Age Privacy Our services are not intended for
          people under the age of 18. If you are a parent or guardian and
          believe your child has provided us with personal information, please
          contact us, and we will take steps to delete that information. 8.
          Changes to this Privacy Policy We may update this Privacy Policy to
          reflect changes in our practices or for other operational, legal, or
          regulatory reasons. We will notify you of any material changes through
          email or by posting a notice on our website. 9. Contact Us If you have
          any questions or concerns about this Privacy Policy or our data
          practices, please contact us at contact@nrc-team.com. By using our
          online coaching services, you agree to the terms of this Privacy
          Policy and the collection and use of your personal information as
          described herein. Your continued use of our services constitutes your
          acceptance of this policy.
        </p>
      </section>
    </>
  );
};
