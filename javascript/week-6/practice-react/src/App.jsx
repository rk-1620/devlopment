
function App()
{
  return<>
    <Card>
      hi there from card 1
    </Card>
    <Card>
      hi there from card two
    </Card>
  </>
}
// The most important thing is that we can access all the component as children of the card compponent means
// that each cards that is declared can access only by using one props as children
function Card({children})
{
  console.log(children)
  return <div style={{
    border: "1px solid black",
    padding: 10,
    margin: 10
  }}>
    {children}
  </div>
}

export default App;



/******************************************************************************* */

 // // // to do assignment

// import { useState } from 'react'
// import React from 'react';

// let counter = 4;

// function App(){
//   const [todo, setTodo] = useState([
//     {
//       id:1,
//       title:"go to agym",
//       description:"go at 4 mornding"
//     },
//     {
//       id:2,
//       title:"go to gym",
//       description:"go at 4 moxrning"
//     },
//     {
//       id:3,
//       title:"go to gym",
//       description:"go at 4 mornisng"
//     }
//   ])

//   function addTodo(){

//     // // spread operator
//     // setTodo([...todo,{
//     //   id:4,
//     //   title:"hello todo",
//     //   description:"hello"
//     // }])

//     //another way of doing
//     const newtodo = [];
//     for(let i=0; i<todo.length; i++)
//     {
//       newtodo.push(
//         todo[i]
//       )
//     }

//     newtodo.push({
//       id:counter++,
//       title:"new title",
//       description:"new description"
//     })

//     setTodo(newtodo);


//   }
//   return(
//     <>
//       <button onClick={addTodo}>Add to do</button>
//       {/* // we should add key in the array that identifies the items uniquely 
//       // so 'key' added that is unique  */}
//       {todo.map(todo=><Todo key = {todo.id} title = {todo.title} description = {todo.description}/>)}
//     </>
//   )

// }

// function Todo({title, description})
// {
//   return<div>
//     <h1>
//       {title}
//     </h1>
//     <h5>
//       {description}
//     </h5>
//   </div>
// }

// export default App;

/******************************************************************************************** */






// import { useState } from 'react'
// import React from 'react';

// function App() {
  
//   // const [title,setTitle] = useState("my name is rakesh");
//   // function updateTitle(){
//   //   setTitle("my name is " + Math.random());

//   // }

// //   rerendering - we have to optimize the rerendering in which we have make componenent
// //   rerender only which has changed not to rerender all the component un neccessarily
// //   to achive this there is two method 
// //   1. pushing down the usstate varible to lowest common ancestor where changes are 
// //   happening so that only that component and there child will render
// //   2. use memoization process
  
  


//   return (
//     // yahan pr div ka tag lagene se hi memo kaam kiye ye wala krne se nai hoga <></>
//     <div>
//       {/* <button onClick={updateTitle}>click to update the title</button> */}
//       <HeaderWithButton/>
//       {/* <br/><Header title = {title}></Header> */}
//       <br/><Header title = "harkirat"></Header>
//       <br/><Header title = "harkirat"></Header>
//       <br/><Header title = "harkirat"></Header>
//       <br/><Header title = "harkirat"></Header>
//     </div>
//   )
// }

// // React.memo and useMemo are different

// // const Header = React.memo(function Header({title}){
// //   return <div>
// //     {title}
// //   </div>
// // })

// function Header({title}){
//   return <div>
//     {title}
//   </div>
// }

// function HeaderWithButton(){
//   const [title, setTitle] = useState("My name is Rakesh")

//   function updateTitle(){
//     setTitle("my name is " + Math.random());

//   }

//   return <>
//       <button onClick={updateTitle}>click to update the title</button>
//       <Header title={title}/>
//   </>
// }

// // function Header({title})
// // {
// //   return<>
// //     {title}
// //   </>
// // }

// export default App


/*************************************************************************************************  */
