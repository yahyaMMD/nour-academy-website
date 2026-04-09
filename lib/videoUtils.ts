export function getVideoThumbnail(videoUrl: string): string {
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-thumbnail.jpg';
    }
    
    // Vimeo
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.match(/(?:vimeo\.com\/|video\/)(\d+)/)?.[1];
      return videoId ? `https://vumbnail.com/${videoId}.jpg` : '/default-thumbnail.jpg';
    }
    
    // Default thumbnail
    return '/default-thumbnail.jpg';
  }