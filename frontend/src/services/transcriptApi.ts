export const fetchVideoTranscript = async (videoId: string) => {
    try {
        // TODO: Implement transcript fetching using YouTube API or alternative method
        console.log('Fetching transcript for video:', videoId);
        return [];
    } catch (error) {
        console.error('Error fetching video transcript:', error);
        throw error;
    }
};

export const extractVideoId = (url: string): string => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
};