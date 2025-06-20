import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/DashBord'
import ManageCategory from './Pages/ManageCategory'
import { Header } from './Components/Header'
import Login from './Pages/Login'
import { AppLayout } from './Components/AppLayout'
import Explore from './Pages/Explore'
import ItemManagementDashboard from './Pages/ManageItem'
import CategoryManagementDashboard from './Pages/ManageCategory'
import UserManagement from './Pages/UserManage'
import OrderHistory from './Pages/OrderHistory'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/*public Routes */}
        <Route path="/login" element={<Login></Login>}></Route>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard></Dashboard>}></Route>
          <Route path="/Dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/ManageCategory" element={<CategoryManagementDashboard></CategoryManagementDashboard>}></Route>
          <Route path="/Explore" element={<Explore></Explore>}></Route>
          <Route path="/ManageItem" element={<ItemManagementDashboard></ItemManagementDashboard>}></Route>
          <Route path="/UserManage" element={<UserManagement></UserManagement>}></Route>
          <Route path="/OrderHistory" element={<OrderHistory></OrderHistory>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
