import Banner from "../components/home/Banner";
import LatestIssues from "../components/home/LatestIssues";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import useAuth from "../hooks/useAuth";
import Loader from "../components/shared/Loader";

const Home = () => {
  const { user, authload } = useAuth();

  
  return (
    <div>
      {authload && <Loader></Loader>}
      <Banner />
      <LatestIssues />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
