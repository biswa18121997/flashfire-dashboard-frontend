// Text diff utility functions
const createDiff = (original: string, optimized: string) => {
    if (!original || !optimized) {
        return [];
    }

    // Simple word-level diff algorithm
    const originalWords = original.split(/(\s+)/);
    const optimizedWords = optimized.split(/(\s+)/);
    
    const diff = [];
    let i = 0, j = 0;
    
    while (i < originalWords.length || j < optimizedWords.length) {
        if (i >= originalWords.length) {
            // Only in optimized
            diff.push({ type: 'added', content: optimizedWords[j] });
            j++;
        } else if (j >= optimizedWords.length) {
            // Only in original
            diff.push({ type: 'removed', content: originalWords[i] });
            i++;
        } else if (originalWords[i] === optimizedWords[j]) {
            // Same word
            diff.push({ type: 'unchanged', content: originalWords[i] });
            i++;
            j++;
        } else {
            // Different words - check if it's a simple change or addition/deletion
            const nextMatch = optimizedWords.slice(j + 1).indexOf(originalWords[i]);
            const prevMatch = originalWords.slice(i + 1).indexOf(optimizedWords[j]);
            
            if (nextMatch === 0) {
                // Word was added in optimized
                diff.push({ type: 'added', content: optimizedWords[j] });
                j++;
            } else if (prevMatch === 0) {
                // Word was removed from original
                diff.push({ type: 'removed', content: originalWords[i] });
                i++;
            } else {
                // Word was changed
                diff.push({ type: 'changed', content: originalWords[i], newContent: optimizedWords[j] });
                i++;
                j++;
            }
        }
    }
    
    return diff;
};

const renderDiffText = (diff: any[], isOptimized = false) => {
    return diff.map((part: any, index: number) => {
        const key = `${index}-${part.type}`;
        
        switch (part.type) {
            case 'added':
                return isOptimized ? (
                    <span key={key} className="bg-green-200 text-green-800 px-1 rounded">
                        {part.content}
                    </span>
                ) : null;
            case 'removed':
                return !isOptimized ? (
                    <span key={key} className="bg-red-200 text-red-800 px-1 rounded line-through">
                        {part.content}
                    </span>
                ) : null;
            case 'changed':
                return isOptimized ? (
                    <span key={key} className="bg-yellow-200 text-yellow-800 px-1 rounded">
                        {part.newContent}
                    </span>
                ) : (
                    <span key={key} className="bg-red-200 text-red-800 px-1 rounded line-through">
                        {part.content}
                    </span>
                );
            case 'unchanged':
            default:
                return <span key={key}>{part.content}</span>;
        }
    }).filter(Boolean);
};

