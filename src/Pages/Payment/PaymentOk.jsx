import React from "react";
import Container from "../../Components/shared/Container";
import { Link } from "react-router";

const PaymentOk = () => {
  return (
    <Container>
      <div className="justify-center">
        <div role="alert" className="alert alert-success">
          <h2 class="card-title">Payment Success!</h2>
          <p>
            Your Payment is Successful! <br /> Thanks for your payment!
            <br />
            You will be redirect to your dashboard automatically! <br />
            If not Please Click below! <br />
          <Link to="/dashboard" className="btn btn-warning m-3">
            Dashboard
          </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PaymentOk;
