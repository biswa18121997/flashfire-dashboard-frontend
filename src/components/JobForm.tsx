import React, { useState, useEffect, useContext } from "react";
import { X, Calendar, Building, FileText, Briefcase, Link, Copy } from "lucide-react";
import { Job, JobStatus } from "../types";
import { UserContext } from "../state_management/UserContext";
import { useNavigate } from "react-router-dom";
interface JobFormProps {
  job?: Job | null;
  onCancel: () => void;
  onSuccess?: () => void;
  setUserJobs: any;
}

const JobForm: React.FC<JobFormProps> = ({ job, onCancel, onSuccess, setUserJobs }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    joblink: "",
    dateApplied: new Date().toISOString().split("T")[0],
    attachments: [],
    status: "saved" as JobStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userDetails, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // preload form if editing
  useEffect(() => {
    if (job) {
      setFormData({
        resumeUsed: job.resumeUsed,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobDescription: job.jobDescription,
        joblink: job.joblink || "",
        dateApplied: job.dateApplied?.split("T")[0] || new Date().toISOString().split("T")[0],
        status: job.currentStatus,
      });
      setIsEditMode(true);
    };
    
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const newFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          newFiles.push(file);
        }
      }
    }
    if (newFiles.length > 0) {
      setImages((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

const uploadImagesToCloudinary = async (): Promise<string[]> => {
  const urls: string[] = [];

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;             
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET;    

  try {
    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        console.error(`Failed to upload ${file.name}`);
        continue;
      }

      const data = await res.json();

      if (data.secure_url) {
        urls.push(data.secure_url);
        console.log("Uploaded to Cloudinary:", data.secure_url);
      } else {
        console.error("No secure_url in response for", file.name);
      }
    }
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
  }

  return urls;
};


  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle.trim() || !formData.companyName.trim()) {
      setError("Job Title and Company Name are required.");
      return;
    }

    setIsSubmitting(true);

    try {
     // const uploadedUrls = await uploadImagesToSupabase();
     const uploadedUrls = await uploadImagesToCloudinary();
      console.log(uploadedUrls);
      const jobDetails = {
        jobID: job ? job.jobID : Date.now().toString(),
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        joblink: formData.joblink,
        dateApplied: formData.dateApplied,
        currentStatus: formData.status,
        userID: userDetails.email,
        attachments: uploadedUrls,
      };
      console.log(jobDetails);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const saveJobsToDb = await fetch(`${API_BASE_URL}/api/jobs`, { //${API_BASE_URL}
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jobDetails, userDetails, token }),
});


      const responseFromServer = await saveJobsToDb.json();

      if (responseFromServer.message === "invalid token please login again") {
        localStorage.clear();
        navigate("/login");
        return;
      }

      setUserJobs(responseFromServer?.NewJobList || []);
      if (onSuccess) onSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to save job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {job ? "Edit Job Application" : "Add New Job Application"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleAddJob} className="space-y-6">
        {/* form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Job Title *</label>
            <input
              disabled={isEditMode}
              readOnly={isEditMode}
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Company Name *</label>
            <input
              disabled={isEditMode}
              readOnly={isEditMode}
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Job Description</label>
          <textarea
            disabled={isEditMode}
            readOnly={isEditMode}
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Paste Resume Images (Ctrl+V)</label>
          <div
            onPaste={handlePaste}
            className="border-2 border-dotted border-red-600 p-4 min-h-[80px] rounded-lg"
          >
            {previews.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" className="w-20 h-20 object-cover" />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 flex items-center">
                <Copy className="w-4 h-4 mr-1" /> Paste one or more images here
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Job Link</label>
          <input
            disabled={isEditMode}
            readOnly={isEditMode}
            name="joblink"
            value={formData.joblink}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>


        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            {isSubmitting ? "Saving..." : job ? "Update Job" : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
