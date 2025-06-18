import { Outlet, useNavigate } from "react-router";
import { Header } from "./Header";
import { useEffect } from "react";


export const AppLayout = () => {
  const token = localStorage.getItem("authToken");
  const nav = useNavigate();
  useEffect(() => {
    if (!token) {
      nav("/login");
    }
  }, [])

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
