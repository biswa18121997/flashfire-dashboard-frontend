
// import React, { useState, useContext } from 'react';
// import { Upload, FileText, TrendingUp, User, Settings, LogOut, Zap, Crown, Rocket, Check, Gift, ArrowRight, ArrowLeft } from 'lucide-react';
// import { redirect, useNavigate } from 'react-router-dom';
// import { UserContext } from '../state_management/UserContext';



// const NewUserModal: React.FC<{ setNewUserModal: any }> = ({ setNewUserModal }) => {
//   const [currentSection, setCurrentSection] = useState<'upload' | 'pricing'>('upload');
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [resumeLinkCloudinary, setResumeLinkCloudinary] = useState<string | null>(null);
//   const [planSelected, setPlanSelected] = useState<string | null>(null);
//   const [newUser, setNewUser] = useState<any>(null);
//   const navigate = useNavigate();
//   const userAuth = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth')!) : {};
//   const { token, setData } = useContext(UserContext);
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setUploadedFile(file);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) setUploadedFile(file);
//   };

//   const goToPricing = async () => {
//     if (!uploadedFile) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", uploadedFile);
//       formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET_PDF);//
//       formData.append("resource_type", "raw");
//       const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
//         method: "POST",
//         body: formData
//       });
//       const data = await res.json();
//       console.log(data);
//       setCurrentSection('pricing');
//       setResumeLinkCloudinary(data.secure_url);
      
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload resume. Please try again.");
//     }
//   };




//   // const pricingPlans = [
//   //   {
//   //     name: 'Free Trial',
//   //     icon: Gift,
//   //     description: 'Start your free trial today. No credit card required. Cancel anytime.',
//   //     price: 'Free',
//   //     originalPrice: null,
//   //     applications: 'Includes 20 applications',
//   //     planLimit: 10,
//   //     features: [
//   //       'AI-powered job matching',
//   //       '20 tailored applications',
//   //       'Basic resume optimization',
//   //       'Email support',
//   //       '7-day trial period'
//   //     ],
//   //     buttonText: 'Start Free Trial',
//   //     buttonStyle: 'bg-gray-800 hover:bg-gray-900 text-white',
//   //     isPopular: false,
//   //     isBestValue: false,
//   //     isFree: true
//   //   },
//   //   {
//   //     name: 'Ignite',
//   //     icon: Zap,
//   //     description: 'Perfect for entry-level professionals',
//   //     price: '$199',
//   //     originalPrice: '$299',
//   //     applications: '250 applications included',
//   //     planLimit: 250,
//   //     paymentLink: "https://www.paypal.com/ncp/payment/F6CESAWAYUYU2",
//   //     features: [
//   //       'AI-powered job matching',
//   //       '250 tailored applications',
//   //       'Resume optimization',
//   //       'Basic analytics dashboard',
//   //       'Email support'
//   //     ],
//   //     buttonText: 'Start Now',
//   //     buttonStyle: 'bg-gray-800 hover:bg-gray-900 text-white',
//   //     isPopular: false,
//   //     isBestValue: false,
//   //     isFree: false
//   //   },
//   //   {
//   //     name: 'Professional',
//   //     icon: Crown,
//   //     description: 'Most popular for mid-level professionals',
//   //     price: '$349',
//   //     originalPrice: '$449',
//   //     applications: '500 applications included',
//   //     planLimit: 500,
//   //     paymentLink: "https://www.paypal.com/ncp/payment/SMTK5UYQYM4A8",
//   //     features: [
//   //       'Everything in Ignite',
//   //       '500 tailored applications',
//   //       'Priority job matching',
//   //       'Advanced analytics & insights',
//   //       'LinkedIn profile optimization',
//   //       'Priority support',
//   //       'Interview preparation tips'
//   //     ],
//   //     buttonText: 'Start Now',
//   //     buttonStyle: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
//   //     isPopular: true,
//   //     isBestValue: false,
//   //     isFree: false
//   //   },
//   //   {
//   //     name: 'Executive',
//   //     icon: Rocket,
//   //     description: 'For senior professionals & executives',
//   //     price: '$599',
//   //     originalPrice: '$699',
//   //     applications: '1000 applications included',
//   //     planLimit: 1000,
//   //     paymentLink: "https://www.paypal.com/ncp/payment/CDRFGB6M566X8",
//   //     features: [
//   //       'Everything in Professional',
//   //       '1000 tailored applications',
//   //       'Executive-level job targeting',
//   //       'Personal career consultant',
//   //       'Salary negotiation support',
//   //       'Custom cover letters',
//   //       'Network introduction requests'
//   //     ],
//   //     buttonText: 'Start Now',
//   //     buttonStyle: 'bg-gray-800 hover:bg-gray-900 text-white',
//   //     isPopular: false,
//   //     isBestValue: true,
//   //     isFree: false
//   //   }
//   // ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-lg shadow-xl max-w-6xl w-full mx-4 p-4">
//         <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 p-4 flex justify-between">
//           <h1 className="text-xl font-bold text-red-500">FLASHFIRE</h1>
//           <div className="flex space-x-4">
//             <button><Settings /></button>
//             <button><User /></button>
//             <button className='' onClick={()=>{localStorage.clear();navigate('/login')}} ><LogOut /></button>
//           </div>
//         </header>

