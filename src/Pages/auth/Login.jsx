import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Footer from "../../Components/shared/Footer";
import { Link, useLocation, useNavigate } from "react-router";
import TitleNav from "../../Components/shared/TitleNav";
import Container from "../../Components/shared/Container";
import SocialLogin from "./SocialLogin/SocialLogin";
import loginimage from "../../assets/images/login.png";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signinUser, user, authload } = useAuth();
  //অন্য যে পেইজ থেকে আসবে সেটার location link ধরার জন্য
  const location = useLocation();
  //নির্ধারিত পেইজে navigate করার জন্য
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await signinUser(data.email, data.password);
      //console.log(res.user);
      toast.success(`Login Successful! Welcome,${res.user.displayName}`);
      navigate(location.state || "/dashboard");
    } catch (err) {
      // console.log(Object.keys(err));

      // console.log(err.code);
      // console.log(err.message);
      // //console.log(err.customData);
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <>
      <TitleNav></TitleNav>
      <Container>
        <div className="flex flex-col-reverse md:flex-row gap-10 justify-between">
          <div className="flex-1">
            <img
              src={loginimage}
              alt="loginimage"
              className="rounded-3xl m-10 items-center"
            />
          </div>
          <div className="flex-1 m-10">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-center text-primary mb-4">
                  Login
                </h2>
                <form onSubmit={handleSubmit(handleLogin)}>
                  <fieldset>
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="input input-bordered w-full"
                        name="email"
                        {...register("email", { required: true })}
                      />
                      {errors.email?.type === "required" && (
                        <div role="alert" className="alert alert-warning">
                          ⚠️<span>Email field cannot empty!</span>
                        </div>
                      )}
                    </div>

                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="********"
                        className="input input-bordered w-full"
                        name="password"
                        {...register("password", {
                          required: true,
                          minLength: 6,
                        })}
                      />
                      {errors.password?.type === "required" && (
                        <div role="alert" className="alert alert-warning">
                          ⚠️<span>This field cannot empty!</span>
                        </div>
                      )}
                      {errors.password?.type === "minLength" && (
                        <div role="alert" className="alert alert-warning">
                          ⚠️<span>Must be 6 characters or long!</span>
                        </div>
                      )}
                    </div>

                    <div className="form-control mt-6">
                      <button className="btn btn-success w-full">Login</button>
                    </div>
                    <p className="mt-5 p-3">
                      New User? Please
                      <Link
                        to="/register"
                        className="link link-primary font-bold p-1"
                      >
                        Register
                      </Link>
                    </p>
                  </fieldset>
                </form>
                <div className="divider">OR</div>
                <SocialLogin></SocialLogin>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Login;
