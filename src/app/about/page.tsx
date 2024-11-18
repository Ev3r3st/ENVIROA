import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-gray-700 mb-4">
          Welcome to our PWA app! We are dedicated to providing the best service
          possible.
        </p>
        <p className="text-gray-700 mb-4">
          Our team is composed of experienced professionals who are passionate
          about technology and innovation.
        </p>
        <p className="text-gray-700">
          Thank you for visiting our app. We hope you have a great experience!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
