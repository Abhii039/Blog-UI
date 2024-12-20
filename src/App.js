import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import Admin from './pages/admin/Admin';
import AboutPage from "./pages/about/About";
import Favorites from './pages/favorites/Favorites';
import MyPosts from "./pages/mypost/MyPosts";

// function App() {
//   const currentUser = true;
//   return (
//     <>
//       <Router>
//         <TopBar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />}></Route>
//           <Route path="/login" element={<Login />} />
//           <Route path="/write" element={<Write />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/post/:postId" element={<Single />} />
//           <Route path="/single" element={<Single />} />

//         </Routes>
//       </Router>
//     </>
//   );
// }

function App() {
  const { user } = useContext(Context);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/write" element={user ? <Write /> : <Register />} />
        <Route path="/settings" element={user ? <Settings /> : <Register />} />
        <Route path="/post/:postId" element={<Single />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/myposts" element={<MyPosts/>}/>
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
