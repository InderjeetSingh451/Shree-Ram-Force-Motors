import {
  MdPhone,
  MdLocationOn,
  MdDirectionsCar,
  MdAccessTime,
  MdBuild,
  MdEmail,
  MdWhatsapp,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.png";
const Contact = () => {
  const phone = "9876543210"; // replace with actual number

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">CONTACT DETAILS</h1>
        <p className="text-dark-400 text-sm font-body mt-1">
          Get in touch with SHREE RAM Force Motors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Contact Info */}
        <div className="space-y-5">
          {/* Shop Info Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center">
                <img
                  src={logo}
                  alt="SHREE RAM Force Motors"
                  className="w-9 h-9 rounded-lg object-contain"
                />
              </div>
              <div>
                <h2 className="font-display text-xl text-white tracking-widest">
                  SHREE RAM FORCE MOTORS
                </h2>
                <p className="text-brand-400 text-xs font-mono tracking-widest">
                  Authorized Workshop
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdLocationOn className="text-brand-400 text-lg" />
                </div>
                <div>
                  <p className="text-dark-400 text-xs font-mono uppercase tracking-widest mb-1">
                    Address
                  </p>
                  <p className="text-white font-body text-sm leading-relaxed">
                    Auto Market,
                    <br />
                    Sirsa, Haryana
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MdPhone className="text-brand-400 text-lg" />
                </div>
                <div>
                  <p className="text-dark-400 text-xs font-mono uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="text-white font-mono text-sm hover:text-brand-400 transition-colors"
                  >
                    +91 {phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="text-green-400 text-lg" />
                </div>
                <div>
                  <p className="text-dark-400 text-xs font-mono uppercase tracking-widest mb-1">
                    WhatsApp
                  </p>
                  <a
                    href={`https://wa.me/91${phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-400 font-mono text-sm hover:text-green-300 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MdAccessTime className="text-brand-400 text-lg" />
                </div>
                <div>
                  <p className="text-dark-400 text-xs font-mono uppercase tracking-widest mb-1">
                    Working Hours
                  </p>
                  <p className="text-white font-body text-sm">
                    Monday – Saturday
                  </p>
                  <p className="text-dark-300 font-mono text-sm">
                    8:00 AM – 7:00 PM
                  </p>
                  <p className="text-dark-500 text-xs mt-1 font-body">
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="card p-6">
            <h3 className="font-display text-lg text-white tracking-widest mb-4 flex items-center gap-2">
              <MdBuild className="text-brand-400" />
              OUR SERVICES
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Engine Repair",
                "Brake Service",
                "Oil Change",
                "Electrical Work",
                "AC Repair",
                "Tyre Service",
                "Suspension",
                "Body Work",
              ].map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 bg-dark-700/50 rounded-lg px-3 py-2 border border-dark-700"
                >
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" />
                  <span className="text-dark-300 text-sm font-body">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Map */}
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-dark-700 flex items-center gap-2">
              <MdLocationOn className="text-brand-400" />
              <p className="text-white font-body text-sm font-medium">
                Auto Market, Sirsa
              </p>
            </div>
            {/* Google Map embed — owner to replace src with actual embed URL */}
            <div className="relative w-full h-80 bg-dark-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3471.6031190371486!2d75.0440536!3d29.5279255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39114d0038dac589%3A0xc2344b7bf1db970c!2sFORCE%20MOTORS%20SIRSA!5e0!3m2!1sen!2sin!4v1780917264411!5m2!1sen!2sin"
                width="600"
                height="450"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-3 bg-dark-700/30">
              <a
                href="https://maps.google.com/?q=Shiv+Nagar+Kanganpur+Road+Sirsa"
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 text-xs font-mono hover:text-brand-300 transition-colors flex items-center gap-1 justify-center"
              >
                <MdLocationOn />
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
