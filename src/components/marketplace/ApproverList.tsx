import React from 'react';
import { X } from 'lucide-react';
import { User } from '../../utils/types';

interface ApproverListProps {
  approvers: User[];
  onRemove: (id: string) => void;
}

const ApproverList: React.FC<ApproverListProps> = ({ approvers, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 min-h-[60px]">
      {approvers.length === 0 && (
        <div className="w-full flex items-center justify-center text-gray-400 text-sm italic">
          No approvers selected
        </div>
      )}
      
      {approvers.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center bg-white border border-gray-200 rounded-full pl-1 pr-2 py-1 shadow-sm hover:shadow-md transition-shadow group animate-fade-in"
        >
          {/* Avatar Circle */}
          <div className={`${user.color} w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2`}>
            {user.initials}
          </div>
          
          {/* Name */}
          <span className="text-sm text-gray-600 font-normal mr-2">
            {user.name}
          </span>

          {/* Remove Button */}
          <button 
            onClick={() => onRemove(user.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none"
            aria-label={`Remove ${user.name}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      {/* Mock Add Button to mimic potential functionality */}
      <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 border-dashed text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-colors ml-1">
        <span className="text-lg leading-none mb-0.5">+</span>
      </button>
    </div>
  );
};

export default ApproverList;