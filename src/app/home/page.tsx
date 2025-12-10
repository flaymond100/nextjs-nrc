import { ChooseType } from "@/components/home-choose-type";

export default function AboutUsPage() {
  return <AboutUs />;
}

const AboutUs = () => {
  return (
    <section className="center-section">
      <ChooseType />
    </section>
  );
};
