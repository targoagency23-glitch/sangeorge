import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin, Globe, ExternalLink, X, MessageSquare, Shield } from "lucide-react";
import { Branch, CompanyConfig, getCleanWhatsappNumber, getEmbedMapUrl, getDirectNavigationMapUrl } from "../types";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleEn: string;
  titleAr: string;
  children: React.ReactNode;
  lang?: "en" | "ar";
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, titleEn, titleAr, children, lang = "ar" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Absolute Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border border-neutral-100 transform scale-100 transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-20">
          <div>
            {lang === "en" ? (
              <>
                <h3 className="font-display text-lg font-bold text-neutral-900 tracking-tight">
                  {titleEn}
                </h3>
                <p className="font-Cairo text-xs font-semibold text-neutral-400 mt-0.5">
                  {titleAr}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-Cairo text-lg font-bold text-neutral-900">
                  {titleAr}
                </h3>
                <p className="font-sans text-xs font-semibold text-neutral-400 mt-0.5">
                  {titleEn}
                </p>
              </>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
            title={lang === "en" ? "Close" : "إغلاق"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- INTERACTIVE ASYNC MAP EMBED COMPONENT WITH AUTO-UNSHORTENING ---
interface InteractiveMapProps {
  url: string;
  fallbackQuery: string;
  title?: string;
  lang?: "en" | "ar";
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ url, fallbackQuery, title = "Location Map", lang = "ar" }) => {
  // Directly get the embed URL using our robust synchronous helper, eliminating all CORS proxies and async fetch requests
  const embedSrc = getEmbedMapUrl(url, fallbackQuery);

  return (
    <div className="w-full h-full relative group">
      {/* 
        ========================================================================
        GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER:
        If you wish to render a custom Google Maps <iframe> code directly on the page,
        you can replace the standard <iframe> tag below with your custom Google Maps iframe paste code.
        ========================================================================
      */}
      <iframe
        key={embedSrc}
        title={title}
        src={embedSrc}
        className="w-full h-full border-0 absolute inset-0"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};


// --- CONTACTS MODAL CONTENT ---
interface ContactsContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const ContactsContent: React.FC<ContactsContentProps> = ({ config, lang = "ar" }) => {
  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Dynamic buttons for quick trigger actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.contactPhone && (
          <a
            href={`tel:${config.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-3 p-4 bg-neutral-50 hover:bg-brand-blue/5 hover:border-brand-blue/30 border border-neutral-200/60 rounded-xl transition"
          >
            <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-lg shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className={lang === "en" ? "text-left" : "text-right"}>
              <span className="block text-xs text-neutral-400 font-bold uppercase tracking-wider">
                {lang === "en" ? "Call Us" : "اتصل بنا"}
              </span>
              <span className="block font-medium text-neutral-800 text-sm md:text-base font-mono">{config.contactPhone}</span>
            </div>
          </a>
        )}

        {config.contactWhatsapp && (
          <a
            href={`https://wa.me/${getCleanWhatsappNumber(config.contactWhatsapp)}`}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition"
          >
            <div className="p-2.5 bg-green-100 text-green-600 rounded-lg shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className={lang === "en" ? "text-left" : "text-right"}>
              <span className="block text-xs text-green-700 font-bold uppercase tracking-wider">
                {lang === "en" ? "WhatsApp" : "محادثة فورية (واتساب)"}
              </span>
              <span className="block font-medium text-green-800 text-sm md:text-base">
                {lang === "en" ? "Direct Chat" : "تواصل مباشر معنا"}
              </span>
            </div>
          </a>
        )}
      </div>

      <div className="border-t border-neutral-100 pt-6 space-y-4">
        {config.contactEmail && (
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {lang === "en" ? "Email Address" : "البريد الإلكتروني المعتمد"}
              </h4>
              <a href={`mailto:${config.contactEmail}`} className="text-neutral-700 font-medium hover:text-brand-blue transition">
                {config.contactEmail}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {lang === "en" ? "Working Hours" : "ساعات عمل المقر الرئيسي والمخازن"}
            </h4>
            <div className="text-neutral-700 space-y-1 mt-1">
              {lang === "en" ? (
                <p className="text-sm font-medium">{config.workingHoursEn}</p>
              ) : (
                <p className="text-sm font-Cairo font-semibold text-neutral-600">
                  {config.workingHoursAr}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- BRANCHES MODAL CONTENT ---
interface BranchesContentProps {
  branches: Branch[];
  lang?: "en" | "ar";
}

export const BranchesContent: React.FC<BranchesContentProps> = ({ branches, lang = "ar" }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const activeBranchId = selectedBranchId || branches[0]?.id || "";

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  if (!branches || branches.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400 font-medium font-Cairo" dir={lang === "ar" ? "rtl" : "ltr"}>
        {lang === "en" ? "No listed branches found." : "لا توجد أي فروع مضافة حالياً."}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Tabs navigation for branches */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-3">
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBranchId(b.id)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all text-right ${
              activeBranchId === b.id
                ? "bg-brand-blue text-white shadow-xs"
                : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <div className={`font-semibold ${lang === "ar" ? "font-Cairo text-xs" : "font-display text-xs"}`}>
              {lang === "en" ? b.nameEn : b.nameAr}
            </div>
            <div className={`opacity-65 text-3xs mt-0.5 ${lang === "ar" ? "font-sans" : "font-Cairo"}`}>
              {lang === "en" ? b.nameAr : b.nameEn}
            </div>
          </button>
        ))}
      </div>

      {activeBranch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Branch Details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-block bg-brand-blue/10 text-brand-blue text-3xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {lang === "en" ? "Active Outlet" : "منفذ بيع نشط معتمد بالسويس"}
              </span>
              <h4 className={`text-base font-bold text-neutral-900 mt-2 ${lang === "en" ? "font-display" : "font-Cairo"}`}>
                {lang === "en" ? activeBranch.nameEn : activeBranch.nameAr}
              </h4>
              <p className={`text-xs text-neutral-400 ${lang === "en" ? "font-Cairo" : "font-sans"}`}>
                {lang === "en" ? activeBranch.nameAr : activeBranch.nameEn}
              </p>
            </div>

            <div className="space-y-3 border-t border-neutral-100 pt-4 text-xs md:text-sm text-neutral-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-neutral-800">
                    {lang === "en" ? activeBranch.addressEn : activeBranch.addressAr}
                  </p>
                  <p className="text-neutral-500 mt-0.5 text-xs">
                    {lang === "en" ? activeBranch.addressAr : activeBranch.addressEn}
                  </p>
                </div>
              </div>

              {activeBranch.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div>
                    <span className="text-neutral-400 text-3xs uppercase tracking-wider block font-bold">
                      {lang === "en" ? "Branch Phone" : "هاتف الفرع المباشر"}
                    </span>
                    <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-neutral-800 font-semibold font-mono hover:text-brand-blue transition">
                      {activeBranch.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-3">
            {activeBranch.mapUrl && (
              <div className="pb-1">
                <a
                  href={getDirectNavigationMapUrl(activeBranch.mapUrl, `${activeBranch.nameAr || activeBranch.nameEn}, Suez, Egypt`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                >
                  <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                  <span className="font-Cairo">
                    {lang === "en" ? "Navigate / Open directly on Google Maps" : "الاتجاهات / فتح عبر خرائط Google مباشرة 🗺️"}
                  </span>
                </a>
              </div>
            )}
            
            {/* GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER - PASTE THE <iframe ...> CODE HERE IF YOU DESIRE DIRECT IFRAME RENDERING */}
            <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 h-[220px] relative">
              {activeBranch.mapUrl ? (
                <InteractiveMap
                  url={activeBranch.mapUrl}
                  fallbackQuery={`${activeBranch.nameAr || activeBranch.nameEn}, ${activeBranch.addressAr || activeBranch.addressEn}`}
                  title={`Map showing location of ${activeBranch.nameEn}`}
                  lang={lang}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <MapPin className="w-8 h-8 text-neutral-300 mb-1" />
                  <span className="text-xs text-neutral-400">
                    {lang === "en" ? "Map embed unavailable" : "الخارطة الجغرافية غير متوفرة حالياً للفرع"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- SOCIALS MODAL CONTENT ---
interface SocialsContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const SocialsContent: React.FC<SocialsContentProps> = ({ config, lang = "ar" }) => {
  const channels = [
    { name: "Facebook", key: "facebookUrl", icon: "🌐", color: "hover:bg-blue-50 hover:border-blue-300 text-blue-600", url: config.facebookUrl },
    { name: "Instagram", key: "instagramUrl", icon: "📸", color: "hover:bg-pink-50 hover:border-pink-300 text-pink-600", url: config.instagramUrl },
    { name: "TikTok", key: "tiktokUrl", icon: "🎵", color: "hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900", url: config.tiktokUrl },
    { name: "LinkedIn", key: "linkedinUrl", icon: "💼", color: "hover:bg-blue-50 hover:border-blue-300 text-sky-700", url: config.linkedinUrl },
  ];

  // Filter only existing ones
  const activeChannels = channels.filter(c => c.url && c.url.trim() !== "");

  if (activeChannels.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400 font-medium font-Cairo" dir={lang === "ar" ? "rtl" : "ltr"}>
        {lang === "en" ? "No active social networks configured." : "لا توجد منصات تواصل اجتماعي مضافة حالياً."}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <p className="text-xs text-neutral-400 font-medium text-center mb-2">
        {lang === "en" 
          ? "Stay updated with our latest offers, appliances, and retail news across Suez region:" 
          : "تابع آخر عروضنا وتوريداتنا والـتوكيلات المعتمدة الرسمية لشركة سان جورج في السويس:"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeChannels.map((chan) => (
          <a
            key={chan.name}
            href={chan.url}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className={`flex items-center justify-between p-4 border border-neutral-200/60 rounded-xl transition ${chan.color}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{chan.icon}</span>
              <span className="font-bold text-sm text-neutral-800">{chan.name}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </a>
        ))}
      </div>
    </div>
  );
};


// --- ADMIN GATEKEEPER PASS MODAL ---
interface AdminPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminPassword?: string;
}

export const AdminPassModal: React.FC<AdminPassModalProps> = ({ isOpen, onClose, onSuccess, adminPassword = "admin" }) => {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setErrorMsg("");
      setPassword("");
      onSuccess();
    } else {
      setErrorMsg("Error: Invalid administrator password. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setErrorMsg("");
      onSuccess();
    } catch (err: any) {
      console.error("Firebase auth login error:", err);
      setErrorMsg("Google Sign-In failed: " + (err.message || "Unknown error"));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white rounded-xl shadow-xl border border-neutral-100 max-w-sm w-full p-6 z-10 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-300 hover:text-neutral-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full text-brand-blue mb-4">
          <Shield className="w-6 h-6" />
        </div>

        <h3 className="font-display font-bold text-lg text-neutral-900">
          Admin Portal Gatekeeper
        </h3>
        <p className="text-xs text-neutral-400 mt-1 mb-5">
          Please authenticate to manage San George Co. settings.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer shadow-3xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.14 3.01-1.3 4.02v3.31h2.1c1.23-1.13 2.15-2.79 2.34-4.8 1.05-.1 2-.6 2-4.38z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.23-2.51c-.9.6-2.05.96-3.41.96-2.61 0-4.82-1.76-5.61-4.13H1.81v2.58C3.79 21.9 7.64 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M6.39 15.41c-.2-.6-.31-1.25-.31-1.91s.11-1.31.31-1.91V9.01H1.81C1.16 10.31.8 11.75.8 13.25s.36 2.94 1.01 4.24l4.58-2.08z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.64 0 3.79 2.1 1.81 6.01l4.58 2.08c.79-2.37 3-4.13 5.61-4.13z"
              />
            </svg>
            <span>{isSigningIn ? "Signing in..." : "Sign in with Google"}</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-3xs text-neutral-400 font-bold uppercase tracking-wider">or passcode</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-lg text-center font-mono focus:outline-none focus:border-brand-blue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />

            {errorMsg && (
              <p className="text-2xs text-red-600 font-semibold text-center">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-neutral-100 font-medium text-xs hover:bg-neutral-250 hover:text-neutral-700 text-neutral-600 rounded-lg transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-brand-blue text-white shadow-xs font-bold text-xs hover:bg-brand-blue-hover rounded-lg transition"
              >
                Unlock Board
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// --- SAN GEORGE UNIFIED MASTER CONTENT ---
interface SanGeorgeUnifiedContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const SanGeorgeUnifiedContent: React.FC<SanGeorgeUnifiedContentProps> = ({ config, lang = "ar" }) => {
  const [activeTab, setActiveTab] = useState<"phone" | "location" | "social">("phone");
  const branches = config.branches || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const activeBranchId = selectedBranchId || branches[0]?.id || "";

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const isMainBranch = !activeBranchId || activeBranchId === branches[0]?.id;
  const phone = isMainBranch 
    ? (config.contactPhone || activeBranch?.phone) 
    : (activeBranch?.phone || config.contactPhone);
  const whatsapp = config.contactWhatsapp;
  const locNameAr = isMainBranch
    ? (config.contactLocationNameAr || activeBranch?.nameAr || "المكتب الرئيسي لشركة سان جورج")
    : (activeBranch?.nameAr || config.contactLocationNameAr || "المكتب الرئيسي لشركة سان جورج");
  const locNameEn = isMainBranch
    ? (config.contactLocationNameEn || activeBranch?.nameEn || "San George Co. Head Office")
    : (activeBranch?.nameEn || config.contactLocationNameEn || "San George Co. Head Office");
  const locAddressAr = isMainBranch
    ? (config.contactLocationAddressAr || activeBranch?.addressAr || "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر")
    : (activeBranch?.addressAr || config.contactLocationAddressAr || "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر");
  const locAddressEn = isMainBranch
    ? (config.contactLocationAddressEn || activeBranch?.addressEn || "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt")
    : (activeBranch?.addressEn || config.contactLocationAddressEn || "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt");
  const mapUrl = isMainBranch
    ? (config.contactMapUrl || activeBranch?.mapUrl || "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed")
    : (activeBranch?.mapUrl || config.contactMapUrl || "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed");

  const facebook = config.facebookUrl;
  const instagram = config.instagramUrl;
  const tiktok = config.tiktokUrl;
  const linkedin = config.linkedinUrl;

  return (
    <div className="space-y-6 font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* 3-Tab High-contrast Switcher Grid */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/50">
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "phone"
              ? "bg-[#172995] text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Phone / Contact" : "الرقم والتواصل"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "location"
              ? "bg-[#172995] text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Showroom / Map" : "الموقع والمعرض"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "social"
              ? "bg-[#172995] text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Social Handles" : "السوشيال ميديا"}
          </span>
        </button>
      </div>

      {/* Content Rendering Space based on selected tab */}
      <div className="pt-2">
        {activeTab === "phone" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-4.5 bg-neutral-50 hover:bg-brand-blue/5 hover:border-brand-[#172995]/30 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-[#172995]/10 text-[#172995] rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Call San George" : "مكتب اتصالات سان جورج"}
                    </span>
                    <span className="block font-bold text-neutral-805 text-base font-mono">{phone}</span>
                  </div>
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4.5 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-green-700 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Official Whatsapp" : "تواصل فوري واتساب"}
                    </span>
                    <span className="block font-bold text-green-800 text-sm md:text-base">
                      {lang === "en" ? "Establish Chat" : "مراسلة فورية مع المبيعات"}
                    </span>
                  </div>
                </a>
              )}
            </div>

            <div className="border-t border-neutral-150 pt-5 space-y-4">
              {config.contactEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                      {lang === "en" ? "Email Address" : "البريد الإلكتروني المعتمد"}
                    </h4>
                    <a href={`mailto:${config.contactEmail}`} className="text-neutral-750 font-bold hover:text-brand-blue transition">
                      {config.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-[10px] font-extrabold text-[#172995] uppercase tracking-wider">
                    {lang === "en" ? "Working Hours" : "ساعات ومواعيد العمل الرسمية"}
                  </h4>
                  <div className="text-neutral-700 space-y-1 mt-1 font-Cairo font-semibold text-neutral-600">
                    <p className="text-sm">
                      {lang === "en" ? config.workingHoursEn : config.workingHoursAr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-4">
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-lg">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex-grow sm:flex-grow-0 py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeBranchId === b.id
                        ? "bg-[#172995] text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-805 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span className="font-Cairo">
                      {lang === "en" ? b.nameEn : b.nameAr}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl">
              <h4 className="font-bold text-base text-neutral-900 font-Cairo">
                {lang === "en" ? locNameEn : locNameAr}
              </h4>
              <p className="text-xs text-neutral-500 mt-1 font-Cairo">
                {lang === "en" ? locAddressEn : locAddressAr}
              </p>
              {activeBranch?.phone && (
                <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-neutral-400 font-Cairo font-semibold">
                    {lang === "en" ? "Phone:" : "هاتف الفرع:"}
                  </span>
                  <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-[#172995] font-bold hover:underline">
                    {activeBranch.phone}
                  </a>
                </div>
              )}
            </div>
            
            {mapUrl && (
              <div className="space-y-3">
                <div className="pb-1">
                  <a
                    href={getDirectNavigationMapUrl(mapUrl, `${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                    <span className="font-Cairo">
                      {lang === "en" ? "Navigate / Open directly on Google Maps" : "الاتجاهات / فتح عبر خرائط Google مباشرة 🗺️"}
                    </span>
                  </a>
                </div>
                {/* GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER - PASTE THE <iframe ...> CODE HERE IF YOU DESIRE DIRECT IFRAME RENDERING */}
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative">
                  <InteractiveMap
                    url={mapUrl}
                    fallbackQuery={`${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`}
                    title="San George Showroom Suez Map"
                    lang={lang}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-550 font-Cairo leading-relaxed">
              {lang === "en" 
                ? "Connect with San George's official channels for our general catalog, wholesale trading support, and recent announcements." 
                : "تواصل مع الحسابات الرسمية لشركة سان جورج التجارية لمعرفة جديد العروض والمبيعات والتوريدات بالسويس."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-Cairo">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-blue-700">Facebook Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-pink-50/40 hover:bg-pink-50 border border-pink-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-pink-700">Instagram Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-zinc-50/40 hover:bg-zinc-100 border border-neutral-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-neutral-800">TikTok Account</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-indigo-700">LinkedIn Business</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- SAMSUNG UNIFIED MASTER CONTENT ---
interface SamsungUnifiedContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const SamsungUnifiedContent: React.FC<SamsungUnifiedContentProps> = ({ config, lang = "ar" }) => {
  const [activeTab, setActiveTab] = useState<"phone" | "location" | "social">("phone");
  const branches = config.samsungBranches || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const activeBranchId = selectedBranchId || branches[0]?.id || "";

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const isMainBranch = !activeBranchId || activeBranchId === branches[0]?.id;
  const phone = isMainBranch
    ? (config.samsungPhone || activeBranch?.phone || config.contactPhone)
    : (activeBranch?.phone || config.samsungPhone || config.contactPhone);
  const whatsapp = config.samsungWhatsapp || config.contactWhatsapp;
  const locNameAr = isMainBranch
    ? (config.samsungLocationNameAr || activeBranch?.nameAr || "مركز خدمة وصيانة سامسونج المعتمد")
    : (activeBranch?.nameAr || config.samsungLocationNameAr || "مركز خدمة وصيانة سامسونج المعتمد");
  const locNameEn = isMainBranch
    ? (config.samsungLocationNameEn || activeBranch?.nameEn || "Samsung Authorized Service Center")
    : (activeBranch?.nameEn || config.samsungLocationNameEn || "Samsung Authorized Service Center");
  const locAddressAr = isMainBranch
    ? (config.samsungLocationAddressAr || activeBranch?.addressAr || "شارع الجيش، بجوار بوابة جامعة السويس، السويس، مصر")
    : (activeBranch?.addressAr || config.samsungLocationAddressAr || "شارع الجيش، بجوار بوابة جامعة السويس، السويس، مصر");
  const locAddressEn = isMainBranch
    ? (config.samsungLocationAddressEn || activeBranch?.addressEn || "El-Geish Street, Near Suez University, Suez, Egypt")
    : (activeBranch?.addressEn || config.samsungLocationAddressEn || "El-Geish Street, Near Suez University, Suez, Egypt");
  const mapUrl = isMainBranch
    ? (config.samsungMapUrl || activeBranch?.mapUrl || "https://maps.google.com/maps?q=Samsung%20Service%20Center,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed")
    : (activeBranch?.mapUrl || config.samsungMapUrl || "https://maps.google.com/maps?q=Samsung%20Service%20Center,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed");
  
  const facebook = config.samsungFacebookUrl || "https://facebook.com/SamsungEgypt";
  const instagram = config.samsungInstagramUrl || "https://instagram.com/samsungegypt";

  return (
    <div className="space-y-6 font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* 3-Tab High-contrast Switcher Grid */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/50">
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "phone"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Phone / Contact" : "الرقم والتواصل"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "location"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Showroom / Map" : "الموقع والمعرض"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "social"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Social Handles" : "السوشيال ميديا"}
          </span>
        </button>
      </div>

      {/* Content Rendering Space based on selected tab */}
      <div className="pt-2">
        {activeTab === "phone" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-4.5 bg-neutral-50 hover:bg-blue-50 hover:border-blue-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-blue-100/10 text-blue-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Call Samsung Desk" : "مكتب اتصالات سامسونج"}
                    </span>
                    <span className="block font-bold text-neutral-805 text-base font-mono">{phone}</span>
                  </div>
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4.5 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-green-700 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Samsung Sales WhatsApp" : "واتساب مبيعات سامسونج"}
                    </span>
                    <span className="block font-bold text-green-800 text-sm md:text-base">
                      {lang === "en" ? "Start Chat" : "مراسلة مبيعات سامسونج"}
                    </span>
                  </div>
                </a>
              )}
            </div>

            <div className="border-t border-neutral-150 pt-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                <div className="flex-grow">
                  <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                    {lang === "en" ? "Showroom Operating Hours" : "ساعات العمل بمعرض ومبيعات سامسونج"}
                  </h4>
                  <p className="text-sm font-Cairo font-semibold text-neutral-600 mt-1">
                    {lang === "en" ? config.workingHoursEn : config.workingHoursAr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-4">
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-lg">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex-grow sm:flex-grow-0 py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeBranchId === b.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-805 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span className="font-Cairo">
                      {lang === "en" ? b.nameEn : b.nameAr}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl">
              <h4 className="font-bold text-base text-neutral-900 font-Cairo">
                {lang === "en" ? locNameEn : locNameAr}
              </h4>
              <p className="text-xs text-neutral-500 mt-1 font-Cairo">
                {lang === "en" ? locAddressEn : locAddressAr}
              </p>
              {activeBranch?.phone && (
                <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-neutral-400 font-Cairo font-semibold">
                    {lang === "en" ? "Phone:" : "هاتف الفرع:"}
                  </span>
                  <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-blue-600 font-bold hover:underline">
                    {activeBranch.phone}
                  </a>
                </div>
              )}
            </div>
            
            {mapUrl && (
              <div className="space-y-3">
                <div className="pb-1">
                  <a
                    href={getDirectNavigationMapUrl(mapUrl, `${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                    <span className="font-Cairo">
                      {lang === "en" ? "Navigate / Open directly on Google Maps" : "الاتجاهات / فتح عبر خرائط Google مباشرة 🗺️"}
                    </span>
                  </a>
                </div>
                {/* GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER - PASTE THE <iframe ...> CODE HERE IF YOU DESIRE DIRECT IFRAME RENDERING */}
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative">
                  <InteractiveMap
                    url={mapUrl}
                    fallbackQuery={`${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`}
                    title="Samsung Showroom Suez Map"
                    lang={lang}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-550 font-Cairo leading-relaxed">
              {lang === "en" 
                ? "Connect with Samsung Egypt's official portals for the latest specs, catalogs, and community updates." 
                : "تابع الحسابات والمنصات الرسمية لمتابعة أحدث كتالوجات ومواصفات أجهزة وصيانة سامسونج."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-Cairo">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-blue-700">Facebook Egypt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-pink-50/40 hover:bg-pink-50 border border-pink-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-pink-700">Instagram Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- BEKO UNIFIED MASTER CONTENT ---
interface BekoUnifiedContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const BekoUnifiedContent: React.FC<BekoUnifiedContentProps> = ({ config, lang = "ar" }) => {
  const [activeTab, setActiveTab] = useState<"phone" | "location" | "social">("phone");
  const branches = config.bekoBranches || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const activeBranchId = selectedBranchId || branches[0]?.id || "";

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const isMainBranch = !activeBranchId || activeBranchId === branches[0]?.id;
  const phone = isMainBranch
    ? (config.bekoPhone || activeBranch?.phone || config.contactPhone)
    : (activeBranch?.phone || config.bekoPhone || config.contactPhone);
  const whatsapp = config.bekoWhatsapp || config.contactWhatsapp;
  const locNameAr = isMainBranch
    ? (config.bekoLocationNameAr || activeBranch?.nameAr || "معرض وتوكيل صيانة بيكو المعتمد")
    : (activeBranch?.nameAr || config.bekoLocationNameAr || "معرض وتوكيل صيانة بيكو المعتمد");
  const locNameEn = isMainBranch
    ? (config.bekoLocationNameEn || activeBranch?.nameEn || "Beko Brand Shop & Authorized Service")
    : (activeBranch?.nameEn || config.bekoLocationNameEn || "Beko Brand Shop & Authorized Service");
  const locAddressAr = isMainBranch
    ? (config.bekoLocationAddressAr || activeBranch?.addressAr || "ممشي السويس، أمام حديقة الملاحة، السويس، مصر")
    : (activeBranch?.addressAr || config.bekoLocationAddressAr || "ممشي السويس، أمام حديقة الملاحة، السويس، مصر");
  const locAddressEn = isMainBranch
    ? (config.bekoLocationAddressEn || activeBranch?.addressEn || "Suez Promenade, Opposite El-Mallah Garden, Suez, Egypt")
    : (activeBranch?.addressEn || config.bekoLocationAddressEn || "Suez Promenade, Opposite El-Mallah Garden, Suez, Egypt");
  const mapUrl = isMainBranch
    ? (config.bekoMapUrl || activeBranch?.mapUrl || "https://maps.google.com/maps?q=Beko%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed")
    : (activeBranch?.mapUrl || config.bekoMapUrl || "https://maps.google.com/maps?q=Beko%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed");
  
  const facebook = config.bekoFacebookUrl || "https://facebook.com/BekoEgypt";
  const instagram = config.bekoInstagramUrl || "https://instagram.com/beko_egypt";

  return (
    <div className="space-y-6 font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* 3-Tab High-contrast Switcher Grid */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/50">
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "phone"
              ? "bg-red-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Phone / Contact" : "الرقم والتواصل"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "location"
              ? "bg-red-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Showroom / Map" : "الموقع والمعرض"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "social"
              ? "bg-red-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Social Handles" : "السوشيال ميديا"}
          </span>
        </button>
      </div>

      {/* Content Rendering Space based on selected tab */}
      <div className="pt-2">
        {activeTab === "phone" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-4.5 bg-neutral-50 hover:bg-red-50 hover:border-red-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-red-100/10 text-red-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Call Beko Desk" : "مكتب اتصالات بيكو"}
                    </span>
                    <span className="block font-bold text-neutral-805 text-base font-mono">{phone}</span>
                  </div>
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4.5 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-green-700 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Beko WhatsApp Desk" : "واتساب مبيعات وصيانة بيكو"}
                    </span>
                    <span className="block font-bold text-green-800 text-sm md:text-base">
                      {lang === "en" ? "Start Chat" : "مراسلة مبيعات بيكو"}
                    </span>
                  </div>
                </a>
              )}
            </div>

            <div className="border-t border-neutral-150 pt-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                <div className="flex-grow">
                  <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                    {lang === "en" ? "Beko Brand Shop Hours" : "مواعيد عمل معرض بيكو الرسمية"}
                  </h4>
                  <p className="text-sm font-Cairo font-semibold text-neutral-600 mt-1">
                    {lang === "en" ? config.workingHoursEn : config.workingHoursAr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-4">
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-lg">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex-grow sm:flex-grow-0 py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeBranchId === b.id
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-805 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span className="font-Cairo">
                      {lang === "en" ? b.nameEn : b.nameAr}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl">
              <h4 className="font-bold text-base text-neutral-900 font-Cairo">
                {lang === "en" ? locNameEn : locNameAr}
              </h4>
              <p className="text-xs text-neutral-500 mt-1 font-Cairo">
                {lang === "en" ? locAddressEn : locAddressAr}
              </p>
              {activeBranch?.phone && (
                <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-neutral-400 font-Cairo font-semibold">
                    {lang === "en" ? "Phone:" : "هاتف الفرع:"}
                  </span>
                  <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-red-500 font-bold hover:underline">
                    {activeBranch.phone}
                  </a>
                </div>
              )}
            </div>
            
            {mapUrl && (
              <div className="space-y-3">
                <div className="pb-1">
                  <a
                    href={getDirectNavigationMapUrl(mapUrl, `${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                    <span className="font-Cairo">
                      {lang === "en" ? "Navigate / Open directly on Google Maps" : "الاتجاهات / فتح عبر خرائط Google مباشرة 🗺️"}
                    </span>
                  </a>
                </div>
                {/* GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER - PASTE THE <iframe ...> CODE HERE IF YOU DESIRE DIRECT IFRAME RENDERING */}
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative">
                  <InteractiveMap
                    url={mapUrl}
                    fallbackQuery={`${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`}
                    title="Beko Showroom Suez Map"
                    lang={lang}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-550 font-Cairo leading-relaxed">
              {lang === "en" 
                ? "Follow the official accounts and pages to view Beko's latest catalogs, home appliances, and customer solutions in Egypt." 
                : "تابع الحسابات والمنصات الرسمية لاستعراض أقوى عروض بيكو وكتالوجات الأجهزة والحلول الذكية."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-Cairo">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-blue-700">Facebook Egypt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-pink-50/40 hover:bg-pink-50 border border-pink-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-pink-700">Instagram Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- MIDEA UNIFIED MASTER CONTENT ---
interface MideaUnifiedContentProps {
  config: CompanyConfig;
  lang?: "en" | "ar";
}

export const MideaUnifiedContent: React.FC<MideaUnifiedContentProps> = ({ config, lang = "ar" }) => {
  const [activeTab, setActiveTab] = useState<"phone" | "location" | "social">("phone");
  const branches = config.mideaBranches || [];
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const activeBranchId = selectedBranchId || branches[0]?.id || "";

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const isMainBranch = !activeBranchId || activeBranchId === branches[0]?.id;
  const phone = isMainBranch
    ? (config.mideaPhone || activeBranch?.phone || config.contactPhone)
    : (activeBranch?.phone || config.mideaPhone || config.contactPhone);
  const whatsapp = config.mideaWhatsapp || config.contactWhatsapp;
  const locNameAr = isMainBranch
    ? (config.mideaLocationNameAr || activeBranch?.nameAr || "مركز صيانة ومعرض سان جورج المعتمد")
    : (activeBranch?.nameAr || config.mideaLocationNameAr || "مركز صيانة ومعرض سان جورج المعتمد");
  const locNameEn = isMainBranch
    ? (config.mideaLocationNameEn || activeBranch?.nameEn || "San George Authorized Service")
    : (activeBranch?.nameEn || config.mideaLocationNameEn || "San George Authorized Service");
  const locAddressAr = isMainBranch
    ? (config.mideaLocationAddressAr || activeBranch?.addressAr || "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر")
    : (activeBranch?.addressAr || config.mideaLocationAddressAr || "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر");
  const locAddressEn = isMainBranch
    ? (config.mideaLocationAddressEn || activeBranch?.addressEn || "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt")
    : (activeBranch?.addressEn || config.mideaLocationAddressEn || "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt");
  const mapUrl = isMainBranch
    ? (config.mideaMapUrl || activeBranch?.mapUrl || "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed")
    : (activeBranch?.mapUrl || config.mideaMapUrl || "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed");
  
  const facebook = config.mideaFacebookUrl || "https://facebook.com/sangeorge.suez";
  const instagram = config.mideaInstagramUrl || "https://instagram.com/sangeorge.suez";

  return (
    <div className="space-y-6 font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* 3-Tab High-contrast Switcher Grid */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/50">
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "phone"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Phone / Contact" : "الرقم والتواصل"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "location"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Showroom / Map" : "الموقع والمعرض"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "social"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Social Handles" : "السوشيال ميديا"}
          </span>
        </button>
      </div>

      {/* Content Rendering Space based on selected tab */}
      <div className="pt-2">
        {activeTab === "phone" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-4.5 bg-neutral-50 hover:bg-teal-50 hover:border-teal-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-teal-100/10 text-teal-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Call San George Desk" : "مكتب اتصالات سان جورج"}
                    </span>
                    <span className="block font-bold text-neutral-805 text-base font-mono">{phone}</span>
                  </div>
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4.5 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition shadow-3xs"
                >
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-green-700 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "San George WhatsApp Desk" : "واتساب مبيعات سان جورج"}
                    </span>
                    <span className="block font-bold text-green-800 text-sm md:text-base">
                      {lang === "en" ? "Start Chat" : "مراسلة مبيعات سان جورج"}
                    </span>
                  </div>
                </a>
              )}
            </div>

            <div className="border-t border-neutral-150 pt-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                <div className="flex-grow">
                  <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                    {lang === "en" ? "San George Shop Hours" : "مواعيد عمل معارض سان جورج الرسمية"}
                  </h4>
                  <p className="text-sm font-Cairo font-semibold text-neutral-600 mt-1">
                    {lang === "en" ? config.workingHoursEn : config.workingHoursAr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-4">
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-lg">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex-grow sm:flex-grow-0 py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeBranchId === b.id
                        ? "bg-teal-650 bg-teal-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-805 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span className="font-Cairo">
                      {lang === "en" ? b.nameEn : b.nameAr}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl">
              <h4 className="font-bold text-base text-neutral-900 font-Cairo">
                {lang === "en" ? locNameEn : locNameAr}
              </h4>
              <p className="text-xs text-neutral-550 mt-1 font-Cairo">
                {lang === "en" ? locAddressEn : locAddressAr}
              </p>
              {activeBranch?.phone && (
                <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-neutral-400 font-Cairo font-semibold">
                    {lang === "en" ? "Phone:" : "هاتف الفرع:"}
                  </span>
                  <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-teal-600 font-bold hover:underline">
                    {activeBranch.phone}
                  </a>
                </div>
              )}
            </div>
            
            {mapUrl && (
              <div className="space-y-3">
                <div className="pb-1">
                  <a
                    href={getDirectNavigationMapUrl(mapUrl, `${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                    <span className="font-Cairo">
                      {lang === "en" ? "Navigate / Open directly on Google Maps" : "الاتجاهات / فتح عبر خرائط Google مباشرة 🗺️"}
                    </span>
                  </a>
                </div>
                {/* GOOGLE MAPS IFRAME EMBED CODE PLACEHOLDER - PASTE THE <iframe ...> CODE HERE IF YOU DESIRE DIRECT IFRAME RENDERING */}
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative">
                  <InteractiveMap
                    url={mapUrl}
                    fallbackQuery={`${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`}
                    title="San George Showroom Suez Map"
                    lang={lang}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-550 font-Cairo leading-relaxed">
              {lang === "en" 
                ? "Follow the official accounts and pages to view San George's latest catalogs, home appliances, and customer solutions in Suez." 
                : "تابع الحسابات والمنصات الرسمية لاستعراض أقوى عروض سان جورج في السويس والحلول والخدمات."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-Cairo">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-blue-700">Facebook Egypt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-between p-4 bg-pink-50/40 hover:bg-pink-50 border border-pink-200/50 rounded-xl transition"
                >
                  <span className="text-xs font-bold text-pink-700">Instagram Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

