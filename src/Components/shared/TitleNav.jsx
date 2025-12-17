import React from "react";
import logo from "../../assets/logo/port-city-piirs-logo_neon.png";

const TitleNav = () => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm justify-center">
        <a className="text-xs" href="/">
            <img src={logo} alt="logo" className="rounded-xl"/>
        </a>
      </div>
    </>
  );
};

export default TitleNav;
