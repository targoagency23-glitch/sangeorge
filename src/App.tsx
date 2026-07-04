import { useState, useEffect } from "react";
import { CompanyConfig, getCleanWhatsappNumber } from "./types";
import { DEFAULT_COMPANY_CONFIG } from "./defaultData";
import { BrandMarquee } from "./components/BrandMarquee";
import { 
  SimpleModal, 
  ContactsContent, 
  BranchesContent, 
  SocialsContent, 
  AdminPassModal,
  SanGeorgeUnifiedContent,
  SamsungUnifiedContent,
  BekoUnifiedContent,
  MideaUnifiedContent
} from "./components/InfoModals";
import { AdminPortal } from "./components/AdminPortal";
import { Shield, Sparkles, Gift, Percent, Phone, MessageSquare, Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doc, onSnapshot, setDoc, getDocFromServer } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "./firebase";

function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields) as unknown as T;
  }
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const val = (obj as any)[key];
    if (val !== undefined) {
      result[key] = removeUndefinedFields(val);
    }
  }
  return result as T;
}

export default function App() {
  const [config, setConfig] = useState<CompanyConfig>(() => {
    try {
      const stored = localStorage.getItem("sangeorge_co_config");
      if (stored) {
        return JSON.parse(stored) as CompanyConfig;
      }
    } catch (_) {}
    return DEFAULT_COMPANY_CONFIG;
  });
  const [loading, setLoading] = useState(() => {
    try {
      const stored = localStorage.getItem("sangeorge_co_config");
      if (stored) return false;
    } catch (_) {}
    return true;
  });

  // Persistent language local locale: "ar" or "en"
  const [lang, setLang] = useState<"en" | "ar">(() => {
    try {
      const stored = localStorage.getItem("sangeorge_co_lang");
      if (stored === "en" || stored === "ar") {
        return stored;
      }
    } catch (_) {}
    return "ar"; // default to Arabic as requested first ("عربي و انجليزي")
  });

  // Dual View controller state: "client" or "admin"
  const [viewMode, setViewMode] = useState<"client" | "admin">("client");

  // Dialog triggers state
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [activeClientModal, setActiveClientModal] = useState<"contacts" | "branches" | "social" | "midea" | null>(null);

  // Carousel slider state for testimonials
  const [currentTestiIndex, setCurrentTestiIndex] = useState(0);

  // Connection and live configuration sync from Firestore
  useEffect(() => {
    // 1. Test database connection as required by rules
    const verifyConnection = async () => {
      try {
        await getDocFromServer(doc(db, "configs", "sangeorge_co"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("offline")) {
          console.error("Please check your Firebase configuration or connection.");
        }
      }
    };
    verifyConnection();

    // 2. Attach real-time listener to configs document
    const configDocRef = doc(db, "configs", "sangeorge_co");
    const unsubscribe = onSnapshot(configDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as CompanyConfig;
        
        // Ensure brand records compatibility or migration if raw arrays exist
        if (remoteData.brands && remoteData.brands.length > 0) {
          remoteData.brands = remoteData.brands.map((b: any, idx) => {
            if (typeof b === "string") {
              const matchingDefault = DEFAULT_COMPANY_CONFIG.brands.find(
                (def) => def.name.toLowerCase() === b.toLowerCase()
              );
              return {
                id: `brand-migrated-${idx}-${Date.now()}`,
                name: b,
                logoUrl: matchingDefault ? matchingDefault.logoUrl : ""
              };
            }
            return b;
          });
        }

        // Self-healing migration for San George Google Maps shortlink
        let isUpdated = false;
        if (!remoteData.mideaMapUrl || remoteData.mideaMapUrl.includes("Port%20Said")) {
          remoteData.mideaMapUrl = "https://maps.app.goo.gl/U1keM2jD4mAEKZrk7";
          isUpdated = true;
        }
        if (remoteData.mideaBranches && remoteData.mideaBranches.length > 0) {
          remoteData.mideaBranches = remoteData.mideaBranches.map((branch) => {
            if (!branch.mapUrl || branch.mapUrl.includes("Port%20Said")) {
              isUpdated = true;
              return { ...branch, mapUrl: "https://maps.app.goo.gl/U1keM2jD4mAEKZrk7" };
            }
            return branch;
          });
        }
        if (isUpdated) {
          try {
            await setDoc(configDocRef, removeUndefinedFields(remoteData));
          } catch (err) {
            console.error("Failed to self-heal San George mapUrl:", err);
          }
        }
        
        setConfig(remoteData);
        setLoading(false);
      } else {
        // Cold start bootstrap: write template defaults to DB so app starts with valid layout
        try {
          // Check if there was local data we can bootstrap
          let initialConfig = DEFAULT_COMPANY_CONFIG;
          const stored = localStorage.getItem("sangeorge_co_config");
          if (stored) {
            try {
              initialConfig = JSON.parse(stored) as CompanyConfig;
            } catch (_) {}
          }
          await setDoc(configDocRef, removeUndefinedFields(initialConfig));
          setConfig(initialConfig);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, "configs/sangeorge_co");
        } finally {
          setLoading(false);
        }
      }
    }, (error) => {
      console.error("Firestore live snapshot issue: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync back to local storage when configurations change as a reliable offline offline fallback
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("sangeorge_co_config", JSON.stringify(config));
    }
  }, [config, loading]);

  // Keep language state sync
  useEffect(() => {
    localStorage.setItem("sangeorge_co_lang", lang);
  }, [lang]);

  // Handle successful Admin unlocked authentication
  const handleAdminUnlocked = () => {
    setIsAdminAuthOpen(false);
    setViewMode("admin");
  };

  const handleResetToDefaults = async () => {
    if (window.confirm("Are you sure you want to restore original Suez brand defaults? All current edits will be cleared.")) {
      try {
        const configDocRef = doc(db, "configs", "sangeorge_co");
        await setDoc(configDocRef, removeUndefinedFields(DEFAULT_COMPANY_CONFIG));
        setConfig(DEFAULT_COMPANY_CONFIG);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "configs/sangeorge_co");
      }
    }
  };

  // Render Admin Workspace view
  if (viewMode === "admin") {
    return (
      <AdminPortal
        config={config}
        lang={lang}
        onSave={async (newConfig) => {
          try {
            const configDocRef = doc(db, "configs", "sangeorge_co");
            await setDoc(configDocRef, removeUndefinedFields(newConfig));
            localStorage.setItem("sangeorge_co_config", JSON.stringify(newConfig));
            setConfig(newConfig);
            setViewMode("client");
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, "configs/sangeorge_co");
          }
        }}
        onReset={handleResetToDefaults}
        onExit={() => setViewMode("client")}
      />
    );
  }

  // Full screen elegant pulsing loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="w-3.5 h-12 bg-[#172995] rounded-xs font-bold shrink-0"></div>
            <div className="w-3.5 h-12 bg-red-650 bg-red-600 rounded-xs shrink-0"></div>
            <div className="w-3.5 h-12 bg-amber-500 rounded-xs shrink-0"></div>
            <div className="w-3.5 h-12 bg-[#0284c7] rounded-xs shrink-0"></div>
          </div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse tracking-wide font-Cairo">
            جاري تحميل البيانات وتأمين الاتصال بالسحابة...
          </p>
        </div>
      </div>
    );
  }

  // Else, render the highly polished, client-facing Suez Landing Page with dynamic direction
  return (
    <div 
      className="min-h-screen bg-white text-neutral-800 font-sans flex flex-col antialiased selection:bg-[#172995]/10 selection:text-[#172995]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      
      {/* 1. HEADER BRAND BAR */}
      <header className="sticky top-0 z-45 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Suez tags */}
          <div className="flex items-center gap-4">
            {config.logoUrl ? (
              <div className="flex items-center justify-center shrink-0 h-16 min-w-[110px] bg-white p-2 rounded-lg">
                <img 
                  src={config.logoUrl} 
                  alt={`${config.companyNameEn} Logo`} 
                  className="max-h-12 max-w-[180px] object-contain bg-white"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to text representation or hide
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : null}
            
            {/* Fallback elegant, corporate modern rectangular logo with 4 combined shapes */}
            {!config.logoUrl && (
              <div className="flex items-center gap-3 px-1 py-1 shrink-0 h-16">
                {/* 4 combined shapes/stripes of Suez trade */}
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-9 bg-[#172995] rounded-xs font-bold shrink-0"></div>
                  <div className="w-2.5 h-9 bg-red-600 rounded-xs shrink-0"></div>
                  <div className="w-2.5 h-9 bg-amber-500 rounded-xs shrink-0"></div>
                  <div className="w-2.5 h-9 bg-emerald-600 rounded-xs shrink-0"></div>
                </div>
                <span className="font-display font-black text-xl text-[#172995] tracking-widest pl-1.5">
                  SG
                </span>
              </div>
            )}
 

          </div>

          {/* Sleek Navigation Menu links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-[#172995] font-semibold hover:opacity-90 transition">
              {lang === "en" ? "Home" : "الرئيسية"}
            </a>
            <a href="#about-section-view" className="hover:text-[#172995] transition">
              {lang === "en" ? "About Us" : "من نحن"}
            </a>
            <a href="#brand-marquee-section" className="hover:text-[#172995] transition">
              {lang === "en" ? "Global Partners" : "الوكالات العالمية"}
            </a>
            
            {/* Suez channel badge */}
            <div className={`inline-flex items-center gap-1.5 bg-[#172995]/5 px-3 py-1 rounded-full border border-gray-150 text-[#172995] text-[11px] font-semibold ${lang === "ar" ? "font-Cairo" : "font-sans font-bold"}`}>
              <span className="w-1.5 h-1.5 bg-[#172995] rounded-full animate-pulse"></span>
              <span>{lang === "en" ? "Suez Certified Member" : "عضو معتمد بالسويس"}</span>
            </div>
          </nav>

          {/* Action buttons bar */}
          <div className="flex items-center gap-3">
            {/* Beautiful Multi-Language Switcher */}
            <div className="flex items-center bg-gray-100 hover:bg-gray-200/50 p-0.5 rounded-full transition-all border border-gray-200/50">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold font-display transition-all duration-200 cursor-pointer ${
                  lang === "en"
                    ? "bg-[#172995] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-Cairo font-extrabold tracking-normal transition-all duration-200 cursor-pointer ${
                  lang === "ar"
                    ? "bg-[#172995] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Admin toggle button */}
            <button
              onClick={() => setIsAdminAuthOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-gray-50 border border-gray-200 text-[#172995] hover:bg-gray-100 font-bold text-xs transition-all duration-200 cursor-pointer shadow-3xs"
              title="Admin Console Login"
              id="admin-login-trigger"
            >
              <Shield className="w-4 h-4 text-[#172995]/70" />
              <span className="hidden sm:inline">{lang === "en" ? "Admin Portal" : "لوحة التحكم"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SECTION LANDING WRAPPERS */}
      <main className="flex-grow bg-[#FCFDFE]">
        
        {/* HERO SECTION CONTAINER */}
        <section id="about-section-view" className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Dynamic Narrative Left Column */}
          <div className="lg:col-span-12 lg:col-span-7 space-y-8">
            
            <span className="inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#172995]/10 text-[#172995] rounded-lg">
              {lang === "en" ? "Authorized Suez Commercial Hub" : "شريك تجاري معتمد بالسويس • شركة سان جورج"}
            </span>

            <div className="space-y-5">
              <h2 className={`text-3.5xl md:text-5xl lg:text-[52px] text-slate-950 tracking-tight leading-[1.1] ${lang === "en" ? "font-display font-black" : "font-Cairo font-black"}`}>
                {lang === "en" ? config.taglineEn : config.taglineAr}
              </h2>
            </div>

            <div className="space-y-6 text-slate-600 text-sm md:text-[15.5px] leading-relaxed">
              <p className={lang === "en" ? "font-sans font-medium" : "font-Cairo font-semibold text-slate-705 text-slate-700"}>
                {lang === "en" ? config.aboutTextEn : config.aboutTextAr}
              </p>
            </div>

            {/* CONNECTIVITY MODULE: Beautiful Custom Sleek Cards Grid Layout */}
            <div className="pt-6 space-y-5">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#172995]/75 flex items-center gap-3">
                <span>{lang === "en" ? "Enterprise Connectivity Solutions" : "حلول اتصال التوريدات والتوكيلات"}</span>
                <span className="h-px bg-gray-100 flex-grow"></span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Branches Panel Portlet - NOW SAMSUNG */}
                {config.buttons.branches.visible && (
                  <button
                    onClick={() => setActiveClientModal("branches")}
                    className="group relative w-full h-[175px] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer border border-gray-100"
                  >
                    {config.buttons.branches.imageUrl ? (
                      <img 
                        src={config.buttons.branches.imageUrl} 
                        alt="Samsung" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-right bg-white">
                        <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm shadow-blue-500/10">
                          <span className="text-xl">📱</span>
                        </div>
                        <div className="w-full">
                          <h5 className={`font-bold text-slate-950 text-base ${lang === "en" ? "text-left font-display" : "text-right font-Cairo"}`}>
                            {lang === "en" ? "Samsung" : "سامسونج"}
                          </h5>
                          <span className={`block text-[11px] text-slate-400 font-medium mt-0.5 mb-4 ${lang === "en" ? "text-left font-sans" : "text-right font-Cairo"}`}>
                            {lang === "en" ? "Phone • Location • Social handles" : "الرقم • الموقع • وسائل التواصل"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold text-[#172995] flex items-center gap-1.5 mt-auto uppercase tracking-wider ${lang === "en" ? "justify-start text-left" : "justify-end text-right"}`}>
                          <span>{lang === "en" ? "Browse Info" : "تصفح البيانات"}</span>
                          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {/* Social Hub Panel Portlet - NOW BEKO */}
                {config.buttons.social.visible && (
                  <button
                    onClick={() => setActiveClientModal("social")}
                    className="group relative w-full h-[175px] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer border border-gray-100"
                  >
                    {config.buttons.social.imageUrl ? (
                      <img 
                        src={config.buttons.social.imageUrl} 
                        alt="Beko" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-right bg-white">
                        <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm shadow-red-500/10">
                          <span className="text-xl">❄️</span>
                        </div>
                        <div className="w-full">
                          <h5 className={`font-bold text-slate-950 text-base ${lang === "en" ? "text-left font-display" : "text-right font-Cairo"}`}>
                            {lang === "en" ? "Beko" : "بيكو"}
                          </h5>
                          <span className={`block text-[11px] text-slate-400 font-medium mt-0.5 mb-2 ${lang === "en" ? "text-left font-sans" : "text-right font-Cairo"}`}>
                            {lang === "en" ? "Phone • Location • Social handles" : "الرقم • الموقع • وسائل التواصل"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold text-[#172995] flex items-center gap-1.5 mt-auto uppercase tracking-wider ${lang === "en" ? "justify-start text-left" : "justify-end text-right"}`}>
                          <span>{lang === "en" ? "Browse Info" : "تصفح البيانات"}</span>
                          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {/* Midea Panel Portlet - NEW */}
                {(config.buttons.midea?.visible ?? true) && (
                  <button
                    onClick={() => setActiveClientModal("midea")}
                    className="group relative w-full h-[175px] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer border border-gray-100"
                  >
                    {config.buttons.midea?.imageUrl ? (
                      <img 
                        src={config.buttons.midea.imageUrl} 
                        alt="Midea" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-right bg-white">
                        <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm shadow-teal-500/10">
                          <span className="text-xl">🌬️</span>
                        </div>
                        <div className="w-full">
                          <h5 className={`font-bold text-slate-950 text-base ${lang === "en" ? "text-left font-display" : "text-right font-Cairo"}`}>
                            {lang === "en" ? (config.buttons.midea?.labelEn || "San George") : (config.buttons.midea?.labelAr || "سان جورج")}
                          </h5>
                          <span className={`block text-[11px] text-slate-400 font-medium mt-0.5 mb-2 ${lang === "en" ? "text-left font-sans" : "text-right font-Cairo"}`}>
                            {lang === "en" ? "Phone • Location • Social handles" : "الرقم • الموقع • وسائل التواصل"}
                          </span>
                        </div>
                        <span className={`text-xs font-bold text-[#172995] flex items-center gap-1.5 mt-auto uppercase tracking-wider ${lang === "en" ? "justify-start text-left" : "justify-end text-right"}`}>
                          <span>{lang === "en" ? "Browse Info" : "تصفح البيانات"}</span>
                          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Media Slot Right Column */}
          <div className="lg:col-span-12 lg:col-start-8 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Sleek rotated background card */}
              <div className="absolute -inset-4 bg-[#172995]/5 rounded-3xl -rotate-2"></div>
              
              <div className="relative aspect-[4/3.3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img 
                  src={config.aboutMediaUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200"} 
                  alt="Suez showroom representing San George Co."
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Arabic & English overlay tags */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 text-white flex flex-col justify-end" dir="ltr">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-white/70">
                    {lang === "en" ? "Suez Home Appliances & Showrooms" : "معارض الأجهزة الكهربائية المعتمدة بالسويس"}
                  </span>
                  <span className="text-sm font-Cairo font-semibold text-slate-100 mt-1" dir="rtl">
                    {lang === "en" ? "San George Co. for Home Appliances & Agencies" : "شركة سان جورج لتجارة الأجهزة الكهربائية والتوكيلات في السويس"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 3.5 SPECIAL DEALS & OFFERS BOARD */}
        {config.offers && config.offers.length > 0 && (
          <section id="offers-deals-section" className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-5">
              <div className={lang === "ar" ? "text-right w-full md:w-auto" : "text-left w-full md:w-auto"}>
                <div className={`flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1.5 ${lang === "ar" ? "justify-start flex-row-reverse" : "justify-start"}`}>
                  <Gift className="w-4 h-4 animate-bounce" />
                  <span>{lang === "en" ? "Exclusive Active Campaigns" : "العروض والخصومات الحصرية المتاحة الآن"}</span>
                </div>
                <h3 className={`text-2xl md:text-3xl text-slate-900 ${lang === "ar" ? "font-Cairo font-black" : "font-display font-black"}`}>
                  {lang === "en" ? "Deals & Limited-Time Offers" : "أقوى الصفقات والتنزيلات الحالية"}
                </h3>
              </div>
              <p className={`text-xs text-neutral-400 max-w-sm ${lang === "ar" ? "text-right font-Cairo" : "text-left font-sans"}`}>
                {lang === "en" 
                  ? "All displayed appliances and home hardware items are subject to dynamic stock availability. Secure your Suez reservation instantly!"
                  : "جميع العروض والخصومات تسري لفترات محدودة وتبعاً لتوفر مخزون الأجهزة المعروضة. تواصل لحجز فوري!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.offers.map((offer) => {
                const callNumber = offer.phone || config.contactPhone;
                const whatsappNumber = offer.whatsapp || config.contactWhatsapp;

                return (
                  <div 
                    key={offer.id} 
                    className="group bg-white border border-gray-100 hover:border-emerald-600/20 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div className="relative">
                      {/* Badge representation overlay */}
                      {(offer.badgeAr || offer.badgeEn) && (
                        <div className={`absolute top-4 ${lang === "ar" ? "right-4" : "left-4"} z-10 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1`}>
                          <Percent className="w-3 h-3" />
                          <span className={lang === "ar" ? "font-Cairo font-extrabold" : "font-sans font-bold"}>
                            {lang === "ar" ? offer.badgeAr : offer.badgeEn}
                          </span>
                        </div>
                      )}
                      
                      {offer.imageUrl ? (
                        <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden relative">
                          <img 
                            src={offer.imageUrl} 
                            alt={lang === "en" ? offer.titleEn : offer.titleAr} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="aspect-[16/10] w-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center relative">
                          <Gift className="w-12 h-12 text-emerald-600/35" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-2 mb-6">
                        <h4 className={`text-base font-bold text-slate-900 group-hover:text-emerald-700 transition ${lang === "ar" ? "font-Cairo text-right" : "font-display text-left"}`}>
                          {lang === "en" ? offer.titleEn : offer.titleAr}
                        </h4>
                        <p className={`text-xs text-slate-500 leading-relaxed ${lang === "ar" ? "font-Cairo text-right" : "font-sans text-left"}`}>
                          {lang === "en" ? offer.descriptionEn : offer.descriptionAr}
                        </p>
                      </div>

                      {/* Direct Call & Whatsapp actionable triggers */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100" dir={lang === "ar" ? "rtl" : "ltr"}>
                        {callNumber && (
                          <a
                            href={`tel:${callNumber.replace(/\s+/g, "")}`}
                            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition duration-200 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span className={lang === "ar" ? "font-Cairo" : ""}>
                              {lang === "en" ? "Call Now" : "اتصال هاتفى"}
                            </span>
                          </a>
                        )}

                        {whatsappNumber && (
                          <a
                            href={`https://wa.me/${getCleanWhatsappNumber(whatsappNumber)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition duration-200 cursor-pointer shadow-sm shadow-emerald-500/15"
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span className={lang === "ar" ? "font-Cairo" : ""}>
                              {lang === "en" ? "WhatsApp" : "مراسلة واتساب"}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3.6 CLIENT TESTIMONIALS CAROUSEL SECTION */}
        {config.testimonials && config.testimonials.length > 0 && (
          <section id="testimonials-carousel-section" className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-24 border-t border-b border-slate-100 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 md:px-6 relative">
              
              {/* Section Header */}
              <div className="text-center max-w-xl mx-auto mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "Trust & Partnerships" : "شركاء النجاح والثقة"}</span>
                </div>
                <h3 className={`text-2xl md:text-3xl text-slate-900 leading-tight mb-4 ${lang === "ar" ? "font-Cairo font-black" : "font-display font-black"}`}>
                  {lang === "en" ? "What Our Clients Say About Us" : "ماذا يقول عملاؤنا في السويس؟"}
                </h3>
                <p className={`text-xs text-slate-500 leading-relaxed ${lang === "ar" ? "font-Cairo" : ""}`}>
                  {lang === "en" 
                    ? "Read genuine feedback on domestic supplies, corporate partnerships, and distribution support in the Canal zone."
                    : "آراء واقعية حقيقية لعملائنا في قطاع التوريدات وتجارة الأجهزة والتوكيلات الرسمية المعتمدة."}
                </p>
              </div>

              {/* Slider Wrapper */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestiIndex}
                    initial={{ opacity: 0, x: lang === "ar" ? -25 : 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: lang === "ar" ? 25 : -25 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-md hover:shadow-lg transition-shadow relative"
                  >
                    {/* Big Quote Accent decoration */}
                    <div className={`absolute top-6 ${lang === "ar" ? "left-6" : "right-6"} text-indigo-500/10`}>
                      <Quote className="w-16 h-16 transform scale-x-[-1]" />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                      
                      {/* Rating Stars */}
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: config.testimonials[currentTestiIndex]?.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-4.5 h-4.5 fill-current" />
                        ))}
                      </div>

                      {/* Decisive feedback statement */}
                      <blockquote className={`text-sm md:text-base text-slate-700 leading-relaxed max-w-2xl font-medium italic ${lang === "ar" ? "font-Cairo" : ""}`}>
                        "{lang === "en" ? config.testimonials[currentTestiIndex]?.feedbackEn : config.testimonials[currentTestiIndex]?.feedbackAr}"
                      </blockquote>

                      {/* Author Details Card */}
                      <div className="flex flex-col items-center">
                        {config.testimonials[currentTestiIndex]?.imageUrl ? (
                          <img
                            src={config.testimonials[currentTestiIndex]?.imageUrl}
                            alt={lang === "en" ? config.testimonials[currentTestiIndex]?.authorNameEn : config.testimonials[currentTestiIndex]?.authorNameAr}
                            className="w-14 h-14 rounded-full object-cover mb-3 border-2 border-indigo-500/20 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 border border-indigo-100">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                        <h4 className={`text-sm font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>
                          {lang === "en" ? config.testimonials[currentTestiIndex]?.authorNameEn : config.testimonials[currentTestiIndex]?.authorNameAr}
                        </h4>
                        <p className={`text-2xs text-indigo-600 font-semibold tracking-wide uppercase mt-0.5 ${lang === "ar" ? "font-Cairo" : ""}`}>
                          {lang === "en" ? config.testimonials[currentTestiIndex]?.authorTitleEn : config.testimonials[currentTestiIndex]?.authorTitleAr}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Pagination Controls Arrow Buttons */}
                <div className="flex items-center justify-between mt-8 relative" dir="ltr">
                  
                  {/* Left / Prev Arrow Button */}
                  <button
                    onClick={() => {
                      if (!config.testimonials || config.testimonials.length === 0) return;
                      setCurrentTestiIndex((prev) => (prev === 0 ? config.testimonials!.length - 1 : prev - 1));
                    }}
                    className="w-10 h-10 bg-white border border-slate-100 text-slate-600 hover:text-indigo-600 rounded-full flex items-center justify-center hover:shadow-md hover:border-indigo-100 transition shadow-xs cursor-pointer"
                    title="Previous Testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Dynamic Indicators / Pagination Dots */}
                  <div className="flex gap-1.5">
                    {config.testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTestiIndex(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          currentTestiIndex === idx 
                            ? "w-6 h-1.5 bg-indigo-600" 
                            : "w-1.5 h-1.5 bg-slate-200 hover:bg-slate-350"
                        }`}
                        title={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Right / Next Arrow Button */}
                  <button
                    onClick={() => {
                      if (!config.testimonials || config.testimonials.length === 0) return;
                      setCurrentTestiIndex((prev) => (prev === config.testimonials!.length - 1 ? 0 : prev + 1));
                    }}
                    className="w-10 h-10 bg-white border border-slate-100 text-slate-600 hover:text-indigo-600 rounded-full flex items-center justify-center hover:shadow-md hover:border-indigo-100 transition shadow-xs cursor-pointer"
                    title="Next Testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                </div>

              </div>

            </div>
          </section>
        )}

        {/* 3. BRANDS BRAND Ticker */}
        <section className="relative">
          <BrandMarquee brands={config.brands} lang={lang} />
        </section>

      </main>

      {/* 4. FOOTER CREDITS */}
      <footer className="bg-neutral-50 border-t border-neutral-100 py-10 px-4 md:px-8 text-center shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-neutral-400 font-medium">
          <p className="tracking-tight">
            © 2026 {config.companyNameEn}. {lang === "en" ? "All Rights Reserved." : "جميع الحقوق محفوظة."}
          </p>
          <p className="font-Cairo font-semibold">
            {lang === "en" 
              ? "San George Co. for Home Appliances and Agencies - Suez" 
              : "شركة سان جورج لتجارة الأجهزة الكهربائية والتوكيلات في السويس"}
          </p>
        </div>
      </footer>

      {/* --- OVERLAY POPUPS MODALS BLOCK --- */}
      
      {/* 2. Samsung Master Modal */}
      <SimpleModal
        isOpen={activeClientModal === "branches"}
        onClose={() => setActiveClientModal(null)}
        titleEn="Samsung Authorized Portal"
        titleAr="بيانات ومعلومات توكيل سامسونج"
        lang={lang}
      >
        <SamsungUnifiedContent config={config} lang={lang} />
      </SimpleModal>

      {/* 3. Beko Master Modal */}
      <SimpleModal
        isOpen={activeClientModal === "social"}
        onClose={() => setActiveClientModal(null)}
        titleEn="Beko Authorized Portal"
        titleAr="بيانات ومعلومات توكيل بيكو"
        lang={lang}
      >
        <BekoUnifiedContent config={config} lang={lang} />
      </SimpleModal>

      {/* 4. Midea Master Modal */}
      <SimpleModal
        isOpen={activeClientModal === "midea"}
        onClose={() => setActiveClientModal(null)}
        titleEn="San George Authorized Portal"
        titleAr="بيانات ومعلومات توكيل سان جورج"
        lang={lang}
      >
        <MideaUnifiedContent config={config} lang={lang} />
      </SimpleModal>

      {/* 4. Admin Auth Gate Passcode popup */}
      <AdminPassModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminUnlocked}
        adminPassword={config.adminPassword}
      />

    </div>
  );
}
