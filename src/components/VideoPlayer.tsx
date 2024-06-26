import { useEffect, useRef, useState } from 'react';
import poster from '../assets/poster.png';

interface TimeRange{
  start:number;
  end:number
}

function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoBufferedTime, setVideoBufferedTime] = useState<TimeRange[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  let fetchInProgress = useRef<boolean>(false); // Using useRef for mutable state
  let timerRef = useRef<number>(); // Using useRef for timers

  const url = 'https://mirror.clarkson.edu/blender/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => setVideoDuration(video.duration);
      const handleTimeUpdate = () => setVideoCurrentTime(video.currentTime);
      const handleProgress = () => {
        const bufferedSize = video.buffered.length;
        let videoBufferedTimeClone = videoBufferedTime;
        if (videoBufferedTimeClone.length <  bufferedSize) {
          videoBufferedTimeClone.push({
            start: video.buffered.start(bufferedSize - 1),
            end: video.buffered.end(bufferedSize - 1)
          })
        }else{
          videoBufferedTimeClone[bufferedSize - 1].start = video.buffered.start(bufferedSize - 1);
          videoBufferedTimeClone[bufferedSize - 1].end = video.buffered.end(bufferedSize - 1);
        }
        setVideoBufferedTime(videoBufferedTimeClone);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("progress", handleProgress);

      return () => {
        clearTimeout(timerRef.current);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("progress", handleProgress);
      };
    }
  }, [videoBufferedTime]);

  useEffect(() => {
    return () => {
      // Cleanup function to reset fetchInProgress if component unmounts
      fetchInProgress.current = false;
    };
  }, []);

  const getVideoUrl = async () => {
    return new Promise<string>((resolve, reject) => {
      const delay = 3 * 1000;
      timerRef.current = setTimeout(() => resolve(url), delay);
    });
  };

  const handleClick = async () => {
    if (fetchInProgress.current) {
      return;
    }
    fetchInProgress.current = true;
    try {
      const url = await getVideoUrl();
      setVideoUrl(url);
    } catch (err) {
      setErrorMsg(err as string);
    } finally {
      fetchInProgress.current = false;
    }
  };

  return (
    <div className='videoPlayer'>
      <video ref={videoRef} width="600" height="240" controls src={videoUrl} poster={poster} />
      <button className='videoButton' onClick={handleClick}>Load Url</button>
      {errorMsg && <h2 className='errorMessage'>{errorMsg}</h2>}
      <div className='stateIndications'>
        <div className='duration'></div>
        {videoBufferedTime.map((buffredTime)=> (
           <div className='buffered' style={{
            left:`${(buffredTime.start / videoDuration) * 100}%`,
             width: `${((buffredTime.end - buffredTime.start) / videoDuration) * 100}%` }}></div>

        ))}
        <div className='played' style={{ width: `${(videoCurrentTime / videoDuration) * 100}%` }}></div>
      </div>
    </div>
  );
}

export default VideoPlayer;
