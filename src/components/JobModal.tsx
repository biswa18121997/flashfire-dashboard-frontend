
import { X, Building, Briefcase, Calendar, User, FileText, ArrowRight } from "lucide-react";
import { useState, Suspense, lazy } from "react";
const AttachmentsModal = lazy(() => import("./AttachmentsModal"));
export default function JobModal({ setShowJobModal, jobDetails }) {
  const [attachmentsModalActiveStatus, setAttachmentsModalActiveStatus] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[80vw] max-w-3xl h-[80vh] overflow-y-auto relative">
        <section className="flex sticky top-0 justify-between items-center p-4 border-b bg-gradient-to-r from-orange-600 to-red-200 text-white rounded-t-xl">
          <h1 className="text-lg font-semibold">📄 FlashFire Jobs</h1>
          <button
            onClick={() => setShowJobModal(false)}
            className="hover:bg-purple-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </section>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <FileText />
            <h2 className="text-xl font-semibold text-gray-800 inline"> Job Details</h2>
            <hr />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium"><Building className="w-4 h-4 inline mr-1" /> Company Name:</span> <br /> {jobDetails.companyName}
              </div>
              <div>
                <span className="font-medium"><Calendar className="w-4 h-4 inline mr-1"/> Added On:</span> <br /> {jobDetails.createdAt}
              </div>
              <div>
                <span className="font-medium"><Briefcase className="w-4 h-4 inline mr-1" /> Position:</span> <br /> {jobDetails.jobTitle}
              </div>
              <div>
                <span className="font-medium"><User className="w-4 h-4 inline mr-1"/> Candidate:</span> <br /> {jobDetails.userID}
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">Job Link</h3>
          <div className="flex justify-around bg-gray-50 p-4 rounded-lg shadow-inner w-full gap-4 overflow-x-scroll">
            <h1>{jobDetails.joblink}</h1>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">Resume / Attachments</h3>
          <div className="flex justify-around bg-gray-50 p-4 rounded-lg shadow-inner w-full gap-4 overflow-x-scroll">
            {jobDetails?.attachments?.length ? (
              jobDetails.attachments.map((item) => (
                <img
                  onClick={() => {
                    setSelectedImage(item);
                    setAttachmentsModalActiveStatus(true);
                  }}
                  src={item}
                  alt="resume"
                  key={item}
                  className="w-[20vw] h-[30vh] cursor-pointer object-cover"
                />
              ))
            ) : (
              <h2 className="text-gray-500 italic">No resume uploaded yet.</h2>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold text-gray-800 mb-2">📈 Timeline</h3>
            <div className="space-y-2 flex overflow-x-scroll">
              {jobDetails?.timeline?.length > 0 ? (
                jobDetails.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center space-x-2 text-sm text-gray-600"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>{item}</span>
                    <ArrowRight />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No timeline available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {attachmentsModalActiveStatus && (
      <Suspense fallback={<LoadingScreen />}>
        <AttachmentsModal
          imageLink={selectedImage}
          setAttachmentsModalActiveStatus={setAttachmentsModalActiveStatus}
        />
      </Suspense>
      )}
    </div>
  );
}
