"use client";
import React from "react";
import {
  Bot,
  FileText,
  Zap,
  Search,
  ChevronRight,
  Scale,
  Clock,
  ShieldCheck,
} from "lucide-react";

// Placeholder for the chat mockup visual
const ChatMockup: React.FC = () => (
  <div className="relative w-full max-w-xl mx-auto h-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
    {/* Mockup Header */}
    <div className="flex items-center justify-between p-3 bg-blue-600 text-white shadow-md">
      <div className="flex items-center">
        <Bot className="w-5 h-5 mr-2" />
        <span className="font-semibold text-sm">Nyay Sahayak Chat</span>
      </div>
      <div className="text-xs opacity-80">Online</div>
    </div>

    {/* Mockup Messages */}
    <div className="p-4 space-y-3 h-full overflow-y-scroll pb-16">
      <div className="flex justify-start">
        <div className="bg-gray-100 p-3 rounded-lg text-sm max-w-[80%] shadow-sm">
          Hello. Explain Section 125 CrPC regarding maintenance of wife.
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-blue-100 p-3 rounded-lg text-sm text-gray-800 max-w-[80%] shadow-sm border border-blue-200">
          Section 125 CrPC deals with maintenance... (excerpt)
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-blue-100 p-3 rounded-lg text-sm text-gray-800 max-w-[80%] shadow-sm border border-blue-200">
          ...includes wife, children, and parents.
        </div>
      </div>
      <div className="flex justify-start">
        <div className="bg-gray-100 p-3 rounded-lg text-sm max-w-[80%] shadow-sm">
          What are the conditions for interim alimony?
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-blue-100 p-3 rounded-lg text-sm text-gray-800 max-w-[80%] shadow-sm border border-blue-200">
          The court can grant interim alimony during the pendency of
          proceedings.
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
    <div
      className={`p-3 w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 flex items-center justify-center`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);

export default function LegalLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* 1. Header/Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a
            href="#"
            className="flex items-center text-xl font-bold text-gray-900"
          >
            <Bot className="w-6 h-6 mr-2 text-blue-600" />
            Nyay Sahayak
          </a>
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <a
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              About Us
            </a>
            <a
              href="#contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="py-2 px-5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/50"
            >
              Start Chatting
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              <span className="text-blue-600">Smarter Legal Research.</span>{" "}
              Instant Answers.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Your AI Co-Pilot for quick, accurate, and grounded legal insights,
              referencing verified case law and statutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="py-3 px-8 text-lg text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-500/50 flex items-center justify-center"
              >
                Try the Co-Pilot Now <ChevronRight className="w-5 h-5 ml-1" />
              </a>
              <a
                href="#features"
                className="py-3 px-8 text-lg text-blue-600 bg-white border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold shadow-md flex items-center justify-center"
              >
                See Features
              </a>
            </div>
          </div>

          {/* Hero Visual (Mockup) */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Get reliable, documented legal assistance, faster than ever before.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search />}
              title="Grounded Answers"
              description="Every response is backed by real, citable legal documents. We show you the source material, ensuring absolute trust."
            />
            <FeatureCard
              icon={<Zap />}
              title="Instant Summaries"
              description="Upload complex legal texts or paste case briefs and receive a concise, actionable summary in seconds, not hours."
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="Confidential & Secure"
              description="Your queries and data are protected with industry-leading security protocols, ensuring complete privacy for sensitive research."
            />
            <FeatureCard
              icon={<FileText />}
              title="Statute Deep Dive"
              description="Get detailed explanations of any section, chapter, or article of major legal codes with relevant cross-references."
            />
            <FeatureCard
              icon={<Scale />}
              title="Jurisdictional Context"
              description="Understand how laws are applied in different jurisdictions, with insights tailored to specific state or central regulations."
            />
            <FeatureCard
              icon={<Clock />}
              title="24/7 Availability"
              description="Legal research doesn't stop. Access instant legal guidance anytime, day or night, from any device."
            />
          </div>
        </div>
      </section>

      {/* 4. Final CTA Section */}
      <section id="contact" className="py-24 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Revolutionize Your Legal Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of legal research today. It's time to work smarter,
            not harder.
          </p>
          <a
            href="/dashboard"
            className="inline-block py-4 px-10 text-xl text-blue-600 bg-white rounded-xl hover:bg-gray-100 transition-colors font-bold shadow-lg shadow-black/30"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Nyay Sahayak Co-Pilot. All rights
            reserved.
          </p>
          <p className="mt-2 text-gray-500">
            <a href="#" className="hover:text-blue-500 mx-2">
              Privacy Policy
            </a>{" "}
            |
            <a href="#" className="hover:text-blue-500 mx-2">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
