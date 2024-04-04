import { useEffect, useRef, useState } from 'react'
import './App.css'
import poster from './assets/poster.png';

interface TimeRange{
  start:number;
  end:number
}

function App() {

  const [videoUrl, setVideoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [videoDuration , setVideoDuration] = useState(0);
  const [videoCurrentTime , setVideoCurrentTime] = useState(0);
  const [videoBufferedTime, setVideoBufferedTime] = useState<TimeRange[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Variable to track whether fetch operation is in progress
  const fetchInProgress = useRef(false);


  const url = 'https://mirror.clarkson.edu/blender/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4';

  useEffect(()=>{
    const video = videoRef.current;
    if (video){
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
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("progress", handleProgress);
      };
    }
  },[videoBufferedTime])

  useEffect(() => {
    return () => {
      // Cleanup function to reset fetchInProgress if component unmounts
      fetchInProgress.current = false;
    };
  }, []);



  function getVideoUrl(){
    return new Promise<string>((resolve, reject)=>{
      const delay:number = Math.floor(Math.random()*10000);
      // Check if random number is less than 2000 (20% chance)
      if (delay < 2000) {
        reject('ERROR');
      }
      setTimeout(() => resolve(url), delay);
    })
  }

  function reset(){
    setVideoUrl('');
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoBufferedTime([]);
  }
  const handleClick = async () => {
    if (fetchInProgress.current) {
      return;
    }
    // Set fetchInProgress to true
    fetchInProgress.current = true;
    try {
      const url = await getVideoUrl();
      setVideoUrl(url);
      setErrorMsg('');
    }catch(err){
      reset();
      setErrorMsg(err as string);
    } finally {
      // Reset fetchInProgress to false after completion
      fetchInProgress.current = false;
    }
  }
  return (
    <div className='videoPlayer'>
      <video ref={videoRef} width="600" height="240" controls src={videoUrl} poster={poster}/>
      <button className='videoButton' onClick={handleClick}>Load Url</button>
      {errorMsg ? <h2 className='errorMessage'>{errorMsg}</h2> : null}
      <div className='stateIndications'>
        <div className='duration'></div>
        {videoBufferedTime.map((buffredTime)=> (
           <div className='buffered' style={{
            left:`${(buffredTime.start / videoDuration) * 100}%`,
             width: `${((buffredTime.end - buffredTime.start) / videoDuration) * 100}%` }}></div>

        ))}        
        <div className='played' style={{width:((videoCurrentTime/videoDuration)*100+ '%')}}></div>
      </div>
    </div>
  )
}

export default App
