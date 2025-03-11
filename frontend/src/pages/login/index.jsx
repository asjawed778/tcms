import React from "react";
import LoginForm from "./LoginForm";
import RightSideComponent from "./LoginVisuals";

const LoginPage = () => {
    return (
        <div className="ml-60 flex flex-col md:flex-row h-screen ">
          <div className="w-full md:w-2/5 p-6 md:p-10 text-center flex flex-col justify-center flex-grow">
            <h1 className="text-3xl text-primary md:text-5xl font-bold mb-2">Welcome back!</h1>
            <p className="mb-6  font-bold md:text-base">Central Modern School Teams</p>
              <LoginForm />
          </div>
          <RightSideComponent />
        </div>
      );
}
export default LoginPage;