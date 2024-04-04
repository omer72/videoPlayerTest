import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function Wrapper({children}:Props  ) {
  
  const [showChild, setShowChild] = useState(false);

  return (
    <div>
      <button onClick={()=>setShowChild(true)}>With Video</button>
      <button onClick={()=>setShowChild(false)}>Without Video</button>
      {showChild? children : null}
    </div>
  )
}


