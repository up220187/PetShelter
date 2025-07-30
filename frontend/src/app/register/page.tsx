"use client";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="global-paws-background"></div>

      <div className="main-content-wrapper">

        <div className="logo-container">
          <img
            src="/logo1.png" 
            alt="Pet Shelter Logo"
          />
        </div>

        <div className="form-box">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}