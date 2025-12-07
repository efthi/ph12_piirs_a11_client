import React from "react";
import registerimage from "../../assets/images/register.png";
const Register = () => {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1"></div>
        <div className="flex-1">
            <img src={registerimage} alt="registerimage" />
        </div>
      </div>
    </>
  );
};

export default Register;
