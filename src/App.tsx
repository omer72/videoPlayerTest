import { useEffect, useRef, useState } from 'react'
import './App.css'
import poster from './assets/poster.png';

function App() {

  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration , setVideoDuration] = useState(0);
  const [videoCurrentTime , setVideoCurrentTime] = useState(0);
  const [videoBufferedTime , setVideoBufferedTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);


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
    return new Promise<string>((resolve)=>{
      setTimeout(() => resolve(url), 1000);
    })
  }

  const handleClick = async () => {
    const url = await getVideoUrl();
    setVideoUrl(url);
  }
  return (
    <div className='videoPlayer'>
      
      <video ref={videoRef} width="600" height="240" controls src={videoUrl} poster={poster}/>
      <button className='videoButton' onClick={handleClick}>Load Url</button>
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
