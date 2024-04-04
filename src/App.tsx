import './App.css'
import VideoPlayer from './components/VideoPlayer';
import Wrapper from './components/Wrapper';

interface TimeRange{
  start:number;
  end:number
}

function App() {

  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration , setVideoDuration] = useState(0);
  const [videoCurrentTime , setVideoCurrentTime] = useState(0);
  const [videoBufferedTime, setVideoBufferedTime] = useState<TimeRange[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);


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
      if (video){
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("progress", handleProgress);
      }
    };
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
