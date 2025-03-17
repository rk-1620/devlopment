import { useState } from 'react'
import React from 'react';

function App() {
  
  // const [title,setTitle] = useState("my name is rakesh");
  // function updateTitle(){
  //   setTitle("my name is " + Math.random());

  // }

//   rerendering - we have to optimize the rerendering in which we have make componenent
//   rerender only which has changed not to rerender all the component un neccessarily
//   to achive this there is two method 
//   1. pushing down the usstate varible to lowest common ancestor where changes are 
//   happening so that only that component and there child will render
//   2. use memoization process
  
  


  return (
    // yahan pr div ka tag lagene se hi memo kaam kiye ye wala krne se nai hoga <></>
    <div>
      {/* <button onClick={updateTitle}>click to update the title</button> */}
      <HeaderWithButton/>
      {/* <br/><Header title = {title}></Header> */}
      <br/><Header title = "harkirat"></Header>
      <br/><Header title = "harkirat"></Header>
      <br/><Header title = "harkirat"></Header>
      <br/><Header title = "harkirat"></Header>
    </div>
  )
}

// React.memo and useMemo are different

// const Header = React.memo(function Header({title}){
//   return <div>
//     {title}
//   </div>
// })

function Header({title}){
  return <div>
    {title}
  </div>
}

function HeaderWithButton(){
  const [title, setTitle] = useState("My name is Rakesh")

  function updateTitle(){
    setTitle("my name is " + Math.random());

  }

  return <>
      <button onClick={updateTitle}>click to update the title</button>
      <Header title={title}/>
  </>
}

// function Header({title})
// {
//   return<>
//     {title}
//   </>
// }

export default App
