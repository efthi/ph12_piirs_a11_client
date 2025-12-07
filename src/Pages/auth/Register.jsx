import React from "react";
import registerimage from "../../assets/images/register.png";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "react-toastify";
import SocialLogin from "./SocialLogin/SocialLogin";
import Container from "../../Components/shared/Container";
import Footer from "../../Components/shared/Footer";
import TitleNav from "../../Components/shared/TitleNav";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleRegister = () => {
    toast.success("Clicked!");
  };
  return (
    <>
    <TitleNav></TitleNav>
      <Container>
        <div className="flex flex-col-reverse md:flex-row justify-between">
          <div className="flex-1 m-10">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-center text-primary mb-4">
                  Register
                </h2>
                <form onSubmit={handleSubmit(handleRegister)}>
                  <fieldset>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="input input-bordered w-full"
                        name="name"
                        {...register("name", { required: true })}
                      />
                    </div>

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
                        <span className="label-text">Profile Photo</span>
                      </label>
                      <input
                        type="file"
                        className="file-input file-input-success"
                        name="profilepic"
                        {...register("profilepic")}
                      />
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
                      <button className="btn btn-success w-full">
                        Register
                      </button>
                    </div>
                    <p className="mt-5 p-3">
                      Already registered! Please
                      <Link
                        to="/login"
                        className="link link-primary font-bold p-1"
                      >
                        Login
                      </Link>
                    </p>
                  </fieldset>
                </form>
                <div className="divider">OR</div>
                <SocialLogin></SocialLogin>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <img src={registerimage} alt="registerimage"
            className="rounded-3xl m-10 items-center"
            />
          </div>
        </div>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Register;
