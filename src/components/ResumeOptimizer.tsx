// ✅ TASK: Add resume upload functionality directly to ResumeOptimizer

import React, { useEffect, useState } from 'react';
import { Zap, Sparkles, FileText, Upload } from 'lucide-react';

const ResumeOptimizer: React.FC = () => {
  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('userAuth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const resumeLink = parsed.userDetails?.resumeLink;
        if (resumeLink) setResumeURL(resumeLink);
      } catch (error) {
        console.error('Error parsing userAuth from localStorage:', error);
      }
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET_PDF);
      formData.append("resource_type", "raw");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const newLink = data.secure_url;
      setResumeURL(newLink);

      const storedAuth = localStorage.getItem("userAuth");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        const updatedUser = {
          ...parsed,
          userDetails: {
            ...parsed.userDetails,
            resumeLink: newLink
          }
        };
        localStorage.setItem("userAuth", JSON.stringify(updatedUser));

        // ✅ Send resume update to backend (no plan-related logic needed)
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plans/select`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeLink: newLink,
            token: parsed.token,
            userDetails: parsed.userDetails,
            planType: parsed.userDetails.planType || 'Resume Upload Only',
            planLimit: parsed.userDetails.planLimit || 0
          })
        });
      }
    } catch (err) {
      alert("Resume upload failed.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Zap className="w-8 h-8 mr-3 text-purple-600" />
            Smart Resume Optimizer
          </h2>
          <p className="text-gray-600 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
            Add 6–10 strategic keywords from any job description • Maintain exact format • 95%+ ATS Score
          </p>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-purple-600">
            <Upload className="w-4 h-4" />
            <span className='border-2 p-2 margin-2 rounded-2xl font-bold hover:text-white hover:bg-violet-600 duration-300'>{isUploading ? "Uploading..." : "Upload / Replace Resume"}</span>
            <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: PDF Preview */}
        <div className="bg-white rounded-xl w-4/5 shadow-sm border border-gray-200 p-2">
          <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-500" />
            Base Resume Preview
          </h4>

          {resumeURL ? (
            <iframe
              src={resumeURL}
              title="Base Resume"
              className="w-full h-[500px] border rounded"
            />
          ) : (
            <p className="text-sm text-gray-500">No resume uploaded yet.</p>
          )}
        </div>

        {/* RIGHT: Optimizer Info */}
        <div className="bg-white rounded-xl w-full shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Resume Optimizer
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This feature will help you optimize your resume with strategic keywords while maintaining exact formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
