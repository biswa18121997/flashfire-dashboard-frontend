import { ArrowBigRight, ArrowRight, X , Building, Briefcase, Calendar, User, FileText} from "lucide-react"

export default function JobModal({setShowJobModal,showJobModal, jobDetails, }){
    

    return (
    // <div className="fixed bg-neutral-400 top-20 h-[80vh] w-[80vw]">
    //     <section className="flex justify-between p-4 "><h1>FlashFire Jobs..</h1><X onClick={()=>setShowJobModal(false)}/></section>
    //     <div>

    //         <div>
    //             <h1 className="font-semibold bg-white m-4 p-2 text-center">Job Details :</h1>
    //             <h2>Company Name : {jobDetails.companyName}</h2>
    //             <h2>Added On : {jobDetails.createdAt}</h2>
    //             <h2>Job Title / Position : {jobDetails.jobTitle}</h2>
    //             <h2>Candidate Name : {jobDetails.userID}</h2>

    //         </div>

    //         <div>
    //             <section>
    //                 {/* resume picture section */}
    //             </section>
    //             <div>
    //                 <h1>Timeline :</h1>
    //                 {jobDetails?.timeline.map((items)=><h1>{items}-----</h1>)}
    //             </div>

    //         </div>
    //     </div>


    //     </div>
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-lg w-[80vw] max-w-3xl h-[80vh] overflow-y-auto relative animate-fadeIn">
    {/* Header */}
    <section className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-orange-600 to-red-200 text-white rounded-t-xl">
      <h1 className="text-lg font-semibold">📄 FlashFire Jobs</h1>
      <button
        onClick={() => setShowJobModal(false)}
        className="hover:bg-purple-700 p-1 rounded-full"
      >
        <X className="w-5 h-5" />
      </button>
    </section>

    {/* Body */}
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <FileText /><h2 className="text-xl font-semibold text-gray-800 inline"> Job Details</h2>
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
        <h3 className="font-semibold text-gray-800 mb-2">Job Details</h3>
         <div className="flex justify-around bg-gray-50 p-4 rounded-lg shadow-inner w-full gap-4 overflow-x-scroll">
        
      {jobDetails.jobDescription}
      </div>
        <h3 className="font-semibold text-gray-800 mb-2">Resume / Attachments</h3>

    <div className="flex justify-around bg-gray-50 p-4 rounded-lg shadow-inner w-full gap-4 overflow-x-scroll">
        {/* Resume Picture Section */}
      {/* <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex gap-4 w-[30%] h-[30%] overflow-x-scroll "> */}
        {jobDetails?.attachments ?jobDetails?.attachments.map((items)=><img src={items} alt="resume used" key={items} className="w-[20vw] h-[30vh]" />)    : <h2 className="text-gray-500 italic">No resume uploaded yet.</h2>}
        
      </div>
      {/* <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="font-semibold text-gray-800 mb-2">Job Application SnapShot</h3>
        <div className="text-gray-500 italic">No resume uploaded yet.</div>
      </div> */}

    {/* </div> */}
      

      {/* Timeline */}
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
                <span>{item}  </span>
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
</div>

        )

}
