import { BounceLoader  } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      {/* <span className="loading loading-spinner loading-lg text-primary"></span> */}
      <BounceLoader  color="#3b25c1" size={150} />
  
    </div>
  );
};

export default Loader;
