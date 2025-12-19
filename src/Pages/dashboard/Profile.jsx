import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { Axios } from "axios";
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Edit2, 
  Camera,
  Shield,
  AlertTriangle
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { updateProfile } from "firebase/auth";


const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const axiosSec = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
    },
  });
  //get userData from DB
  const {data, isLoading, error} = useQuery({
    queryKey: ['profile-data'],
    queryFn : async () => {
      const res = await axiosSec.get(`/api/get-user-data/${user.email}`);
      console.log(res.data);
      return res.data;
    }
  });

  const userData = data || [];


  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      // Update Firebase
      await updateProfile(user, {
        displayName: data.name,
        photoURL: data.photoURL || user.photoURL,
      });

      // Update MongoDB
      const response = await axiosSec.patch(
        '/api/update-user/',
        {
          uid: user.uid,
          name: data.name,
          imgURL: data.photoURL || user.photoURL,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Handle profile update
  const handleUpdateProfile = async (data) => {
    let photoURL = user.photoURL;

    // Upload new photo if provided
    if (data.photo?.[0]) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imageAPIURL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_KEY
        }`;

        const imgResponse = await axios.post(imageAPIURL, formData);
        photoURL = imgResponse.data.data.display_url;
      } catch (error) {
        toast.error("Failed to upload image");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    updateProfileMutation.mutate({
      name: data.name,
      photoURL: photoURL,
    });
  };

const handleSubscribe = async () => {
  try {
    const paymentInfo = {
      uid: user.uid,
      name: user?.displayName,
      amount: 100,
      quantity: 1,
      // priceId: 'price_...' // চাইলে client থেকে পাঠান
    };

    const res = await axiosSec.post('/create-checkout-sessions', paymentInfo);
    console.log(res.data);
    
    if (res.data && res.data.url) {
      window.location.href = res.data.url; // redirect to Stripe hosted checkout
    } else {
      console.error('Unexpected server response:', res.data);
      // show user friendly message
    }
  } catch (err) {
    console.error('Payment error:', err.response ? err.response.data : err.message);
    
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-base-content/70">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Blocked Warning */}
      {userData?.isBlocked && (
        <div className="alert alert-error mb-6">
          <AlertTriangle />
          <div>
            <h3 className="font-bold">Account Blocked</h3>
            <p className="text-sm">
              Your account has been blocked. Please contact support for assistance.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Left Side */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              {/* Profile Photo */}
              <div className="avatar relative">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.photoURL} alt={user?.displayName} />
                </div>
                {userData?.isPremium ? (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <span className="badge badge-secondary gap-1">
                      <Crown size={14} />
                      Premium
                    </span>
                  </div>
                ) : (<></>)}
              </div>

              {/* Name */}
              <h2 className="card-title text-2xl mt-4">{user?.displayName}</h2>
              <p className="text-sm opacity-60">{user?.email}</p>

              {/* Role Badge */}
              <div className="badge badge-primary badge-lg mt-2 capitalize">
                {userData?.role || "Citizen"}
              </div>

              <div className="divider"></div>

              {/* Stats */}
              <div className="stats stats-vertical shadow-sm w-full">
                <div className="stat py-3">
                  <div className="stat-title text-xs">Issues Reported</div>
                  <div className="stat-value text-2xl text-primary">
                    {userData?.issueCount || 0}
                  </div>
                </div>
                <div className="stat py-3">
                  <div className="stat-title text-xs">Member Since</div>
                  <div className="stat-value text-sm">
                    {new Date(userData?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Premium Subscription */}
              {!userData?.isPremium && (
                <div className="w-full mt-4">
                  <button
                    onClick={handleSubscribe}
                    className="btn btn-secondary btn-block gap-2"
                  >
                    <Crown size={18} />
                    Subscribe to Premium (৳1000)
                  </button>
                  <p className="text-xs text-center mt-2 opacity-60">
                    Get unlimited issue reporting
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details - Right Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">Account Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm btn-ghost gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit(handleUpdateProfile)}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                      {errors.name && (
                        <span className="text-error text-sm mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Profile Photo</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered"
                        {...register("photo")}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                          updateProfileMutation.isPending || uploading
                        }
                      >
                        {updateProfileMutation.isPending || uploading
                          ? "Updating..."
                          : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-primary" size={20} />
                    <div>
                      <p className="text-xs opacity-60">Full Name</p>
                      <p className="font-semibold">{user?.displayName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <div>
                      <p className="text-xs opacity-60">Email Address</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="text-primary" size={20} />
                    <div>
                      <p className="text-xs opacity-60">Account Type</p>
                      <p className="font-semibold capitalize">
                        {userData?.role || "Citizen"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <p className="text-xs opacity-60">Member Since</p>
                      <p className="font-semibold">
                        {new Date(userData?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Benefits */}
          {!userData?.isPremium && (
            <div className="card bg-gradient-to-br from-secondary to-accent text-secondary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title gap-2">
                  <Crown size={24} />
                  Upgrade to Premium
                </h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center gap-2">
                    ✓ Unlimited issue reporting
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Faster issue resolution
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Premium badge on your profile
                  </li>
                </ul>
                <button
                  onClick={handleSubscribe}
                  className="btn btn-accent mt-4"
                >
                  Subscribe Now - Only ৳1000
                </button>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Account Status</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs opacity-60">Account Status</p>
                  <p className="font-semibold">
                    {userData?.isBlocked ? (
                      <span className="text-error">Blocked</span>
                    ) : (
                      <span className="text-success">Active</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-60">Subscription</p>
                  <p className="font-semibold">
                    {userData?.isPremium ? (
                      <span className="text-secondary">Premium</span>
                    ) : (
                      <span>Free</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-60">Issues Remaining</p>
                  <p className="font-semibold">
                    {userData?.isPremium
                      ? "Unlimited"
                      : `${3 - (userData?.issueCount || 0)} / 3`}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-60">Email Verified</p>
                  <p className="font-semibold">
                    {user?.emailVerified ? (
                      <span className="text-success">Yes</span>
                    ) : (
                      <span className="text-warning">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;