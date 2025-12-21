import React from "react";
import { useForm } from "react-hook-form";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router";

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = getAuth();

  const handleReset = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-primary">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit(handleReset)}>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  Email is required
                </p>
              )}
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">
                Send Reset Email
              </button>
            </div>
          </form>

          <p className="text-sm text-center mt-4">
            Remember your password?
            <Link to="/login" className="link link-primary ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
