import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Container from "../../../Components/shared/Container";
import Footer from "../../../Components/shared/Footer";
import TitleNav from "../../../Components/shared/TitleNav";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const CreateStaff = () => {
  //use form hooks
  const {
    register,
    handleSubmit,
    formState: { errors }, reset,
  } = useForm();

  //import useAuth hook
  const { user } = useAuth();
  const axiosSec = useAxiosSecure();

  //Staff Creation function
  const createStaff = async (data) => {
    try {
      const profileImg = data.profilepic?.[0];

      // 1) upload image (optional)
      let imgURL =
        "https://i.ibb.co/TDrgpc1p/character-avatar-isolated-729149-194801.jpg";
      if (profileImg) {
        const fd = new FormData();
        fd.append("image", profileImg);
        const imageAPIURL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_KEY
        }`;
        const res = await axios.post(imageAPIURL, fd);
        imgURL = res.data?.data?.display_url || imgURL;
      }

      // 2) call secure API (server creates firebase user + db insert)
      await axiosSec.post(`/api/create-staff`, {
        name: data.name,
        email: data.email,
        password: data.password,
        imgURL,
      });

      Swal.fire({
        title: "Success!",
        text: "Staff ID Created!",
        icon: "success",
      });
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed");
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="m-10">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-center text-primary mb-4">
                Create Staff
              </h2>
              <form onSubmit={handleSubmit(createStaff)}>
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
                      className="file-input file-input-warning"
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
                    <button className="btn btn-warning w-full">
                      Create Staff
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateStaff;
