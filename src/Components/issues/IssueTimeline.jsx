import React from "react";
import { CheckCircle, Clock, User, AlertCircle } from "lucide-react";

const IssueTimeline = ({ timeline = [] }) => {
  // Icon based on action
  const getIcon = (action) => {
    if (action.toLowerCase().includes('created')) return <AlertCircle className="text-info" />;
    if (action.toLowerCase().includes('assigned')) return <User className="text-primary" />;
    if (action.toLowerCase().includes('progress')) return <Clock className="text-warning" />;
    if (action.toLowerCase().includes('resolved')) return <CheckCircle className="text-success" />;
    return <AlertCircle className="text-base-content" />;
  };

  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 opacity-60">
        <p>No timeline entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => (
        <div key={index} className="flex gap-4">
          {/* Icon */}
          <div className="flex flex-col items-center">
            <div className="bg-base-200 p-2 rounded-full">
              {getIcon(entry.action)}
            </div>
            {/* Vertical Line */}
            {index < timeline.length - 1 && (
              <div className="w-0.5 h-full bg-base-300 mt-2"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold">{entry.action}</h4>
                <p className="text-sm opacity-70">{entry.message}</p>
              </div>
              <span className="text-xs opacity-60 whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-xs opacity-60 mt-1">
              By {entry.updatedBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueTimeline;