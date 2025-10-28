import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/communities/integrations/supabase/client';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { Button } from '@/communities/components/ui/button';
import { Input } from '@/communities/components/ui/input';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { useToast } from '@/communities/hooks/use-toast';
import { MemberCard } from '@/communities/components/communities/MemberCard';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
import { useCommunityRole, CommunityRole } from '@/communities/hooks/useCommunityRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/communities/components/ui/alert-dialog';
import { ArrowLeft, Search, Users, UserPlus } from 'lucide-react';
import { MainLayout } from '@/communities/components/layout/MainLayout';
interface Member {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;
  joined_at: string;
}
interface Community {
  id: string;
  name: string;
  imageurl: string | null;
  member_count?: number;
}
export default function CommunityMembers() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const {
    role: currentUserRole
  } = useCommunityRole(user?.id, id);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      fetchCommunityAndMembers();
    }
  }, [id]);
  useEffect(() => {
    filterMembers();
  }, [members, searchQuery, roleFilter]);
  const fetchCommunityAndMembers = async () => {
    setLoading(true);

    // Fetch community details
    const {
      data: communityData,
      error: communityError
    } = await supabase.from('communities').select('id, name, imageurl').eq('id', id).single();
    if (communityError) {
      toast({
        title: 'Error',
        description: 'Failed to load community',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }
    setCommunity(communityData);

    // Fetch members using the database function
    const {
      data: membersData,
      error: membersError
    } = await supabase.rpc('get_community_members', {
      p_community_id: id
    });
    if (membersError) {
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }
    setMembers(membersData || []);
    setLoading(false);
  };
  const filterMembers = () => {
    let filtered = [...members];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(member => member.username.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }
    setFilteredMembers(filtered);
  };
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!user || !id) return;
    try {
      const {
        error
      } = await supabase.rpc('update_member_role', {
        p_community_id: id,
        p_user_id: userId,
        p_new_role: newRole,
        p_current_user_id: user.id
      });
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Member role updated'
      });
      fetchCommunityAndMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive'
      });
    }
  };
  const handleRemoveMember = async () => {
    if (!user || !id || !memberToRemove) return;
    try {
      const {
        error
      } = await supabase.rpc('remove_community_member', {
        p_community_id: id,
        p_user_id: memberToRemove,
        p_current_user_id: user.id
      });
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Member removed from community'
      });
      setMemberToRemove(null);
      fetchCommunityAndMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        variant: 'destructive'
      });
    }
  };
  if (loading) {
    return <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-8" />
          <div className="space-y-4">
            {Array.from({
            length: 6
          }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        </div>
      </MainLayout>;
  }
  if (!community) {
    return <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Community not found</p>
        </div>
      </MainLayout>;
  }
  return <MainLayout>
      {/* Header Section */}
      <div className="relative w-full bg-gradient-to-br from-[hsl(224,100%,45%)] to-[hsl(266,93%,64%)] overflow-hidden">
        {community.imageurl && <img src={community.imageurl} alt={community.name} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="relative bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Link to={`/community/${id}`} className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {community.name} Members
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="h-5 w-5" />
                  <span className="text-lg">{members.length} members</span>
                </div>
              </div>
              {(currentUserRole === 'owner' || currentUserRole === 'moderator') && <Button onClick={() => {
              toast({
                title: 'Coming Soon',
                description: 'Invite functionality will be added soon'
              });
            }} className="bg-white text-gray-900 hover:bg-gray-100">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search members by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="member">Members</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {filteredMembers.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || roleFilter !== 'all' ? 'No members found matching your filters' : 'No members in this community yet'}
              </p>
            </div> : filteredMembers.map(member => <MemberCard key={member.id} member={member} communityId={id!} currentUserRole={currentUserRole} isCurrentUser={user?.id === member.user_id} onPromote={userId => {
          const member = members.find(m => m.user_id === userId);
          if (member?.role === 'member') {
            handleRoleChange(userId, 'moderator');
          } else if (member?.role === 'moderator') {
            handleRoleChange(userId, 'member');
          }
        }} onDemote={userId => {
          const member = members.find(m => m.user_id === userId);
          if (member?.role === 'moderator') {
            handleRoleChange(userId, 'admin');
          } else if (member?.role === 'admin') {
            handleRoleChange(userId, 'member');
          }
        }} onRemove={userId => setMemberToRemove(userId)} />)}
        </div>
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the community? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>;
}