//         <main className="py-6">
//           {currentSection === 'upload' && (
//             <div>
//               <h2 className="text-3xl font-bold text-center mb-4">Welcome to Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">FlashFire</span> Dashboard</h2>
//               <p className="text-center text-gray-600 mb-8">Upload your resume to get started with AI-powered job applications and tracking.</p>

//               <div
//                 className={`border-2 border-dashed rounded-2xl p-8 ${isDragOver ? 'border-orange-400 bg-orange-50/50' : uploadedFile ? 'border-green-400 bg-green-50/50' : 'border-gray-300 bg-white/50 hover:border-orange-300 hover:bg-orange-50/30'}`}
//                 onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
//               >
//                 {uploadedFile ? (
//                   <div className="text-center space-y-3">
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                       <FileText className="text-green-600" />
//                     </div>
//                     <p className="font-semibold text-green-700">File uploaded successfully!</p>
//                     <p className="text-gray-600">{uploadedFile.name}</p>
//                     <button onClick={() => setUploadedFile(null)} className="text-orange-600">Upload a different file</button>
//                   </div>
//                 ) : (
//                   <div className="text-center space-y-3">
//                     <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
//                       <Upload className="text-orange-600" />
//                     </div>
//                     <p className="font-semibold">Drag and drop your resume here</p>
//                     <p>or</p>
//                     <label>
//                       <input type="file" hidden onChange={handleFileUpload} />
//                       <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full cursor-pointer">Choose File</span>
//                     </label>
//                     <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX</p>
//                   </div>
//                 )}
//               </div>

//               {uploadedFile && (
//                 <div className="text-center mt-6">
//                   <button onClick={goToPricing} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full flex items-center space-x-2 mx-auto">
//                     <span>Continue to Pricing</span>
//                     <ArrowRight />
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {currentSection === 'pricing' && (
//             <div>
//               <button onClick={() => setCurrentSection('upload')} className="flex items-center text-orange-600 mb-4">
//                 <ArrowLeft /> Back to Upload
//               </button>
//               <h2 className="text-3xl font-bold text-center mb-2">Choose Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Plan</span></h2>
//               <p className="text-center text-gray-600 mb-8">Select the perfect plan to accelerate your job search with AI-powered applications.</p>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {pricingPlans.map((plan, i) => {
//                   const Icon = plan.icon;
//                   return (
//                     <div key={i} className={`p-4 rounded-xl relative ${plan.isPopular ? 'border-orange-400 ring-4 ring-orange-100' : plan.isBestValue ? 'border-green-400 ring-4 ring-green-100' : 'border-gray-200 border'}`}>
//                       {plan.isPopular && (
//                         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs">Most Popular</div>
//                       )}
//                       {plan.isBestValue && (
//                         <div className="absolute -top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs">Best Value</div>
//                       )}

//                       <div className="text-center">
//                         <div className="mx-auto bg-orange-100 w-10 h-10 rounded-xl flex justify-center items-center mb-2">
//                           <Icon className="text-orange-600" />
//                         </div>
//                         <h3 className="font-bold">{plan.name}</h3>
//                         <p className="text-sm text-gray-600">{plan.description}</p>
//                         <div className="text-2xl">{plan.price}</div>
//                         <div className="text-orange-600">{plan.applications}</div>
//                         <ul className="text-left mt-2 space-y-1 text-xs">
//                           {plan.features.map((f, j) => (
//                             <li key={j} className="flex items-center"><Check className="text-green-500 w-3.5 h-3.5 mr-1" /> {f}</li>
//                           ))}
//                         </ul>
//                         <button
//                           onClick={async () => {
//                             setPlanSelected(plan.name);
//                             try {
//                               if(plan.name === 'Free Trial') {

//                               const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plans/select`, {
//                                 method: 'POST',
//                                 headers: { 'Content-Type': 'application/json' },
//                                 body: JSON.stringify({resumeLink : resumeLinkCloudinary , token: userAuth.token, userDetails: userAuth.userDetails, planType: plan.name, planLimit: plan.planLimit })
//                               });
//                               const result = await res.json();
//                               // setNewUser(result);
//                               if (result.message === "invalid token please login again") {
//                                 localStorage.clear();
//                                 navigate('/login');
//                               }
                            
                            
//                             else if(result.message =='Plan Selection Sucess'){
//                                 //navigate(`/${plan.paymentLink}`);
//                                 setData({
//                                     token,
//                                     userDetails: {
//                                        email: result?.userDetails.email,
//                                       name : result?.userDetails.name,
//                                       planLimit : result?.userDetails.planLimit,
//                                       planType : result?.userDetails.planType,
//                                       resumeLink : result?.userDetails.resumeLink,
//                                       userType: result?.userDetails.userType      // updated fields
//                                     }
//                                   });
//                                   setNewUserModal(false);
//                                   navigate('/');

//                                 } 
//                             }
//                             else{
                              
//                               return window.open(plan.paymentLink, '_blank');                            }
//                           } catch (err) {
//                               console.error(err);
//                             }
                          
//                           }}
//                           className={`mt-4 w-full ${plan.buttonStyle} py-2 rounded-full`}
//                         >
//                           {plan.buttonText}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default NewUserModal;



