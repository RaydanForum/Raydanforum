import Hero from '../components/Hero';
import BriefingsPreview from '../components/BriefingsPreview';
import ActivitiesPreview from '../components/ActivitiesPreview';
import AboutPreview from '../components/AboutPreview';
import MembershipPreview from '../components/MembershipPreview';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  return (
    <>
      <SEOHead pagePath="/" />
      <Hero />
      <BriefingsPreview />
      <ActivitiesPreview />
      <AboutPreview />
      <MembershipPreview />
    </>
  );
}
