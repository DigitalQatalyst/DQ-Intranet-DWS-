import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/communities/components/ui/dialog';
import { Button } from '@/communities/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/communities/components/ui/radio-group';
import { Label } from '@/communities/components/ui/label';
import { Textarea } from '@/communities/components/ui/textarea';
import { supabase } from '@/communities/integrations/supabase/client';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  communityId: string;
}
export function ReportModal({
  open,
  onOpenChange,
  targetType,
  targetId,
  communityId
}: ReportModalProps) {
  const {
    user
  } = useAuth();
  const [reportType, setReportType] = useState<string>('spam');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to report content');
      return;
    }
    setSubmitting(true);
    const reason = reportType === 'other' ? customReason : reportType;
    const {
      data,
      error
    } = await supabase.rpc('create_report_secure', {
      p_user_email: user.email,
      p_target_type: targetType,
      p_target_id: targetId,
      p_community_id: communityId,
      p_reason: reason,
      p_post_id: targetType === 'post' ? targetId : null,
      p_comment_id: targetType === 'comment' ? targetId : null
    });
    setSubmitting(false);
    const result = data as {
      success: boolean;
      error?: string;
    } | null;
    if (error || result && !result.success) {
      toast.error(result?.error || 'Failed to submit report');
      console.error('Report error:', error || result?.error);
    } else {
      toast.success('Thanks — your report has been submitted for review');
      onOpenChange(false);
      setReportType('spam');
      setCustomReason('');
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Report {targetType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Please select a reason for reporting this {targetType}:
          </p>
          
          <RadioGroup value={reportType} onValueChange={setReportType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spam" id="spam" />
              <Label htmlFor="spam" className="font-normal cursor-pointer">
                Spam or misleading
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offensive" id="offensive" />
              <Label htmlFor="offensive" className="font-normal cursor-pointer">
                Offensive or abusive
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rules" id="rules" />
              <Label htmlFor="rules" className="font-normal cursor-pointer">
                Violates community rules
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="font-normal cursor-pointer">
                Other
              </Label>
            </div>
          </RadioGroup>

          {reportType === 'other' && <Textarea placeholder="Please describe the issue..." value={customReason} onChange={e => setCustomReason(e.target.value)} className="min-h-[100px]" />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || reportType === 'other' && !customReason.trim()} className="bg-red-600 hover:bg-red-700 text-white">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}