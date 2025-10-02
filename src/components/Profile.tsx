import React, { useMemo, useState, useContext } from "react";
import {
    Pencil,
    Save,
    X,
    ArrowLeft,
    Copy,
    Check,
} from "lucide-react";
import { useUserProfile, UserProfile } from "../state_management/ProfileContext";
import { UserContext } from "../state_management/UserContext";
import { Link } from "react-router-dom";
import { toastUtils, toastMessages } from "../utils/toast";

/* ---------------- Helper Components ----------------- */

function Placeholder({ label }: { label?: string }) {
    return <span className="text-gray-400 italic">{label || "Not provided"}</span>;
}

/* Copy button */
function CopyButton({ value, title }: { value: string | React.ReactNode; title: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            let textToCopy = "";

            if (typeof value === "string") {
                textToCopy = value;
            } else if (value && typeof value === "object" && "props" in value) {
                if (value.props && value.props.children) {
                    textToCopy = String(value.props.children);
                }
            } else {
                textToCopy = String(value);
            }

            if (textToCopy && textToCopy.trim()) {
                await navigator.clipboard.writeText(textToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                toastUtils.success(`${title} copied to clipboard!`);
            }
        } catch {
            toastUtils.error("Failed to copy to clipboard");
        }
    };

    if (!value || (typeof value === "string" && !value.trim())) return null;

    return (
        <button
            onClick={handleCopy}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={`Copy ${title.toLowerCase()}`}
        >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
        </button>
    );
}

/* Row components */
function InfoRow({
    title,
    value,
    isEditing = false,
    onValueChange = () => { },
}: {
    title: string;
    value?: string | React.ReactNode;
    isEditing?: boolean;
    onValueChange?: (value: string) => void;
}) {
    return (
        <div className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
            <div className="w-1/3 text-sm font-semibold text-gray-700">{title}</div>
            <div className="w-2/3">
                {isEditing ? (
                    <input
                        type="text"
                        value={(value as string) || ""}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="w-full text-sm border-b border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none"
                        placeholder={`Enter ${title.toLowerCase()}`}
                    />
                ) : (
                    <div className="flex items-center text-sm text-gray-900">
                        <span className="flex-1">{value ? value : <Placeholder />}</span>
                        <CopyButton value={value || ""} title={title} />
                    </div>
                )}
            </div>
        </div>
    );
}

function TextAreaRow({
    title,
    value,
    isEditing = false,
    onValueChange = () => { },
}: {
    title: string;
    value?: string;
    isEditing?: boolean;
    onValueChange?: (value: string) => void;
}) {
    return (
        <div className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
            <div className="w-1/3 text-sm font-semibold text-gray-700 pt-2">{title}</div>
            <div className="w-2/3">
                {isEditing ? (
                    <textarea
                        value={value || ""}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="w-full text-sm border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none rounded-lg"
                        rows={3}
                        placeholder={`Enter ${title.toLowerCase()}`}
                    />
                ) : (
                    <div className="flex items-center text-sm text-gray-900">
                        <span className="flex-1">{value ? value : <Placeholder />}</span>
                        <CopyButton value={value || ""} title={title} />
                    </div>
                )}
            </div>
        </div>
    );
}

function FileUploadRow({
    title,
    currentFile,
    isEditing = false,
    onFileChange = () => { },
}: {
    title: string;
    currentFile?: string;
    isEditing?: boolean;
    onFileChange?: (file: string) => void;
}) {
    return (
        <div className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
            <div className="w-1/3 text-sm font-semibold text-gray-700 pt-2">{title}</div>
            <div className="w-2/3 flex items-center">
                {isEditing ? (
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onFileChange(file.name);
                        }}
                        className="block w-full text-sm text-gray-500"
                    />
                ) : currentFile ? (
                    <>
                        <a
                            className="text-blue-600 underline text-sm"
                            href={currentFile}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View File
                        </a>
                        <CopyButton value={currentFile} title={title} />
                    </>
                ) : (
                    <span className="text-gray-400 italic text-sm">No file uploaded</span>
                )}
            </div>
        </div>
    );
}

