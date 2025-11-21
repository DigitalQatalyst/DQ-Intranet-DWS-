import React, { useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { InlineComposer } from './InlineComposer';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { useCommunityMembership } from '@/communities/hooks/useCommunityMembership';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  onPostCreated?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onOpenChange,
  communityId,
  onPostCreated
}) => {
  const { isAuthenticated, user } = useAuth();
  const { isMember } = useCommunityMembership(communityId);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handlePostCreated = () => {
    // Trigger parent refresh callback
    onPostCreated?.();
    // Close the modal after a short delay to allow the success toast to show
    setTimeout(() => {
      onOpenChange(false);
    }, 100);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onOpenChange(false);
      return;
    }

    // If opening the modal, check authentication first
    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      onOpenChange(false);
      return;
    }

    // If authenticated but not a member, show error
    if (!isMember) {
      // We'll handle this in the InlineComposer, but we can also show a message here
      onOpenChange(true);
      return;
    }

    onOpenChange(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isAuthenticated && user ? (
              <InlineComposer
                communityId={communityId}
                isMember={isMember}
                onPostCreated={handlePostCreated}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please sign in to create a post</p>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    setShowSignInModal(true);
                  }}
                  className="text-dq-navy hover:underline"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSuccess={() => {
          setShowSignInModal(false);
          // After successful sign in, open the create post modal
          if (isAuthenticated && user) {
            onOpenChange(true);
          }
        }}
        title="Sign In to Create Posts"
        description="You need to be signed in to create posts in communities."
      />
    </>
  );
};

