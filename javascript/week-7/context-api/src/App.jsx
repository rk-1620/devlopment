
// import { useState } from "react"
// function App() {
//   const [count, setCount] = useState(0)

//   // prop driling - passing the props to the farmost children going through every child present in 
//   // the path even if the props which is not used by them. We are passing the props to children only where it is needed
//   return (
//     <>
//     <Count count = {count} setCount={setCount}/>
//     </>
//   )
// }

// // yaha pr dekh sakte hai count component me count or setCount ka use nai hua firbhi hume ye pass 
// // krna pr raha kyuki count ka jarurat humko button component me hai ..... yahan pr ek component
// // doen gaye agar aisa bhuat sara state variable hota aur bhaut niche ka component me jana parta 
// // ye chiz baar baar likhna parega yehi hai prop drilling
// // Prop drilling is not a good thing

// // so to over come propdrilling context api cam into picture
// // context api directly teleport the props without passing it into the chain of childrens


// function Count({count, setCount})
// {
//   return <div>
//       <CountRender count={count}/>
//       <Buttons count = {count} setCount={setCount}/>
//   </div>
// }

// function Buttons({count, setCount})
// {
//   return <div>
//     <button onClick={()=>{
//       setCount(count+1);
//     }}>increase</button>
//     <button onClick={()=>{
//       setCount(count-1);
//     }}>increase</button>
//   </div>
// }

// function CountRender({count})
// {
//   return <div>
//     {count}
//   </div>
// }

// export default App



//********************************************************************************************************** */

// context api code


import { useState } from "react"
import { CountContext } from "./context"
import { useContext } from "react"
function App() {
  const [count, setCount] = useState(0)

  // wrap the component where the props should be used inside the provider here context component is 
  // act as the provider

  // context api is used for cleaner code not for the optimized rerendering
  // to make the rerendering more optimized the recoil is used in which we are renders that component only which use
  // the state variable we are rendering the all component as the context api does
  
  // code of recoil in the next part

  return (
    <CountContext.Provider value={{ count, setCount }}>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Count />
    </CountContext.Provider>
  );
}

function Count() {
  return (
    <div>
      <CountRender />
      <Buttons />
    </div>
  );
}

function Buttons() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
    </div>
  );
}

function CountRender() {
  const { count } = useContext(CountContext);
  return <div>{count}</div>;
}

export default App;

/******************************************************************************************************************** */

// // code for recoil

// // To use recoil we have make the separations between the state variables and the component we are using 
// // we can do this by making another folder in we can declare our all stae variables
// // at first create store folder and inside this create atom folder and inside this we can create our 
// // state variable as atoms



// // till now 1/4/2025 recoil is not introduced in react 19 version so i am using the react 18 version

// import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
// import { countAtom } from "./count";

// function App() {
//   return (
//     <RecoilRoot>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <Count />
//     </RecoilRoot>
//   );
// }

// function Count() {
//   return (
//     <div>
//       <CountRender />
//       <Buttons />
//     </div>
//   );
// }

// function CountRender() {
//   const count = useRecoilValue(countAtom);
//   return <div>{count}</div>;
// }

// function Buttons() {
//   const [count, setCount] = useRecoilState(countAtom);
//   return (
//     <div>
//       <button onClick={() => setCount(count + 1)}>Increase</button>
//       <button onClick={() => setCount(count - 1)}>Decrease</button>
//     </div>
//   );
// }

// export default App;