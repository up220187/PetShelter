"use client";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
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
          <LoginForm />
        </div>
      </div>
    </div>
  );
}