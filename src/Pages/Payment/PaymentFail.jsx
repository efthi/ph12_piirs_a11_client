import React from "react";
import Container from "../../Components/shared/Container";
import { Link } from "react-router";

const PaymentFail = () => {
  return (
    <Container>
      <div className="justify-center">
        <div role="alert" className="alert alert-warning">
          <h2 class="card-title">Payment Failed!</h2>
          <p>
            Your Payment is not Successful!
            <br />
            You will be redirect to your dashboard automatically! <br />
            If not Please Click below! <br />
            <Link to="/dashboard" className="btn btn-primary m-3">
              Dashboard
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PaymentFail;