/* Card wrapper */
function Card({
    children,
    title,
    onEdit,
    isEditing,
    onSave,
    onCancel,
}: {
    children: React.ReactNode;
    title: string;
    onEdit?: () => void;
    isEditing?: boolean;
    onSave?: () => void;
    onCancel?: () => void;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                {isEditing ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSave}
                            className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 rounded-lg transition-colors"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                        <button
                            onClick={onCancel}
                            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <X size={16} /> Cancel
                        </button>
                    </div>
                ) : (
                    onEdit && (
                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 rounded-lg transition-opacity"
                        >
                            <Pencil size={16} /> Edit
                        </button>
                    )
                )}
            </div>
            <div>{children}</div>
        </div>
    );
}

function joinArr(v?: string[] | null) {
    if (!v || v.length === 0) return "";
    return v.join(", ");
}

/* ---------------- Main Page ----------------- */

export default function ProfilePage() {
    const { userProfile, updateProfile } = useUserProfile();
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<UserProfile>>({});
    const ctx = useContext(UserContext);

    const data = userProfile ?? ({} as UserProfile);

    const handleEditClick = (section: string) => {
        setEditingSection(section);
        setEditData(data);
    };

    const handleSave = async () => {
        try {
            const userKey = prompt("Enter the edit key to save changes:");
            if (userKey !== "flashfire2025") {
                toastUtils.error("Incorrect edit key. Changes not saved.");
                return;
            }

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
            const token = ctx?.token;
            const email = ctx?.userDetails?.email;

            if (!token || !email) {
                throw new Error("Token or user details missing");
            }

            const res = await fetch(`${API_BASE_URL}/setprofile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...editData,
                    email,
                    token,
                    userDetails: ctx?.userDetails,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            await res.json();
            updateProfile(editData);
            setEditingSection(null);
            setEditData({});
            toastUtils.success(toastMessages.profileUpdated);
        } catch (error: any) {
            console.error("Profile update error:", error);
            toastUtils.error(toastMessages.profileError);
        }
    };

    const handleCancel = () => {
        setEditingSection(null);
        setEditData({});
    };

    const fullName = useMemo(() => {
        const fn = data.firstName?.trim() || "";
        const ln = data.lastName?.trim() || "";
        return [fn, ln].filter(Boolean).join(" ") || "Your Name";
    }, [data.firstName, data.lastName]);

    if (!userProfile && !ctx?.userDetails) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                        Profile Not Found
                    </h1>
                    <p className="text-gray-600">Please complete your profile first.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/"
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                            >
                                <ArrowLeft size={16} />
                                <span className="text-sm font-medium">Back to Dashboard</span>
                            </Link>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                                    Professional Profile
                                </p>
                                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                    {fullName}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All sections stacked + scrollable */}
            <div className="mx-auto max-w-5xl px-6 py-12 space-y-10 overflow-y-auto">

                {/* Personal */}
                <Card
                    title="Personal Details"
                    onEdit={() => handleEditClick("personal")}
                    isEditing={editingSection === "personal"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                >
                    <InfoRow title="First Name" value={data.firstName} />
                    <InfoRow title="Last Name" value={data.lastName} />
                    <InfoRow title="Contact Number" value={data.contactNumber} />
                    <InfoRow title="Date of Birth" value={data.dob} />
                    <TextAreaRow title="Address" value={data.address} />
                    <InfoRow title="Visa Status" value={data.visaStatus} />
                </Card>

                {/* Education */}
                <Card
                    title="Education"
                    onEdit={() => handleEditClick("education")}
                    isEditing={editingSection === "education"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                >
                    <InfoRow title="Bachelor's (University • Degree • Duration)" value={data.bachelorsUniDegree} />
                    <InfoRow title="Bachelor's Grad (MM-YYYY)" value={data.bachelorsGradMonthYear} />
                    <InfoRow title="Bachelor's GPA" value={data.bachelorsGPA} />
                    <InfoRow title="Master's (University • Degree • Duration)" value={data.mastersUniDegree} />
                    <InfoRow title="Master's Grad (MM-YYYY)" value={data.mastersGradMonthYear} />
                    <InfoRow title="Master's GPA" value={data.mastersGPA} />
                </Card>

                {/* Professional */}
                <Card
                    title="Professional"
                    onEdit={() => handleEditClick("professional")}
                    isEditing={editingSection === "professional"}
                    onSave={handleSave}
                    onCancel={handleCancel}
                >
                    <InfoRow title="Preferred Roles" value={joinArr(data.preferredRoles)} />
                    <InfoRow title="Experience Level" value={data.experienceLevel} />
                    <InfoRow title="Expected Base Salary" value={data.expectedSalaryRange} />
                    <InfoRow title="Preferred Locations" value={joinArr(data.preferredLocations)} />
                    <InfoRow title="Target Companies" value={joinArr(data.targetCompanies)} />
                    <TextAreaRow title="Reason for Leaving" value={data.reasonForLeaving} />
                </Card>

                {/* Preferences */}
                <Card title="Preferences">
                    <p className="text-sm text-gray-600">Use this section for any future preference fields.</p>
                </Card>

                {/* Links */}
                <Card title="Links & Documents">
                    <InfoRow title="LinkedIn" value={data.linkedinUrl} />
                    <InfoRow title="GitHub" value={data.githubUrl} />
                    <InfoRow title="Portfolio" value={data.portfolioUrl} />
                    <FileUploadRow title="Resume" currentFile={data.resumeUrl} />
                    <FileUploadRow title="Cover Letter" currentFile={data.coverLetterUrl} />
                    <FileUploadRow title="Portfolio File" currentFile={data.portfolioFileUrl} />
                </Card>

                {/* Compliance */}
                <Card title="Terms & Accuracy">
                    <InfoRow title="SSN Number" value={data.ssnNumber} />
                    <TextAreaRow title="Expected Salary Narrative" value={data.expectedSalaryNarrative} />
                    <InfoRow title="Join Time" value={data.joinTime} />
                    <InfoRow title="Confirm Accuracy" value={data.confirmAccuracy ? "Yes" : "No"} />
                    <InfoRow title="Agree to Terms" value={data.agreeTos ? "Yes" : "No"} />
                </Card>

                {/* Additional */}
                <Card title="Additional Information">
                    <InfoRow title="Are you veteran?" value="No" />
                    <InfoRow title="Do you have disability?" value="No" />
                    <InfoRow title="Will you require scholarship?" value="No" />
                    <InfoRow title="Are you eligible to work in United States?" value="Yes" />
                    <TextAreaRow
                        title="When are you able to join the company?"
                        value={(() => {
                            const joinTime = data.joinTime;
                            if (!joinTime) {
                                return "I am available to start within 2 weeks of receiving offer.";
                            }
                            const timeMap: Record<string, string> = {
                                "in 1 week": "I am available to start within 1 week of receiving offer.",
                                "in 2 week": "I am available to start within 2 weeks of receiving offer.",
                                "in 3 week": "I am available to start within 3 weeks of receiving offer.",
                                "in 4 week": "I am available to start within 4 weeks of receiving offer.",
                                "in 6-7 week": "I am available to start within 6-7 weeks of receiving offer.",
                            };
                            return timeMap[joinTime] || "I am available to start within 2 weeks of receiving offer.";
                        })()}
                    />
                    <InfoRow
                        title="How much salary are you expecting?"
                        value={(() => {
                            const salaryRange = data.expectedSalaryRange;
                            if (!salaryRange || salaryRange === "Other") {
                                return "I'm seeking a salary in the range of $80,000 to $100,000 annually, depending on the overall compensation package, responsibilities, and growth opportunities within the role.";
                            }
                            const rangeMap: Record<string, string> = {
                                "60k-100k": "$60,000 to $100,000",
                                "100k-150k": "$100,000 to $150,000",
                                "150k-200k": "$150,000 to $200,000",
                            };
                            const range = rangeMap[salaryRange] || "$80,000 to $100,000";
                            return `I'm seeking a salary in the range of ${range} annually, depending on the overall compensation package, responsibilities, and growth opportunities within the role.`;
                        })()}
                    />
                </Card>

                {/* Credentials */}
                <Card title="Account Access Credentials">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-blue-800">
                                Account Credentials
                            </span>
                        </div>
                        <p className="text-sm text-blue-700">
                            These are the credentials which you can use while applying in different portals.
                        </p>
                    </div>
                    <InfoRow title="Username / Email" value={ctx?.userDetails?.email || "Not available"} />
                    <InfoRow title="Password" value="Flashfire@1357" />
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Important Notes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Password is standardized across all dashboard accounts</li>
                            <li>• Keep these credentials secure and do not share with unauthorized personnel</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}
