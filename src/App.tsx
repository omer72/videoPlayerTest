import { useEffect, useRef, useState } from 'react'
import './App.css'
import poster from './assets/poster.png';

function App() {

  const [videoUrl, setVideoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [videoDuration , setVideoDuration] = useState(0);
  const [videoCurrentTime , setVideoCurrentTime] = useState(0);
  const [videoBufferedTime , setVideoBufferedTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Variable to track whether fetch operation is in progress
  let fetchInProgress = false;


  const url = 'https://mirror.clarkson.edu/blender/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4';

  useEffect(()=>{
    const video:HTMLVideoElement | null = videoRef.current;
    if (video){
      video.addEventListener("loadedmetadata", function () {
        setVideoDuration(video.duration);
        

    });
    video.addEventListener("timeupdate", function () {
        setVideoCurrentTime(video.currentTime)
    });
    video.addEventListener("progress", function(){
      setVideoBufferedTime(video.buffered.end(0));
    })
    }

    
  },[])


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

  const handleClick = async () => {
    if (fetchInProgress) {
      return;
    }
    // Set fetchInProgress to true
    fetchInProgress = true;
    try {
      const url = await getVideoUrl();
      setVideoUrl(url);
    }catch(err){
      setErrorMsg(err as string);
    } finally {
      // Reset fetchInProgress to false after completion
      fetchInProgress = false;
    }
  }
  return (
    <div className='videoPlayer'>
      
      <video ref={videoRef} width="600" height="240" controls src={videoUrl} poster={poster}/>
      <button className='videoButton' onClick={handleClick}>Load Url</button>
      {errorMsg ? <h2 className='errorMessage'>{errorMsg}</h2> : null}
      <div className='stateIndications'>
        <div className='duration'></div>
        <div className='buffered' style={{width:((videoBufferedTime/videoDuration)*100+ '%')}}></div>
        <div className='played' style={{width:((videoCurrentTime/videoDuration)*100+ '%')}}></div>
      </div>
      {videoDuration} {videoCurrentTime} {videoBufferedTime}
            </div>
  )
}

export default App
