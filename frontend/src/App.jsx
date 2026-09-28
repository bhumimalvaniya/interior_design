import { useState } from 'react'
import Layout from './Layout.jsx';
import Home from './components/Home.jsx'
import {BrowserRouter as Router,Route,Routes,useLocation} from 'react-router-dom'
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import About from './components/About.jsx';
import Gallery from './components/Gallery.jsx';
import Contact from './components/Contact.jsx';

import AdminProtectedRoute from './components/Admin/AdminProtectedRoute.jsx';

// Services
import Services from './components/Services.jsx';

import LivingRoom from './components/Services/LivingRoom.jsx';
import Bedroom from './components/Services/Bedroom.jsx';
import Kitchen from './components/Services/Kitchen.jsx';
import Office from './components/Services/Office.jsx';
import Commercial from './components/Services/Commercial.jsx';


//Projects
import Projects from './components/Projects.jsx';

import Residential from './components/Projects/Residential.jsx';
import Commercial2 from './components/Projects/Commercial2.jsx';
import CompletedProjects from './components/Projects/CompletedProjects.jsx';

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import BookConsultation from './components/BookConsultation.jsx';
import SetProfile from './components/SetProfile.jsx';
import Account from './components/Account.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import Bookings from './components/Bookings.jsx';
import Search from './components/Search.jsx';

//Admin
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import AdminLogin from './components/Admin/AdminLogin.jsx';
import AdminForgotPassword from './components/Admin/AdminForgotPassword.jsx';
import Users from './components/Admin/Users.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import AdminProjects from './components/Admin/AdminProjects.jsx';
import AdminGallery from './components/Admin/AdminGallery.jsx';
import AdminCategories from './components/Admin/AdminCategories.jsx';
import AdminContacts from './components/Admin/AdminContacts.jsx';
import A_Services from './components/Admin/A_Services.jsx';
import A_Bookings from './components/Admin/A_Bookings.jsx';
import A_HeaderMenu from './components/Admin/A_HeaderMenu.jsx';

import A_Addevent from './components/Admin/A_Addevent.jsx';
import AddProject from './components/Admin/AddProject.jsx';
import EditProject from './components/Admin/EditProject.jsx';
import AddGallery from './components/Admin/AddGallery.jsx';
import EditGallery from './components/Admin/EditGallery.jsx';
import AddCategory from './components/Admin/AddCategory.jsx';
import EditCategory from './components/Admin/EditCategory.jsx';
import A_AddServices from './components/Admin/A_AddService.jsx';
import A_EditService from './components/Admin/A_EditService.jsx';

function AppContent() {
   const location = useLocation();

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/gallery' element={<Gallery/>}/>
        <Route path='/contact' element={<Contact/>}/>

        {/* Services */}
        <Route path='services'>
            <Route path='' element={<Services/>}/>
            <Route path='living-room' element={<LivingRoom/>}/>
            <Route path='bedroom' element={<Bedroom/>}/>
            <Route path='kitchen' element={<Kitchen/>}/>
            <Route path='office' element={<Office/>}/>
            <Route path='commercial' element={<Commercial/>}/>
           
        </Route>

        {/* Projects */}
        <Route path='projects'>
            <Route path='' element={<Projects/>}/>
            <Route path='residential' element={<Residential/>}/>
            <Route path='commercial2' element={<Commercial2/>}/>
            <Route path='completed' element={<CompletedProjects/>}/>
            
        </Route>

          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/consultation' element={<BookConsultation/>}/>
          
          {/* Account */}
          <Route path='/setprofile' element={<SetProfile/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/change-password' element={<ChangePassword/>}/>
          <Route path='/bookings' element={<Bookings/>}/>
          <Route path='/search' element={<Search/>}/>

        </Route>

         {/* Admin */}
         {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route> */}

        <Route path="/admin/login" element={<AdminLogin />}/>
        <Route path="/admin/forgot-password" element={<AdminForgotPassword/>}/>
        <Route path="/admin/events/add" element={<A_Addevent />}/>
        <Route path="/admin/projects/add" element={<AddProject />}/>
        <Route path="/admin/projects/edit/:id" element={<EditProject/>}/>
        <Route path="/admin/gallery/add" element={<AddGallery/>}/>
        <Route path="/admin/gallery/edit/:id" element={<EditGallery/>}/>
        <Route path="/admin/categories/add" element={<AddCategory/>}/>
        <Route path="/admin/categories/edit/:id" element={<EditCategory/>}/>
        <Route path="/admin/services/add" element={<A_AddServices/>}/>
        <Route path="/admin/services/edit/:id" element={<A_EditService/>}/>
         
         <Route  element={<AdminProtectedRoute/>}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="users" element={<Users />}/>  
            <Route path="projects" element={<AdminProjects />}/>
            <Route path="gallery" element={<AdminGallery />}/>
            <Route path="services" element={<A_Services />}/>
            <Route path="categories" element={<AdminCategories/>}/>
            <Route path="contacts" element={<AdminContacts/>}/>
            <Route path="bookings" element={<A_Bookings/>}/>
            <Route path="header_menu" element={<A_HeaderMenu/>}/>
        </Route>
        </Route>
     
      </Routes>
    </>
  )
}

function App(){
  return(
    <Router>
      <AppContent/>
    </Router>
  )
}
export default App;
