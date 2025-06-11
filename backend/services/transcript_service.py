import os
import requests
import xml.etree.ElementTree
import tempfile
import re
from typing import Optional, Tuple
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, YouTubeRequestFailed
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

try:
    import yt_dlp
    YTDLP_AVAILABLE = True
except ImportError:
    YTDLP_AVAILABLE = False

class TranscriptService:
    def __init__(self):
        self.youtube_api_key = os.getenv("YOUTUBE_API_KEY")
        
    async def get_transcript(self, video_id: str) -> Tuple[Optional[str], str]:
        """
        Try multiple methods to get transcript for a video.
        Returns: (transcript_text, title_suffix)
        """
        methods = [
            self._try_youtube_transcript_api,
            self._try_ytdlp_subtitles,
            self._try_manual_caption_fetch,
            self._try_alternative_sources
        ]
        
        for method in methods:
            try:
                result = await method(video_id)
                if result[0]:  # If transcript was found
                    return result
            except Exception as e:
                print(f"Method {method.__name__} failed for {video_id}: {str(e)}")
                continue
        
        # All methods failed
        return None, "(no transcript available)"
    
    async def _try_youtube_transcript_api(self, video_id: str) -> Tuple[Optional[str], str]:
        """Method 1: Try youtube-transcript-api with custom session"""
        print(f"Trying youtube-transcript-api for {video_id}")
        
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        
        try:
            # Try with http_client
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, http_client=session)
        except TypeError:
            # Fallback for older versions
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        transcript_text = " ".join([item["text"] for item in transcript_list])
        return transcript_text, "(via youtube-transcript-api)"
    
    async def _try_ytdlp_subtitles(self, video_id: str) -> Tuple[Optional[str], str]:
        """Method 2: Try yt-dlp to extract existing subtitles"""
        if not YTDLP_AVAILABLE:
            print(f"yt-dlp not available for {video_id}")
            return None, "(yt-dlp not available)"
        
        print(f"Trying yt-dlp subtitle extraction for {video_id}")
        
        with tempfile.TemporaryDirectory() as temp_dir:
            try:
                ydl_opts = {
                    'writesubtitles': True,
                    'writeautomaticsub': True,
                    'subtitleslangs': ['en', 'en-US', 'en-GB'],
                    'skip_download': True,
                    'outtmpl': os.path.join(temp_dir, f'{video_id}.%(ext)s'),
                    'quiet': True,
                    'no_warnings': True,
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([f'https://www.youtube.com/watch?v={video_id}'])
                
                # Look for subtitle files
                for file in os.listdir(temp_dir):
                    if file.endswith(('.vtt', '.srt')) and video_id in file:
                        subtitle_path = os.path.join(temp_dir, file)
                        with open(subtitle_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        if file.endswith('.srt'):
                            transcript_text = self._parse_srt_content(content)
                        else:  # .vtt
                            transcript_text = self._parse_vtt_content(content)
                            
                        if transcript_text:
                            return transcript_text, "(via yt-dlp subtitles)"
                
            except Exception as e:
                print(f"yt-dlp subtitle extraction failed: {e}")
        
        return None, "(no subtitles via yt-dlp)"
    
    async def _try_ytdlp_subtitles(self, video_id: str) -> Tuple[Optional[str], str]:
        """Method 2: Try yt-dlp to extract existing subtitles"""
        if not YTDLP_AVAILABLE:
            print(f"yt-dlp not available for {video_id}")
            return None, "(yt-dlp not available)"
        
        print(f"Trying yt-dlp subtitle extraction for {video_id}")
        
        with tempfile.TemporaryDirectory() as temp_dir:
            try:
                ydl_opts = {
                    'writesubtitles': True,
                    'writeautomaticsub': True,
                    'subtitleslangs': ['en', 'en-US', 'en-GB'],
                    'skip_download': True,
                    'outtmpl': os.path.join(temp_dir, f'{video_id}.%(ext)s'),
                    'quiet': True,
                    'no_warnings': True,
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([f'https://www.youtube.com/watch?v={video_id}'])
                
                # Look for subtitle files
                for file in os.listdir(temp_dir):
                    if file.endswith(('.vtt', '.srt')) and video_id in file:
                        subtitle_path = os.path.join(temp_dir, file)
                        with open(subtitle_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        if file.endswith('.srt'):
                            transcript_text = self._parse_srt_content(content)
                        else:  # .vtt
                            transcript_text = self._parse_vtt_content(content)
                            
                        if transcript_text:
                            return transcript_text, "(via yt-dlp subtitles)"
                
            except Exception as e:
                print(f"yt-dlp subtitle extraction failed: {e}")
        
        return None, "(no subtitles via yt-dlp)"
    
    async def _try_alternative_sources(self, video_id: str) -> Tuple[Optional[str], str]:
        """Method 3: Try alternative transcript sources and better manual methods"""
        print(f"Trying alternative sources for {video_id}")
        
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        })
        
        # Try to get video page and extract caption info
        try:
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            response = session.get(video_url, timeout=10)
            
            if response.status_code == 200:
                # Look for caption track info in the page source
                content = response.text
                
                # Try to find caption URLs in the page source
                import re
                caption_patterns = [
                    r'"captionTracks":\[.*?"baseUrl":"([^"]+)"',
                    r'"captions".*?"playerCaptionsTracklistRenderer".*?"baseUrl":"([^"]+)"'
                ]
                
                for pattern in caption_patterns:
                    matches = re.findall(pattern, content)
                    for match in matches:
                        try:
                            # Decode URL and fetch captions
                            caption_url = match.replace('\\u0026', '&').replace('\\', '')
                            caption_response = session.get(caption_url, timeout=10)
                            
                            if caption_response.status_code == 200:
                                transcript_text = self._parse_xml_captions(caption_response.text)
                                if transcript_text:
                                    return transcript_text, "(alternative source)"
                        except Exception as e:
                            print(f"Failed to fetch from caption URL: {e}")
                            continue
        
        except Exception as e:
            print(f"Alternative sources failed: {e}")
        
        return None, "(alternative sources failed)"

    async def get_video_metadata(self, video_id: str) -> Optional[str]:
        """Get video title using YouTube Data API (this should work with API key)"""
        if not self.youtube_api_key:
            return None
        
        try:
            youtube = build('youtube', 'v3', developerKey=self.youtube_api_key)
            
            # Get video details (this should work with API key)
            videos_response = youtube.videos().list(
                part="snippet",
                id=video_id
            ).execute()
            
            if videos_response.get('items'):
                return videos_response['items'][0]['snippet']['title']
                
        except HttpError as e:
            print(f"YouTube API error getting metadata for {video_id}: {e}")
        
        return None
    
    async def _try_manual_caption_fetch(self, video_id: str) -> Tuple[Optional[str], str]:
        """Method 3: Try manual caption URL construction"""
        print(f"Trying manual caption fetch for {video_id}")
        
        # This method tries to construct caption URLs manually
        # Note: This is less reliable and may break if YouTube changes their URL structure
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        
        # Try common caption URL patterns
        caption_urls = [
            f"https://www.youtube.com/api/timedtext?lang=en&v={video_id}",
            f"https://www.youtube.com/api/timedtext?lang=en&v={video_id}&fmt=srv3",
            f"https://www.youtube.com/api/timedtext?lang=en-US&v={video_id}",
        ]
        
        for url in caption_urls:
            try:
                response = session.get(url, timeout=10)
                if response.status_code == 200 and response.text.strip():
                    # Try to parse as XML
                    transcript_text = self._parse_xml_captions(response.text)
                    if transcript_text:
                        return transcript_text, "(manual fetch)"
            except Exception as e:
                print(f"Manual fetch failed for URL {url}: {e}")
                continue
        
        return None, "(manual fetch failed)"
    
    def _parse_srt_content(self, srt_content: str) -> str:
        """Parse SRT subtitle content to extract text"""
        lines = srt_content.split('\n')
        text_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip sequence numbers and timestamps
            if line and not line.isdigit() and '-->' not in line:
                text_lines.append(line)
        
        return ' '.join(text_lines)
    
    def _parse_vtt_content(self, vtt_content: str) -> str:
        """Parse VTT subtitle content to extract text"""
        lines = vtt_content.split('\n')
        text_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip VTT headers, timestamps, and styling
            if (line and 
                not line.startswith('WEBVTT') and 
                not line.startswith('NOTE') and
                '-->' not in line and
                not line.startswith('<') and
                not line.isdigit()):
                text_lines.append(line)
        
        return ' '.join(text_lines)
    
    def _parse_xml_captions(self, xml_content: str) -> Optional[str]:
        """Parse XML caption content to extract text"""
        try:
            root = xml.etree.ElementTree.fromstring(xml_content)
            text_elements = []
            
            # Look for text elements in the XML
            for elem in root.iter():
                if elem.text and elem.text.strip():
                    text_elements.append(elem.text.strip())
            
            return ' '.join(text_elements) if text_elements else None
        except xml.etree.ElementTree.ParseError:
            return None
