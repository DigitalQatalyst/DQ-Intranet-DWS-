import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/communities/components/ui/button';
import { Upload, X, Image as ImageIcon, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedAsset {
  id: string;
  url: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  asset_type: 'image' | 'video' | 'document' | 'link';
  thumbnail_url?: string;
}

interface CommunityMediaUploadProps {
  communityId: string;
  userId: string;
  postId?: string;
  commentId?: string;
  onUploadComplete: (assets: UploadedAsset[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const CommunityMediaUpload: React.FC<CommunityMediaUploadProps> = ({
  communityId,
  userId,
  postId,
  commentId,
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', 'application/msword']
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (uploadedAssets.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => {
      const isValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
      if (!isValid) {
        toast.error(`File type not supported: ${file.name}`);
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    }));
    setPreviews(prev => [...prev, ...newPreviews]);

    // Upload files
    await uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Determine asset type
        let assetType: 'image' | 'video' | 'document' | 'link' = 'document';
        if (file.type.startsWith('image/')) assetType = 'image';
        else if (file.type.startsWith('video/')) assetType = 'video';

        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const storagePath = `community-assets/${communityId}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('community-assets')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('community-assets')
          .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Create thumbnail for images
        let thumbnailUrl: string | undefined;
        if (assetType === 'image') {
          thumbnailUrl = publicUrl; // Use same URL for now, can generate thumbnail later
        }

        // Save asset record to database
        const assetData: any = {
          community_id: communityId,
          user_id: userId,
          asset_type: assetType,
          storage_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          url: publicUrl,
          thumbnail_url: thumbnailUrl
        };

        if (postId) assetData.post_id = postId;
        if (commentId) assetData.comment_id = commentId;

        const { data: assetRecord, error: dbError } = await supabase
          .from('community_assets')
          .insert(assetData)
          .select()
          .single();

        if (dbError) {
          // Clean up uploaded file if DB insert fails
          await supabase.storage.from('community-assets').remove([storagePath]);
          throw dbError;
        }

        return {
          id: assetRecord.id,
          url: publicUrl,
          storage_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          asset_type: assetType,
          thumbnail_url: thumbnailUrl
        } as UploadedAsset;
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedAssets(prev => [...prev, ...uploaded]);
      onUploadComplete([...uploadedAssets, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} file(s)`);

      // Clear previews
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const removeAsset = async (assetId: string, storagePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from('community-assets').remove([storagePath]);

      // Delete from database
      await supabase.from('community_assets').delete().eq('id', assetId);

      setUploadedAssets(prev => prev.filter(a => a.id !== assetId));
      onUploadComplete(uploadedAssets.filter(a => a.id !== assetId));
      toast.success('File removed');
    } catch (error: any) {
      console.error('Error removing asset:', error);
      toast.error('Failed to remove file');
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || uploadedAssets.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || uploadedAssets.length >= maxFiles}
          className="w-full border-[#030F35]/30 hover:bg-[#030F35]/10 text-[#030F35]"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {uploadedAssets.length > 0 ? 'More' : 'Files'} ({uploadedAssets.length}/{maxFiles})
            </>
          )}
        </Button>
      </div>

      {/* Preview Grid */}
      {(previews.length > 0 || uploadedAssets.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Uploading Previews */}
          {previews.map((preview, index) => (
            <div
              key={`preview-${index}`}
              className="relative aspect-square rounded-lg border border-[#030F35]/20 overflow-hidden bg-[#030F35]/5"
            >
              {preview.preview ? (
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <File className="h-8 w-8 text-[#030F35]/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            </div>
          ))}

          {/* Uploaded Assets */}
          {uploadedAssets.map((asset) => (
            <div
              key={asset.id}
              className="relative aspect-square rounded-lg border border-[#030F35]/20 overflow-hidden bg-[#030F35]/5 group"
            >
              {asset.asset_type === 'image' && asset.thumbnail_url ? (
                <img
                  src={asset.thumbnail_url}
                  alt={asset.file_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <File className="h-8 w-8 text-[#030F35]/40" />
                </div>
              )}
              <button
                onClick={() => removeAsset(asset.id, asset.storage_path)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                {asset.file_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



