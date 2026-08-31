import React, { useState } from "react";
import { X, MapPin, Phone, MessageSquare, Clock, Globe, Navigation, Search, Shield, ExternalLink, User } from "lucide-react";
import { CompanyConfig, getCleanWhatsappNumber, getEmbedMapUrl, getDirectNavigationMapUrl, Branch } from "../types";
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
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border border-neutral-100 transform scale-100 transition-all">
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-20">
          <div>
            {lang === "en" ? (
              <>
                <h3 className="font-display text-lg font-bold text-neutral-900 tracking-tight">{titleEn}</h3>
                <p className="font-Cairo text-xs font-semibold text-neutral-400 mt-0.5">{titleAr}</p>
              </>
            ) : (
              <>
                <h3 className="font-Cairo text-lg font-bold text-neutral-900">{titleAr}</h3>
                <p className="font-sans text-xs font-semibold text-neutral-400 mt-0.5">{titleEn}</p>
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

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface InteractiveMapProps {
  url: string;
  fallbackQuery: string;
  title?: string;
  lang?: "en" | "ar";
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ url, fallbackQuery, title = "Location Map", lang = "ar" }) => {
  const embedSrc = getEmbedMapUrl(url, fallbackQuery);

  return (
    <div className="w-full h-full relative group">
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

const TabNav = ({ tabs, activeTab, onChange, lang }: { tabs: {id:string, labelEn:string, labelAr:string, icon:any}[], activeTab: string, onChange: (id:string)=>void, lang: "en"|"ar" }) => (
  <div className="flex p-2 bg-slate-50/50 border-b border-gray-100 overflow-x-auto hide-scrollbar">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
          activeTab === tab.id 
            ? "bg-teal-600 text-white shadow-sm" 
            : "text-slate-600 hover:bg-slate-100"
        } ${lang === "ar" ? "font-Cairo" : "font-sans"}`}
      >
        <tab.icon className="w-4 h-4" />
        <span>{lang === "en" ? tab.labelEn : tab.labelAr}</span>
      </button>
    ))}
  </div>
);


export const ContactsContent = () => null;
export const BranchesContent = () => null;
export const SocialsContent = () => null;


// -------------------------------------------------------------
// 1. SAMSUNG UNIFIED CONTENT
// -------------------------------------------------------------
export const SamsungUnifiedContent = ({ config, lang = "ar" }: { config: CompanyConfig, lang?: "en"|"ar" }) => {
  const [activeTab, setActiveTab] = useState("contact");
  
  const tabs = [
    { id: "contact", labelEn: "Contact & Connect", labelAr: "الرقم والتواصل", icon: Phone },
    { id: "locations", labelEn: "Branches & Locations", labelAr: "الموقع والمعرض", icon: MapPin },
    { id: "social", labelEn: "Social Media", labelAr: "السوشيال ميديا", icon: Globe }
  ];

  const phone = config.samsungPhone || config.contactPhone;
  const whatsapp = config.samsungWhatsapp || config.contactWhatsapp;
  // 🔥 سحب المواعيد الخاصة بسامسونج فقط 🔥
  const workingHoursEn = config.samsungWorkingHoursEn || config.samsungBranches?.[0]?.timingEn || config.workingHoursEn;
  const workingHoursAr = config.samsungWorkingHoursAr || config.samsungBranches?.[0]?.timingAr || config.workingHoursAr;

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} lang={lang} />
      
      <div className="p-6 overflow-y-auto">
        {activeTab === "contact" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] text-slate-500 font-semibold uppercase tracking-wider ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Samsung Sales Hotline" : "مبيعات سامسونج السويس"}
                    </p>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-0.5" dir="ltr">{phone}</p>
                  </div>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition group">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] text-emerald-600/80 font-semibold uppercase tracking-wider ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Samsung WhatsApp" : "واتساب مبيعات سامسونج"}
                    </p>
                    <p className={`text-base font-bold text-emerald-700 mt-0.5 ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Message Samsung Sales" : "مراسلة مبيعات سامسونج"}
                    </p>
                  </div>
                </a>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs font-bold text-slate-700 ${lang === "ar" ? "font-Cairo" : ""}`}>
                  {lang === "en" ? "Official Working Hours" : "مواعيد عمل معارض سامسونج الرسمية"}
                </p>
                <p className={`text-sm text-slate-600 mt-1 ${lang === "ar" ? "font-Cairo font-semibold" : ""}`}>
                  {lang === "en" ? workingHoursEn : workingHoursAr}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "locations" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {(config.samsungBranches && config.samsungBranches.length > 0) ? (
                config.samsungBranches.map((branch, idx) => (
                  <div key={branch.id || idx} className="p-4 rounded-2xl border border-gray-100 bg-slate-50 relative group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1"><MapPin className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <h4 className={`font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>{lang === "en" ? branch.nameEn : branch.nameAr}</h4>
                        <p className={`text-sm text-slate-600 mt-1 leading-relaxed ${lang === "ar" ? "font-Cairo" : ""}`}>{lang === "en" ? branch.addressEn : branch.addressAr}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-4 ml-8">
                       {branch.phone && (
                         <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-600 transition">
                           <Phone className="w-3.5 h-3.5" /> <span dir="ltr">{branch.phone}</span>
                         </a>
                       )}
                       {branch.mapUrl && (
                         <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">
                           <Navigation className="w-3.5 h-3.5" /> <span>{lang === "en" ? "Get Directions" : "الاتجاهات (خريطة)"}</span>
                         </a>
                       )}
                    </div>
                  </div>
                ))
             ) : (
                <div className="text-center p-8 text-slate-500">
                   {lang === "en" ? "Location details are being updated." : "جاري تحديث بيانات الفروع."}
                </div>
             )}
             
             {(!config.samsungBranches || config.samsungBranches.length === 0) && config.samsungMapUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
                  <iframe src={config.samsungMapUrl.includes("<iframe") ? config.samsungMapUrl.match(/src="([^"]+)"/)?.[1] : config.samsungMapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
             )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {config.samsungWebsiteUrl && (
              <a href={config.samsungWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-base font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Samsung Official Portal" : "موقع سامسونج الرسمي"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{config.samsungWebsiteUrl.replace("https://", "")}</p>
                </div>
              </a>
            )}
            
            {config.samsungFacebookUrl && (
              <a href={config.samsungFacebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                <div className="w-12 h-12 bg-[#1877F2]/10 text-[#1877F2] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <p className={`text-base font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Follow us on Facebook" : "تابعنا على فيسبوك"}
                  </p>
                  <p className={`text-xs text-slate-500 mt-0.5 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Latest updates and offers" : "أحدث العروض والأخبار"}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 2. BEKO UNIFIED CONTENT
// -------------------------------------------------------------
export const BekoUnifiedContent = ({ config, lang = "ar" }: { config: CompanyConfig, lang?: "en"|"ar" }) => {
  const [activeTab, setActiveTab] = useState("contact");
  
  const tabs = [
    { id: "contact", labelEn: "Contact & Connect", labelAr: "الرقم والتواصل", icon: Phone },
    { id: "locations", labelEn: "Branches & Locations", labelAr: "الموقع والمعرض", icon: MapPin },
    { id: "social", labelEn: "Social Media", labelAr: "السوشيال ميديا", icon: Globe }
  ];

  const phone = config.bekoPhone || config.contactPhone;
  const whatsapp = config.bekoWhatsapp || config.contactWhatsapp;
  // 🔥 سحب المواعيد الخاصة ببيكو فقط 🔥
  const workingHoursEn = config.bekoWorkingHoursEn || config.bekoBranches?.[0]?.timingEn || config.workingHoursEn;
  const workingHoursAr = config.bekoWorkingHoursAr || config.bekoBranches?.[0]?.timingAr || config.workingHoursAr;

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} lang={lang} />
      
      <div className="p-6 overflow-y-auto">
        {activeTab === "contact" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition group">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] text-slate-500 font-semibold uppercase tracking-wider ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Beko Sales Hotline" : "مبيعات بيكو السويس"}
                    </p>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-0.5" dir="ltr">{phone}</p>
                  </div>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition group">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] text-emerald-600/80 font-semibold uppercase tracking-wider ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Beko WhatsApp" : "واتساب مبيعات بيكو"}
                    </p>
                    <p className={`text-base font-bold text-emerald-700 mt-0.5 ${lang === "ar" ? "font-Cairo" : ""}`}>
                      {lang === "en" ? "Message Beko Sales" : "مراسلة مبيعات بيكو"}
                    </p>
                  </div>
                </a>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs font-bold text-slate-700 ${lang === "ar" ? "font-Cairo" : ""}`}>
                  {lang === "en" ? "Official Working Hours" : "مواعيد عمل معارض بيكو الرسمية"}
                </p>
                <p className={`text-sm font-Cairo font-semibold text-neutral-600 mt-1`}>
                  {lang === "en" ? workingHoursEn : workingHoursAr}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "locations" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {(config.bekoBranches && config.bekoBranches.length > 0) ? (
                config.bekoBranches.map((branch, idx) => (
                  <div key={branch.id || idx} className="p-4 rounded-2xl border border-gray-100 bg-slate-50 relative group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1"><MapPin className="w-5 h-5 text-red-600" /></div>
                      <div>
                        <h4 className={`font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>{lang === "en" ? branch.nameEn : branch.nameAr}</h4>
                        <p className={`text-sm text-slate-600 mt-1 leading-relaxed ${lang === "ar" ? "font-Cairo" : ""}`}>{lang === "en" ? branch.addressEn : branch.addressAr}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-4 ml-8">
                       {branch.phone && (
                         <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:text-red-600 transition">
                           <Phone className="w-3.5 h-3.5" /> <span dir="ltr">{branch.phone}</span>
                         </a>
                       )}
                       {branch.mapUrl && (
                         <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition">
                           <Navigation className="w-3.5 h-3.5" /> <span>{lang === "en" ? "Get Directions" : "الاتجاهات (خريطة)"}</span>
                         </a>
                       )}
                    </div>
                  </div>
                ))
             ) : (
                <div className="text-center p-8 text-slate-500">
                   {lang === "en" ? "Location details are being updated." : "جاري تحديث بيانات الفروع."}
                </div>
             )}
             
             {(!config.bekoBranches || config.bekoBranches.length === 0) && config.bekoMapUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
                  <iframe src={config.bekoMapUrl.includes("<iframe") ? config.bekoMapUrl.match(/src="([^"]+)"/)?.[1] : config.bekoMapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
             )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {config.bekoWebsiteUrl && (
              <a href={config.bekoWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition group">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-base font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Beko Official Portal" : "موقع بيكو الرسمي"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{config.bekoWebsiteUrl.replace("https://", "")}</p>
                </div>
              </a>
            )}
            
            {config.bekoFacebookUrl && (
              <a href={config.bekoFacebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group">
                <div className="w-12 h-12 bg-[#1877F2]/10 text-[#1877F2] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <p className={`text-base font-bold text-slate-900 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Follow us on Facebook" : "تابعنا على فيسبوك"}
                  </p>
                  <p className={`text-xs text-slate-500 mt-0.5 ${lang === "ar" ? "font-Cairo" : ""}`}>
                    {lang === "en" ? "Latest updates and offers" : "أحدث العروض والأخبار"}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// 3. SAN GEORGE / MIDEA UNIFIED MASTER CONTENT
// -------------------------------------------------------------
export const MideaUnifiedContent = ({ config, lang = "ar" }: { config: CompanyConfig, lang?: "en"|"ar" }) => {
  const [activeTab, setActiveTab] = useState<"phone" | "location" | "social">("phone");
  const branches = config.mideaBranches || config.branches || [];
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
    ? (config.mideaLocationAddressAr || activeBranch?.addressAr || "شارع بورسعيد، السويس، مصر")
    : (activeBranch?.addressAr || config.mideaLocationAddressAr || "شارع بورسعيد، السويس، مصر");
  const locAddressEn = isMainBranch
    ? (config.mideaLocationAddressEn || activeBranch?.addressEn || "Port Said Street, Suez, Egypt")
    : (activeBranch?.addressEn || config.mideaLocationAddressEn || "Port Said Street, Suez, Egypt");
  const mapUrl = isMainBranch
    ? (config.mideaMapUrl || activeBranch?.mapUrl || "https://maps.google.com/maps?q=Suez&output=embed")
    : (activeBranch?.mapUrl || config.mideaMapUrl || "https://maps.google.com/maps?q=Suez&output=embed");
  
  const facebook = config.mideaFacebookUrl || config.facebookUrl;
  const instagram = config.mideaInstagramUrl || config.instagramUrl;

  // 🔥 سحب المواعيد الخاصة بسان جورج فقط 🔥
  const workingHoursEn = config.mideaWorkingHoursEn || config.mideaBranches?.[0]?.timingEn || config.workingHoursEn;
  const workingHoursAr = config.mideaWorkingHoursAr || config.mideaBranches?.[0]?.timingAr || config.workingHoursAr;

  return (
    <div className="space-y-6 font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/50 mx-6 mt-6">
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "phone" ? "bg-[#172995] text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800"
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
            activeTab === "location" ? "bg-[#172995] text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800"
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
            activeTab === "social" ? "bg-[#172995] text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className={lang === "ar" ? "font-Cairo" : ""}>
            {lang === "en" ? "Social Handles" : "السوشيال ميديا"}
          </span>
        </button>
      </div>

      <div className="px-6 pb-6">
        {activeTab === "phone" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-3.5 p-4.5 bg-neutral-50 hover:bg-brand-blue/5 hover:border-[#172995]/30 border border-neutral-200/60 rounded-xl transition shadow-3xs">
                  <div className="p-3 bg-[#172995]/10 text-[#172995] rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "Call San George" : "مكتب اتصالات سان جورج"}
                    </span>
                    <span className="block font-bold text-neutral-800 text-base font-mono">{phone}</span>
                  </div>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${getCleanWhatsappNumber(whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-4.5 bg-green-50/50 hover:bg-green-50 hover:border-green-300 border border-neutral-200/60 rounded-xl transition shadow-3xs">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className={lang === "en" ? "text-left" : "text-right"}>
                    <span className="block text-[10px] text-green-700 font-extrabold uppercase tracking-wider">
                      {lang === "en" ? "San George WhatsApp" : "واتساب مبيعات سان جورج"}
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
                  <h4 className="text-[10px] font-extrabold text-[#172995] uppercase tracking-wider">
                    {lang === "en" ? "Working Hours" : "مواعيد عمل معارض سان جورج الرسمية"}
                  </h4>
                  <div className="text-neutral-700 space-y-1 mt-1 font-Cairo font-semibold text-neutral-600">
                    <p className="text-sm">
                      {lang === "en" ? workingHoursEn : workingHoursAr}
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
                      activeBranchId === b.id ? "bg-[#172995] text-white shadow-xs" : "text-neutral-500 hover:bg-white"
                    }`}
                  >
                    <span className="font-Cairo">{lang === "en" ? b.nameEn : b.nameAr}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 bg-neutral-50 border border-neutral-200/60 rounded-xl">
              <h4 className="font-bold text-base text-neutral-900 font-Cairo">{lang === "en" ? locNameEn : locNameAr}</h4>
              <p className="text-xs text-neutral-500 mt-1 font-Cairo">{lang === "en" ? locAddressEn : locAddressAr}</p>
              {activeBranch?.phone && (
                <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-neutral-400 font-Cairo font-semibold">{lang === "en" ? "Phone:" : "هاتف الفرع:"}</span>
                  <a href={`tel:${activeBranch.phone.replace(/\s+/g,"")}`} className="text-[#172995] font-bold hover:underline">{activeBranch.phone}</a>
                </div>
              )}
            </div>
            
            {mapUrl && (
              <div className="space-y-3">
                <div className="pb-1">
                  <a href={getDirectNavigationMapUrl(mapUrl, `${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`)} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md">
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-100" />
                    <span className="font-Cairo">{lang === "en" ? "Navigate on Google Maps" : "الاتجاهات عبر خرائط Google 🗺️"}</span>
                  </a>
                </div>
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative">
                  <InteractiveMap url={mapUrl} fallbackQuery={`${locNameAr || locNameEn}, ${locAddressAr || locAddressEn}`} title="San George Showroom Suez Map" lang={lang} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-500 font-Cairo leading-relaxed">
              {lang === "en" ? "Connect with San George's official channels for our general catalog, wholesale trading support, and recent announcements." : "تواصل مع الحسابات الرسمية لشركة سان جورج التجارية لمعرفة جديد العروض والمبيعات والتوريدات بالسويس."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-Cairo">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-blue-50/40 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition">
                  <span className="text-xs font-bold text-blue-700">Facebook Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-pink-50/40 hover:bg-pink-50 border border-pink-200/50 rounded-xl transition">
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


export const SanGeorgeUnifiedContent = MideaUnifiedContent; // Linking for backward compatibility

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
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.14 3.01-1.3 4.02v3.31h2.1c1.23-1.13 2.15-2.79 2.34-4.8 1.05-.1 2-.6 2-4.38z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.23-2.51c-.9.6-2.05.96-3.41.96-2.61 0-4.82-1.76-5.61-4.13H1.81v2.58C3.79 21.9 7.64 24 12 24z" />
              <path fill="#FBBC05" d="M6.39 15.41c-.2-.6-.31-1.25-.31-1.91s.11-1.31.31-1.91V9.01H1.81C1.16 10.31.8 11.75.8 13.25s.36 2.94 1.01 4.24l4.58-2.08z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.64 0 3.79 2.1 1.81 6.01l4.58 2.08c.79-2.37 3-4.13 5.61-4.13z" />
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
