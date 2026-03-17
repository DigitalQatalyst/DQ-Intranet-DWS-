import React, { useEffect, useState } from 'react';
import { BasePost, MediaFile } from '../types';
import { supabase } from '@/communities/integrations/supabase/client';
import { ImageIcon, Video, FileImage } from 'lucide-react';
interface PostCardMediaProps {
  post: BasePost;
}
export const PostCardMedia: React.FC<PostCardMediaProps> = ({
  post
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMediaFiles();
  }, [post.id]);
  const fetchMediaFiles = async () => {
    const {
      data
    } = await supabase.from('media_files').select('*').eq('post_id', post.id).order('display_order', {
      ascending: true
    }).limit(3);
    if (data) {
      setMediaFiles(data as MediaFile[]);
    }
    setLoading(false);
  };
  if (loading) {
    return <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse" />;
  }
  if (mediaFiles.length === 0) {
    return <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center">
        <FileImage className="h-8 w-8 text-gray-400" />
      </div>;
  }
  const firstMedia = mediaFiles[0];
  const remainingCount = mediaFiles.length - 1;
  return <div className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        {firstMedia.file_type.startsWith('image/') ? <img src={firstMedia.file_url} alt={firstMedia.caption || 'Media'} className="w-full h-48 object-cover" loading="lazy" onError={e => {
        e.currentTarget.style.display = 'none';
      }} /> : firstMedia.file_type.startsWith('video/') ? <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
            <Video className="h-12 w-12 text-white" />
          </div> : null}
        
        {remainingCount > 0 && <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            +{remainingCount} more
          </div>}
      </div>
      
      {firstMedia.caption && <p className="text-sm text-gray-600 line-clamp-2">{firstMedia.caption}</p>}
    </div>;
};