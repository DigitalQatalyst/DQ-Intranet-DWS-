import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Building, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { format } from 'date-fns';

interface CommunityInfoPanelProps {
  community: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    imageurl?: string | null;
    category?: string | null;
    department?: string | null;
    location_filter?: string | null;
  };
  memberCount: number;
  isMember: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  onJoinLeave: () => void;
  joinLoading: boolean;
  user?: any;
}

export const CommunityInfoPanel: React.FC<CommunityInfoPanelProps> = ({
  community,
  memberCount,
  isMember,
  isOwner,
  isAdmin,
  onJoinLeave,
  joinLoading,
  user
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#030F35]/20 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-[#030F35] mb-2">{community.name}</h1>
        {community.description && (
          <p className="text-[#030F35]/80 text-sm leading-relaxed">{community.description}</p>
        )}
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4">
        {/* Member Count */}
        <div className="flex items-center gap-3 text-[#030F35]/80">
          <div className="p-2 bg-[#030F35]/5 rounded-lg">
            <Users className="h-5 w-5 text-[#1A2E6E]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#030F35]/60">Members</p>
            <p className="text-lg font-semibold text-[#030F35]">{memberCount}</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-3 text-[#030F35]/80">
          <div className="p-2 bg-[#030F35]/5 rounded-lg">
            <Calendar className="h-5 w-5 text-[#1A2E6E]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#030F35]/60">Created</p>
            <p className="text-sm font-medium text-[#030F35]">
              {format(new Date(community.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Category */}
        {community.category && (
          <div className="flex items-center gap-3 text-[#030F35]/80">
            <div className="p-2 bg-[#030F35]/5 rounded-lg">
              <Building className="h-5 w-5 text-[#1A2E6E]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#030F35]/60">Category</p>
              <p className="text-sm font-medium text-[#030F35]">{community.category}</p>
            </div>
          </div>
        )}

        {/* Department */}
        {community.department && (
          <div className="flex items-center gap-3 text-[#030F35]/80">
            <div className="p-2 bg-[#030F35]/5 rounded-lg">
              <Building className="h-5 w-5 text-[#FB5535]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#030F35]/60">Department</p>
              <p className="text-sm font-medium text-[#030F35]">{community.department}</p>
            </div>
          </div>
        )}

        {/* Join/Leave Button */}
        <div className="pt-4 border-t border-[#030F35]/20">
          {user && isMember ? (
            <Button
              onClick={onJoinLeave}
              disabled={joinLoading}
              variant="outline"
              className="w-full border-[#030F35]/30 hover:bg-[#030F35]/10 text-[#030F35]"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              {joinLoading ? 'Processing...' : 'Leave Community'}
            </Button>
          ) : (
            <Button
              onClick={onJoinLeave}
              disabled={joinLoading}
              className="w-full bg-dq-navy text-white hover:bg-[#13285A] transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {joinLoading ? 'Processing...' : 'Join Community'}
            </Button>
          )}
        </div>

        {/* Admin Actions */}
        {(isOwner || isAdmin) && (
          <div className="pt-4 border-t border-[#030F35]/20">
            <Link to={`/community/${community.id}/settings`}>
              <Button
                variant="outline"
                className="w-full border-[#030F35]/30 hover:bg-[#030F35]/10 text-[#030F35]"
              >
                Manage Community
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

