import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login";
import SignupPage from "./components/signup";
import App from "../src/App.js"
import { createRoot } from "react-dom/client";
import HomePage from "./components/home";
import BurnedCDs from "./components/burned";


const container = document.getElementById('root');
const root = createRoot(container);

 root.render(
   <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/signuppage" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/burnedcds" element={<BurnedCDs />} />


   </Routes>
   </BrowserRouter>,
 );


