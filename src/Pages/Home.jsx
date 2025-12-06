import Banner from "../components/home/Banner";
import LatestIssues from "../components/home/LatestIssues";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import { auth } from "../Firebase/firebase.config";

const Home = () => {
  return (
    <div>
      <Banner />
      <LatestIssues />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
