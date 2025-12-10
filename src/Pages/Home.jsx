import Banner from "../components/home/Banner";
import LatestIssues from "../components/home/LatestIssues";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import useAuth from "../hooks/useAuth";
import Loader from "../Components/shared/Loader";

const Home = () => {
  const { user, authload } = useAuth();
  console.log(user);

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
