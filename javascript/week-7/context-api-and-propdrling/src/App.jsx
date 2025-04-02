
import {BrowserRouter ,Routes, Route, useNavigate} from 'react-router-dom'
import React from 'react'
// import { Dashboard } from './components/dashboard'
// import { Landing } from './components/landing'


// to make the lazy loading succesfull and we have to make the export component as default export function
// there is another error if the error is coming due to some of the asynchronous function because the lazy loading make the component
// asynchronous we can use suspense api and fallback "..loading" code to overcome this 

const Dashboardd = React.lazy(() =>import("./components/dashboard") );
const Landingg = React.lazy(() =>import("./components/landing") );
function App() {
  
  // this lines given the error 
  // react-router-dom.js?v=e6c7eb58:1196 Uncaught Error: useNavigate() may be used only in the context of a <Router> component.
  // at App
  // beacuse use navigate hook should wrap up in browser router component
  // we can ony the usnavigate hook in a compnent which is inside the BrowserRouter so
  // to make it happen we have created the appbar component and use the navigate inside it
  
  // const navigate = useNavigate();

  return (
    <div>
      {/* <div>
        <button onClick={()=>{
          window.location.href="/"
        }}>Landing page</button>

        <button onClick={()=>{
          window.location.href="/dashboard"
        }}>Dashboard</button>
      </div> */}

      

      {/* <div>
        <button onClick={()=>{
          navigate("/");
        }}>Landing page</button>

        <button onClick={()=>{
          navigate("/dashboard");
        }}>Dashboard</button>
      </div> */}

    <BrowserRouter>
    <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Appbar/>
      <Routes>
        {/* <Route path="/Dashboard" element={<Dashboard/>}></Route>
        <Route path = "/" element={<Landing/>}></Route> */}

        {/* //lazy loading syntax */}

        {/* if the error is coming due to some of the asynchronous function because the lazy loading make the component
        asynchronous we can use suspense api and fallback "..loading" code to overcome this */}

        <Route path="/Dashboard" element={<Dashboardd/>}/>
        <Route path = "/" element={<Landingg/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

// it is the right way doing routing
function Appbar()
{
  const navigate = useNavigate();
  return<div>
    <button onClick={()=>{
      navigate("/");
    }}>Landing page</button>

    <button onClick={()=>{
      navigate("/dashboard");
    }}>Dashboard</button>
</div>
}

// Lazy loading - when a person only comes to see the landing page only on that time
// it doenot necessory to load the all of the components , we can make render that much of code that is needed at that time

export default App