const ResumeChangesComparison = ({ changesMade }: any) => {
    if (
        !changesMade ||
        !changesMade.startingContent ||
        !changesMade.finalChanges
    ) {
        return (
            <div className="text-gray-500 italic">
                No changes available, please optimize your resume.
            </div>
        );
    }

    const { startingContent, finalChanges } = changesMade;

    // Get all unique keys from both objects
    const allKeys = new Set([
        ...Object.keys(startingContent),
        ...Object.keys(finalChanges),
    ]);

    // Helper function to render text with diff highlighting
    const renderTextWithDiff = (text: string, isOriginal: boolean, compareText: string | null = null) => {
        if (compareText && typeof compareText === "string" && text !== compareText) {
            const diff = createDiff(isOriginal ? text : compareText, isOriginal ? compareText : text);
            return (
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {renderDiffText(diff, !isOriginal)}
                </div>
            );
        }
        return <div className="text-sm whitespace-pre-wrap">{text}</div>;
    };

    // Helper function to render array items with diff highlighting
    const renderArrayItem = (item: any, index: number, isOriginal: boolean, compareItem: any = null) => {
        // Handle responsibilities with diff highlighting
        if (item.responsibilities && Array.isArray(item.responsibilities)) {
            const compareResponsibilities = compareItem?.responsibilities || [];
            return (
                <ul className="space-y-1 text-sm">
                    {item.responsibilities.map((resp: any, respIndex: number) => {
                        const compareResp = compareResponsibilities[respIndex];
                        return (
                            <li key={respIndex} className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                <span>
                                    {renderTextWithDiff(resp, isOriginal, compareResp)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        // Handle skills with diff highlighting
        if (item.skills) {
            const compareSkills = compareItem?.skills || "";
            return (
                <div>
                    <div className="font-medium text-sm mb-1">
                        {renderTextWithDiff(item.category || "Skills", isOriginal, compareItem?.category)}
                    </div>
                    <div className="text-sm text-gray-600">
                        {renderTextWithDiff(item.skills, isOriginal, compareSkills)}
                    </div>
                </div>
            );
        }

        // Handle additional info with diff highlighting
        if (item.additionalInfo !== undefined) {
            const compareAdditionalInfo = compareItem?.additionalInfo || "";
            return (
                <div className="text-sm">
                    {renderTextWithDiff(
                        item.additionalInfo || "No additional information", 
                        isOriginal, 
                        compareAdditionalInfo || "No additional information"
                    )}
                </div>
            );
        }

        // Handle job title and company with diff highlighting
        if (item.jobTitle || item.company || item.position) {
            const compareTitle = compareItem?.jobTitle || compareItem?.position || "";
            const compareCompany = compareItem?.company || "";
            
            return (
                <div className="space-y-2">
                    <div className="font-medium text-sm">
                        {renderTextWithDiff(
                            item.jobTitle || item.position || "Position", 
                            isOriginal, 
                            compareTitle
                        )}
                    </div>
                    {item.company && (
                        <div className="text-sm text-gray-600">
                            {renderTextWithDiff(item.company, isOriginal, compareCompany)}
                        </div>
                    )}
                    {item.responsibilities && Array.isArray(item.responsibilities) && (
                        <div className="mt-2">
                            {renderArrayItem(item, index, isOriginal, compareItem)}
                        </div>
                    )}
                </div>
            );
        }

        // Fallback for other item types
        return (
            <div className="text-sm text-gray-600">
                {renderTextWithDiff(
                    JSON.stringify(item, null, 2), 
                    isOriginal, 
                    compareItem ? JSON.stringify(compareItem, null, 2) : null
                )}
            </div>
        );
    };

    const renderValue = (value: any, isOriginal = false, compareValue: any = null) => {
        if (Array.isArray(value)) {
            return (
                <div className="space-y-3">
                    {value.map((item, index) => {
                        const compareItem = compareValue && Array.isArray(compareValue) ? compareValue[index] : null;
                        return (
                            <div
                                key={item.id || index}
                                className="border-l-2 border-gray-300 pl-3"
                            >
                                {renderArrayItem(item, index, isOriginal, compareItem)}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (typeof value === "string") {
            return renderTextWithDiff(value, isOriginal, compareValue);
        }

        return (
            <div className="text-sm text-gray-600">
                {renderTextWithDiff(
                    JSON.stringify(value, null, 2), 
                    isOriginal, 
                    compareValue ? JSON.stringify(compareValue, null, 2) : null
                )}
            </div>
        );
    };

    const formatKeyName = (key: string) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim();
    };

    // Get section icon based on section name
    const getSectionIcon = (sectionName: string) => {
        const lowerSection = sectionName.toLowerCase();
        if (lowerSection.includes('summary') || lowerSection.includes('profile')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
            );
        } else if (lowerSection.includes('experience') || lowerSection.includes('work')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm3-2a1 1 0 011-1h2a1 1 0 011 1v1H9V4zm-4 4h10v6H4V8z" clipRule="evenodd" />
                </svg>
            );
        } else if (lowerSection.includes('skill')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
            );
        } else if (lowerSection.includes('education')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.429 3.058 11.092 11.092 0 01-2.943.757z" />
                </svg>
            );
        }
        // Default icon
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="space-y-6">
            {/* Main Header */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">
                        Optimization Changes Summary
                    </h4>
                </div>

                {/* Vertical sections with horizontal comparison */}
                <div className="p-6 space-y-8">
                    {Array.from(allKeys).map((key) => {
                        const originalValue = startingContent[key];
                        const optimizedValue = finalChanges[key];

                        // Skip if both values are undefined or null
                        if (
                            originalValue === undefined &&
                            optimizedValue === undefined
                        ) {
                            return null;
                        }

                        return (
                            <div key={key} className="space-y-4">
                                {/* Section Header */}
                                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                                    <div className="text-gray-600">
                                        {getSectionIcon(formatKeyName(key))}
                                    </div>
                                    <h5 className="text-lg font-semibold text-gray-800">
                                        {formatKeyName(key)} Changes
                                    </h5>
                                </div>

                                {/* Horizontal comparison within section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Original Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium text-gray-700">
                                                Old {formatKeyName(key)}:
                                            </span>
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            {originalValue !== undefined ? (
                                                <div className="text-sm leading-relaxed">
                                                    {renderValue(
                                                        originalValue,
                                                        true,
                                                        optimizedValue
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 italic">
                                                    No original content
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Optimized Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium text-gray-700">
                                                Optimized {formatKeyName(key)}:
                                            </span>
                                        </div>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            {optimizedValue !== undefined ? (
                                                <div className="text-sm leading-relaxed">
                                                    {renderValue(
                                                        optimizedValue,
                                                        false,
                                                        originalValue
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 italic">
                                                    No optimized content
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary of changes */}
            {changesMade.changedSections && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">
                        Sections Modified
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {changesMade.changedSections.map((section: any) => (
                            <span
                                key={section}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                                {formatKeyName(section)}
                            </span>
                        ))}
                    </div>
                    {changesMade.timestamp && (
                        <p className="text-sm text-blue-700 mt-3">
                            Last updated:{" "}
                            {new Date(changesMade.timestamp).toLocaleString()}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};


export default ResumeChangesComparison;
