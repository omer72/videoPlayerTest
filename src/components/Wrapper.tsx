import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function Wrapper({children}:Props  ) {
  
  const [showChild, setShowChild] = useState(false);

  return (
    <div>
      <button className='wrapperButton' onClick={()=>setShowChild(true)}>With Video</button>
      <button className='wrapperButton' onClick={()=>setShowChild(false)}>Without Video</button>
      {showChild? children : null}
    </div>
  )
}


