import React from "react";
import Banner from "../components/Banner";

const Contact = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* Content Wrapper */}
      <div
        className="w-full max-w-6xl rounded-lg shadow-lg overflow-hidden p-8 space-y-10"
        style={{ backgroundColor: "var(--bg-color)" }}
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2
            className="text-4xl font-extrabold"
            style={{ color: "var(--text-color)" }}
          >
            Contact Us
          </h2>
          <p
            className="text-lg"
            style={{ color: "var(--text-color)" }}
          >
            Reach out to us for any inquiries, assistance, or feedback. We're
            here to help.
          </p>
        </div>

        {/* Emergency Contact Section with Hover Effect */}
        <div
          className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg p-6 shadow-md text-center transition-transform transform hover:scale-105"
          style={{
            transition: "transform 0.3s ease-in-out", // Smooth scaling effect
          }}
        >
          <h3 className="text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
            Emergency Contact
          </h3>
          <p className="text-lg">
            In case of an emergency, call:{" "}
            <span className="text-4xl font-extrabold">000</span>
          </p>
        </div>

        {/* Contact Details and Facility Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details with Clinic Hours */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
          >
            <h4
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-3xl">📞</span>
                <p className="text-lg">
                  <span className="font-semibold">Phone:</span> (123) 456-7890
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-3xl">📧</span>
                <p className="text-lg">
                  <span className="font-semibold">Email:</span>{" "}
                  contact@orionhealth.com
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-blue-600 text-3xl">📍</span>
                <p className="text-lg">
                  <span className="font-semibold">Address:</span> 123 Wellness
                  Street, Health City, HC 12345
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-300 mt-6">
              <h5
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-color)" }}
              >
                Clinic Hours
              </h5>
              <ul className="space-y-1">
                <li className="text-lg">
                  <strong>Monday - Friday:</strong> 8:00 AM - 4:00 PM
                </li>
                <li className="text-lg">
                  <strong>Saturday:</strong> 8:00 AM - 12:00 PM
                </li>
                <li className="text-lg">
                  <strong>Sunday:</strong> Closed
                </li>
              </ul>
            </div>
          </div>

          {/* Facility Details */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
          >
            <h4
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Our Facility
            </h4>
            <p className="text-lg mb-4">
              Our <span className="font-semibold">two-floor building</span>{" "}
              offers specialized healthcare services:
            </p>
            <div className="space-y-6">
              <div>
                <h5 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>First Floor</h5>
                <ul className="list-disc list-inside space-y-2">
                  <li>General Clinic - Everyday health needs</li>
                  <li>Pediatrics Clinic - Child-friendly care</li>
                </ul>
              </div>
              <div>
                <h5 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>Second Floor</h5>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maternity Clinic - Prenatal and postnatal care</li>
                  <li>Skin Health Clinic - Dermatology and skincare solutions</li>
                  <li>Neurology & Rehab Center - Neurological care and therapy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg shadow-md overflow-hidden">
          <iframe
            title="Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.724073841039!2d115.86045721508882!3d-31.954447781241515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32badcd017d9d9%3A0x9011222d438fbb0e!2sRoyal%20Perth%20Hospital!5e0!3m2!1sen!2sus!4v1698761234567!5m2!1sen!2sus"
            className="w-full h-96 border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Privacy Policy Section */}
        <div
          className="w-full mt-8 p-6 rounded-lg shadow-lg"
          style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
          <h3
            className="text-center text-2xl font-bold mb-4"
            style={{ color: "var(--text-color)" }}
          >
            Privacy Policy
          </h3>
          <p className="mb-4">
            At ORION Health, we are committed to protecting your privacy. This
            Privacy Policy outlines the types of information we collect, how we
            use it, and the measures we take to keep it secure.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Information We Collect:</span> We may
            collect personal information such as your name, email address, and
            phone number when you contact us or use our services.
          </p>
          <p className="mb-2">
            <span className="font-semibold">How We Use Your Information:</span>{" "}
            We use your information to respond to your inquiries, provide
            healthcare services, and improve our offerings. We do not share your
            information with third parties without your consent, except as
            required by law.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Security Measures:</span> We employ
            industry-standard security practices to protect your information from
            unauthorized access and disclosure.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Your Rights:</span> You have the right
            to request access to, correct, or delete your personal information.
            Please contact us if you wish to exercise these rights.
          </p>
          <p>
            If you have questions about our Privacy Policy, feel free to contact
            us at the email provided above.
          </p>
        </div>

        {/* Banner Component */}
        <div className="mt-8 w-full">
          <Banner />
        </div>
      </div>
    </div>
  );
};

export default Contact;