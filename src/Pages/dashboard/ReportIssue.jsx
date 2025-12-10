import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Upload, MapPin, FileText, AlertCircle } from "lucide-react";

const ReportIssue = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { user, userData } = useAuth(); // Firebase user + MongoDB userData
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Check issue limit for free users
  const canReportIssue = () => {
    if (userData?.isPremium) {
      return true; // Premium users = unlimited
    }
    return (userData?.issueCount || 0) < 3; // Free users = max 3
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleReportIssue = async (data) => {
    // Check issue limit
    if (!canReportIssue()) {
      toast.error("Free users can only report 3 issues. Please subscribe to premium!");
      navigate("/dashboard/profile");
      return;
    }

    setUploading(true);

    try {
      let imageURL = "";

      // Upload image to ImgBB if provided
      if (data.image?.[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        
        const imageAPIURL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_KEY
        }`;
        
        const imgResponse = await axios.post(imageAPIURL, formData);
        imageURL = imgResponse.data.data.display_url;
      }

      // Prepare issue data
      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        image: imageURL,
        location: data.location,
        status: "Pending",
        priority: "Normal",
        upvotes: 0,
        upvotedBy: [],
        reportedBy: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        },
        isBoosted: false,
        timeline: [
          {
            action: "Issue Created",
            message: "Issue has been reported by citizen",
            updatedBy: user.displayName,
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
      };

      // Save to MongoDB
      const response = await axios.post(
        "http://localhost:3000/api/record-issue",
        issueData
      );

      if (response.data.success) {
        toast.success("Issue reported successfully!");
        reset();
        setImagePreview(null);
        navigate("/dashboard/my-issues");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error(error.response?.data?.message || "Failed to report issue");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
        <p className="text-base-content/70">
          Help us improve Port City by reporting infrastructure problems
        </p>
        
        {/* Issue Limit Warning */}
        {!userData?.isPremium && (
          <div className="alert alert-warning mt-4">
            <AlertCircle size={20} />
            <span>
              Free users can report up to 3 issues. You have reported{" "}
              <strong>{userData?.issueCount || 0}/3</strong> issues.
            </span>
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(handleReportIssue)}>
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Issue Title <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight on Station Road"
                className="input input-bordered w-full"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters",
                  },
                })}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title.message}
                  </span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Description <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                placeholder="Describe the issue in detail..."
                className="textarea textarea-bordered h-32"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            {/* Category */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select a category</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Road Damage">Road Damage / Pothole</option>
                <option value="Water Supply">Water Supply / Leakage</option>
                <option value="Drainage">Drainage / Sewerage</option>
                <option value="Garbage">Garbage / Waste Management</option>
                <option value="Footpath">Footpath / Sidewalk</option>
                <option value="Traffic Signal">Traffic Signal</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.category.message}
                  </span>
                </label>
              )}
            </div>

            {/* Location */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Location <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="e.g. Station Road, Chattogram"
                  className="input input-bordered w-full pl-10"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </div>
              {errors.location && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.location.message}
                  </span>
                </label>
              )}
            </div>

            {/* Image Upload */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Upload Image (Optional)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                {...register("image")}
                onChange={handleImageChange}
              />
              <label className="label">
                <span className="label-text-alt">
                  Supported formats: JPG, PNG, WEBP (Max 5MB)
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Image Preview:</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={uploading || !canReportIssue()}
              >
                {uploading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Report Issue
                  </>
                )}
              </button>
            </div>

            {/* Subscribe Prompt for Free Users */}
            {!canReportIssue() && (
              <div className="alert alert-error mt-4">
                <AlertCircle size={20} />
                <div>
                  <h3 className="font-bold">Issue Limit Reached!</h3>
                  <p className="text-sm">
                    Subscribe to premium for unlimited issue reporting
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Subscribe Now
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-base-200 rounded-lg">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <AlertCircle size={20} />
          Tips for Reporting Issues
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
          <li>Be specific and clear in your title</li>
          <li>Provide detailed description of the problem</li>
          <li>Include exact location for quick resolution</li>
          <li>Upload a photo if possible (helps authorities understand better)</li>
          <li>Check if the issue is already reported before submitting</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportIssue;