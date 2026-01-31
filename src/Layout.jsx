import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24 md:pt-32 pb-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
