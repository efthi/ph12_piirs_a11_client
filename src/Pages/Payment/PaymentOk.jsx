import React, { useEffect } from "react";
import Container from "../../Components/shared/Container";
import { Link, useSearchParams, useNavigate } from "react-router";
import useAxiosPub from "../../hooks/useAxiosPub";
import useAuth from "../../hooks/useAuth";

const PaymentOk = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPub = useAxiosPub();

  const sessionId = searchParams.get("session_id");

  const paymentData = async () => {
    if (!sessionId || !user?.uid) {
      console.log("Missing data");
      return;
    }

    const paymentHash = {
      uid: user.uid,
      paymentSessionID: sessionId,
    };

    try {
      const res = await axiosPub.patch(
        "/store-premium-sub-data",
        paymentHash
      );
      console.log("Payment saved:", res.data);
    } catch (err) {
      console.log("Payment save error:", err.response?.data || err.message);
    }
  };

  // ✅ Page load হলে auto run
  useEffect(() => {
    paymentData();

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 10000); // 10 seconds

    // cleanup
    return () => clearTimeout(timer);
  }, [sessionId, user?.uid]);

  return (
    <Container>
      <div className="justify-center">
        <div role="alert" className="alert alert-success">
          <h2 className="card-title">Payment Success!</h2>
          <p>
            Your Payment is Successful! <br />
            Thanks for your payment!
            <br />
            You will be redirected to your dashboard automatically in 10
            seconds! <br />
            If not, click here!
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
