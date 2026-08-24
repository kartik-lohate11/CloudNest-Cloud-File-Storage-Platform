import { useState } from "react";
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Zap,
  HardDrive,
  FileCode,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadModal from "../components/UploadModal";
import FileDetailsModal from "../components/FileDetailsModal";
import UserProfile from "../components/UserProfile";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(0);

  const faqs = [
    {
      q: "How do I connect CloudNest frontend with my Spring Boot and MinIO backend?",
      a: "The API endpoints in src/services/api.js are pre-configured to point to http://localhost:8081 with endpoints for /api/auth and /api/files. You can modify the base URL in Settings > Spring Boot & MinIO or in your application properties.",
    },
    {
      q: "What file types and maximum sizes are supported?",
      a: "CloudNest supports PDF, DOCX, XLSX, CSV, PNG, JPG, MP4, MOV, APK, ZIP and more. The client supports individual file sizes up to 5 GB with chunked multipart uploads.",
    },
    {
      q: "How does the Trash retention cycle work?",
      a: "When you delete a file, it is transferred to the Trash repository. Files remain in Trash for 30 days before being purged, and can be restored with a single click at any time.",
    },
    {
      q: "How are my uploaded files stored?",
      a: "All files uploaded to CloudNest are stored securely in MinIO object storage with metadata indexed in a MySQL relational database.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen flex relative overflow-x-hidden">
      <div className="abstract-bg" />
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col w-full relative z-10">
        <Header />

        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
          {/* Hero Help Search */}
          <div className="text-center py-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Hanken_Grotesk'] mb-2">
              How can we help you?
            </h2>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
              Search knowledge base articles, FAQs, and developer documentation for CloudNest.
            </p>

            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords: upload, trash, minio, spring boot..."
                className="w-full dark-input rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 shadow-xl focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick Guide Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Documentation</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Step-by-step guides on directory structure, REST API models, and JWT authorization.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Storage & Quotas</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Learn how automatic deduplication, file compression, and S3 retention policies work.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3 text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Contact Support</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Direct channel to our engineering team for technical troubleshooting and bug reports.
              </p>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 font-['Hanken_Grotesk']">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedFaq === index ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>

                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <UploadModal />
      <FileDetailsModal />
      <UserProfile />
    </div>
  );
};

export default HelpCenter;
