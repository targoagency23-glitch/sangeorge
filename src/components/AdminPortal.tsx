import React, { useState } from "react";
import { CompanyConfig, Branch, BrandItem, SpecialOffer, Testimonial, getCleanWhatsappNumber } from "../types";
import { Globe, Save, RefreshCw, Plus, Trash2, ArrowLeft, Download, Eye, FileText, FolderOpen } from "lucide-react";
import { MediaManager, MediaPickerField, compressBase64 } from "./MediaLibrary";

interface AdminPortalProps {
  config: CompanyConfig;
  lang: "en" | "ar";
  onSave: (newConfig: CompanyConfig) => Promise<void>;
  onReset: () => void;
  onExit: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ config, lang, onSave, onReset, onExit }) => {
  const [localConfig, setLocalConfig] = useState<CompanyConfig>({ ...config });
  const [isGlobalMediaManagerOpen, setIsGlobalMediaManagerOpen] = useState(false);
  const [newBranch, setNewBranch] = useState<Omit<Branch, "id">>({
    nameEn: "",
    nameAr: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    mapUrl: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => {
      const updated = { ...prev, [name]: value };
      
      if (name === "contactMapUrl" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, mapUrl: value } : b);
      }
      if (name === "samsungMapUrl" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, mapUrl: value } : b);
      }
      if (name === "bekoMapUrl" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, mapUrl: value } : b);
      }
      if (name === "mideaMapUrl" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, mapUrl: value } : b);
      }

      if (name === "contactPhone" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, phone: value } : b);
      }
      if (name === "samsungPhone" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, phone: value } : b);
      }
      if (name === "bekoPhone" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, phone: value } : b);
      }
      if (name === "mideaPhone" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, phone: value } : b);
      }

      if (name === "contactLocationAddressAr" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, addressAr: value } : b);
      }
      if (name === "samsungLocationAddressAr" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, addressAr: value } : b);
      }
      if (name === "bekoLocationAddressAr" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, addressAr: value } : b);
      }
      if (name === "mideaLocationAddressAr" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, addressAr: value } : b);
      }

      if (name === "contactLocationAddressEn" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, addressEn: value } : b);
      }
      if (name === "samsungLocationAddressEn" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, addressEn: value } : b);
      }
      if (name === "bekoLocationAddressEn" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, addressEn: value } : b);
      }
      if (name === "mideaLocationAddressEn" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, addressEn: value } : b);
      }

      if (name === "contactLocationNameAr" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, nameAr: value } : b);
      }
      if (name === "samsungLocationNameAr" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, nameAr: value } : b);
      }
      if (name === "bekoLocationNameAr" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, nameAr: value } : b);
      }
      if (name === "mideaLocationNameAr" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, nameAr: value } : b);
      }

      if (name === "contactLocationNameEn" && updated.branches && updated.branches.length > 0) {
        updated.branches = updated.branches.map((b, idx) => (b.id === "branch-1" || idx === 0) ? { ...b, nameEn: value } : b);
      }
      if (name === "samsungLocationNameEn" && updated.samsungBranches && updated.samsungBranches.length > 0) {
        updated.samsungBranches = updated.samsungBranches.map((b, idx) => (b.id === "samsung-b-1" || idx === 0) ? { ...b, nameEn: value } : b);
      }
      if (name === "bekoLocationNameEn" && updated.bekoBranches && updated.bekoBranches.length > 0) {
        updated.bekoBranches = updated.bekoBranches.map((b, idx) => (b.id === "beko-b-1" || idx === 0) ? { ...b, nameEn: value } : b);
      }
      if (name === "mideaLocationNameEn" && updated.mideaBranches && updated.mideaBranches.length > 0) {
        updated.mideaBranches = updated.mideaBranches.map((b, idx) => (b.id === "midea-b-1" || idx === 0) ? { ...b, nameEn: value } : b);
      }

      return updated;
    });
  };

  const handleButtonToggle = (btnKey: "contacts" | "branches" | "social" | "midea") => {
    setLocalConfig((prev) => {
      const btn = prev.buttons[btnKey] || (btnKey === "midea" ? { labelEn: "San George", labelAr: "سان جورج", visible: true } : { labelEn: "Midea", labelAr: "ميديا", visible: true });
      return {
        ...prev,
        buttons: {
          ...prev.buttons,
          [btnKey]: {
            ...btn,
            visible: !btn.visible
          }
        }
      };
    });
  };

  const handleButtonLabelChange = (btnKey: "contacts" | "branches" | "social" | "midea", lang: "En" | "Ar", val: string) => {
    setLocalConfig((prev) => {
      const button = prev.buttons[btnKey] || (btnKey === "midea" ? { labelEn: "San George", labelAr: "سان جورج", visible: true } : { labelEn: "Midea", labelAr: "ميديا", visible: true });
      return {
        ...prev,
        buttons: {
          ...prev.buttons,
          [btnKey]: {
            ...button,
            [lang === "En" ? "labelEn" : "labelAr"]: val
          }
        }
      };
    });
  };

  const handleButtonImageChange = (btnKey: "contacts" | "branches" | "social" | "midea", val: string) => {
    setLocalConfig((prev) => {
      const button = prev.buttons[btnKey] || (btnKey === "midea" ? { labelEn: "San George", labelAr: "سان جورج", visible: true } : { labelEn: "Midea", labelAr: "ميديا", visible: true });
      return {
        ...prev,
        buttons: {
          ...prev.buttons,
          [btnKey]: {
            ...button,
            imageUrl: val
          }
        }
      };
    });
  };

  const handleAddNewBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.nameEn || !newBranch.nameAr) {
      alert("Please enter both English and Arabic branch names.");
      return;
    }
    const branchWithId: Branch = {
      ...newBranch,
      id: `branch-${Date.now()}`
    };
    setLocalConfig((prev) => ({
      ...prev,
      branches: [...(prev.branches || []), branchWithId]
    }));
    setNewBranch({
      nameEn: "",
      nameAr: "",
      addressEn: "",
      addressAr: "",
      phone: "",
      mapUrl: ""
    });
  };

  const handleDeleteBranch = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      branches: prev.branches.filter((b) => b.id !== id)
    }));
  };

  const handleUpdateBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = prev.branches.map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, branches: updatedBranches };
      
      const isFirst = prev.branches && prev.branches[0]?.id === id;
      if (id === "branch-1" || isFirst) {
        if (field === "mapUrl") updated.contactMapUrl = val;
        if (field === "phone") updated.contactPhone = val;
        if (field === "addressAr") updated.contactLocationAddressAr = val;
        if (field === "addressEn") updated.contactLocationAddressEn = val;
        if (field === "nameAr") updated.contactLocationNameAr = val;
        if (field === "nameEn") updated.contactLocationNameEn = val;
      }
      return updated;
    });
  };

  const [newSamsungBranch, setNewSamsungBranch] = useState<Omit<Branch, "id">>({
    nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: ""
  });

  const handleAddNewSamsungBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSamsungBranch.nameEn || !newSamsungBranch.nameAr) return;
    const branchWithId: Branch = { ...newSamsungBranch, id: `samsung-branch-${Date.now()}` };
    setLocalConfig((prev) => ({ ...prev, samsungBranches: [...(prev.samsungBranches || []), branchWithId] }));
    setNewSamsungBranch({ nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: "" });
  };

  const handleDeleteSamsungBranch = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, samsungBranches: (prev.samsungBranches || []).filter((b) => b.id !== id) }));
  };

  const handleUpdateSamsungBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.samsungBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, samsungBranches: updatedBranches };
      const isFirst = prev.samsungBranches && prev.samsungBranches[0]?.id === id;
      if (id === "samsung-b-1" || isFirst) {
        if (field === "mapUrl") updated.samsungMapUrl = val;
        if (field === "phone") updated.samsungPhone = val;
        if (field === "addressAr") updated.samsungLocationAddressAr = val;
        if (field === "addressEn") updated.samsungLocationAddressEn = val;
        if (field === "nameAr") updated.samsungLocationNameAr = val;
        if (field === "nameEn") updated.samsungLocationNameEn = val;
      }
      return updated;
    });
  };

  const [newBekoBranch, setNewBekoBranch] = useState<Omit<Branch, "id">>({
    nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: ""
  });

  const handleAddNewBekoBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBekoBranch.nameEn || !newBekoBranch.nameAr) return;
    const branchWithId: Branch = { ...newBekoBranch, id: `beko-branch-${Date.now()}` };
    setLocalConfig((prev) => ({ ...prev, bekoBranches: [...(prev.bekoBranches || []), branchWithId] }));
    setNewBekoBranch({ nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: "" });
  };

  const handleDeleteBekoBranch = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, bekoBranches: (prev.bekoBranches || []).filter((b) => b.id !== id) }));
  };

  const handleUpdateBekoBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.bekoBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, bekoBranches: updatedBranches };
      const isFirst = prev.bekoBranches && prev.bekoBranches[0]?.id === id;
      if (id === "beko-b-1" || isFirst) {
        if (field === "mapUrl") updated.bekoMapUrl = val;
        if (field === "phone") updated.bekoPhone = val;
        if (field === "addressAr") updated.bekoLocationAddressAr = val;
        if (field === "addressEn") updated.bekoLocationAddressEn = val;
        if (field === "nameAr") updated.bekoLocationNameAr = val;
        if (field === "nameEn") updated.bekoLocationNameEn = val;
      }
      return updated;
    });
  };

  const [newMideaBranch, setNewMideaBranch] = useState<Omit<Branch, "id">>({
    nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: ""
  });

  const handleAddNewMideaBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMideaBranch.nameEn || !newMideaBranch.nameAr) return;
    const branchWithId: Branch = { ...newMideaBranch, id: `midea-branch-${Date.now()}` };
    setLocalConfig((prev) => ({ ...prev, mideaBranches: [...(prev.mideaBranches || []), branchWithId] }));
    setNewMideaBranch({ nameEn: "", nameAr: "", addressEn: "", addressAr: "", phone: "", mapUrl: "" });
  };

  const handleDeleteMideaBranch = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, mideaBranches: (prev.mideaBranches || []).filter((b) => b.id !== id) }));
  };

  const handleUpdateMideaBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.mideaBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, mideaBranches: updatedBranches };
      const isFirst = prev.mideaBranches && prev.mideaBranches[0]?.id === id;
      if (id === "midea-b-1" || isFirst) {
        if (field === "mapUrl") updated.mideaMapUrl = val;
        if (field === "phone") updated.mideaPhone = val;
        if (field === "addressAr") updated.mideaLocationAddressAr = val;
        if (field === "addressEn") updated.mideaLocationAddressEn = val;
        if (field === "nameAr") updated.mideaLocationNameAr = val;
        if (field === "nameEn") updated.mideaLocationNameEn = val;
      }
      return updated;
    });
  };

  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState("");

  const handleAddBrand = () => {
    if (!newBrandName.trim()) return;
    const brandWithId: BrandItem = {
      id: `brand-${Date.now()}`,
      name: newBrandName.trim(),
      logoUrl: newBrandLogoUrl.trim()
    };
    setLocalConfig((prev) => ({ ...prev, brands: [...prev.brands, brandWithId] }));
    setNewBrandName(""); setNewBrandLogoUrl("");
  };

  const handleRemoveBrand = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, brands: prev.brands.filter(b => b.id !== id) }));
  };

  const [newOfferTitleAr, setNewOfferTitleAr] = useState("");
  const [newOfferTitleEn, setNewOfferTitleEn] = useState("");
  const [newOfferDescAr, setNewOfferDescAr] = useState("");
  const [newOfferDescEn, setNewOfferDescEn] = useState("");
  const [newOfferBadgeAr, setNewOfferBadgeAr] = useState("");
  const [newOfferBadgeEn, setNewOfferBadgeEn] = useState("");
  const [newOfferImageUrl, setNewOfferImageUrl] = useState("");
  const [newOfferPhone, setNewOfferPhone] = useState("");
  const [newOfferWhatsapp, setNewOfferWhatsapp] = useState("");

  const handleAddOffer = () => {
    if (!newOfferTitleAr.trim()) { alert("الرجاء إدخال عنوان العرض باللغة العربية على الأقل."); return; }
    const offerWithId: SpecialOffer = {
      id: `offer-${Date.now()}`,
      titleAr: newOfferTitleAr.trim(),
      titleEn: newOfferTitleEn.trim() || newOfferTitleAr.trim(),
      descriptionAr: newOfferDescAr.trim(),
      descriptionEn: newOfferDescEn.trim() || newOfferDescAr.trim(),
      ...(newOfferBadgeAr.trim() ? { badgeAr: newOfferBadgeAr.trim() } : {}),
      ...(newOfferBadgeEn.trim() ? { badgeEn: newOfferBadgeEn.trim() } : {}),
      ...(newOfferImageUrl.trim() ? { imageUrl: newOfferImageUrl.trim() } : {}),
      ...(newOfferPhone.trim() ? { phone: newOfferPhone.trim() } : {}),
      ...(newOfferWhatsapp.trim() ? { whatsapp: newOfferWhatsapp.trim() } : {}),
    };
    setLocalConfig((prev) => ({ ...prev, offers: [...(prev.offers || []), offerWithId] }));
    setNewOfferTitleAr(""); setNewOfferTitleEn(""); setNewOfferDescAr(""); setNewOfferDescEn("");
    setNewOfferBadgeAr(""); setNewOfferBadgeEn(""); setNewOfferImageUrl(""); setNewOfferPhone(""); setNewOfferWhatsapp("");
  };

  const handleRemoveOffer = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, offers: (prev.offers || []).filter(o => o.id !== id) }));
  };

  const [newTestiNameEn, setNewTestiNameEn] = useState("");
  const [newTestiNameAr, setNewTestiNameAr] = useState("");
  const [newTestiTitleEn, setNewTestiTitleEn] = useState("");
  const [newTestiTitleAr, setNewTestiTitleAr] = useState("");
  const [newTestiFeedbackEn, setNewTestiFeedbackEn] = useState("");
  const [newTestiFeedbackAr, setNewTestiFeedbackAr] = useState("");
  const [newTestiRating, setNewTestiRating] = useState<number>(5);
  const [newTestiImageUrl, setNewTestiImageUrl] = useState("");

  const handleAddTestimonial = () => {
    if (!newTestiNameAr.trim() && !newTestiNameEn.trim()) return;
    const testiWithId: Testimonial = {
      id: `testi-${Date.now()}`,
      authorNameEn: newTestiNameEn.trim() || newTestiNameAr.trim(),
      authorNameAr: newTestiNameAr.trim() || newTestiNameEn.trim(),
      authorTitleEn: newTestiTitleEn.trim(),
      authorTitleAr: newTestiTitleAr.trim(),
      feedbackEn: newTestiFeedbackEn.trim() || newTestiFeedbackAr.trim(),
      feedbackAr: newTestiFeedbackAr.trim() || newTestiFeedbackEn.trim(),
      rating: newTestiRating,
      ...(newTestiImageUrl.trim() ? { imageUrl: newTestiImageUrl.trim() } : {})
    };
    setLocalConfig((prev) => ({ ...prev, testimonials: [...(prev.testimonials || []), testiWithId] }));
    setNewTestiNameEn(""); setNewTestiNameAr(""); setNewTestiTitleEn(""); setNewTestiTitleAr("");
    setNewTestiFeedbackEn(""); setNewTestiFeedbackAr(""); setNewTestiRating(5); setNewTestiImageUrl("");
  };

  const handleRemoveTestimonial = (id: string) => {
    setLocalConfig((prev) => ({ ...prev, testimonials: (prev.testimonials || []).filter((t) => t.id !== id) }));
  };

  // 🔥 معالجة الصور الصارمة لـ Cloudinary 🔥
  const compressConfigImages = async (configData: CompanyConfig): Promise<CompanyConfig> => {
    const next = { ...configData };

    const handleImageUpload = async (imgUrl: string | undefined, width: number, height: number, pathPrefix: string) => {
      if (!imgUrl) return imgUrl;
      if (!imgUrl.startsWith("data:image")) return imgUrl;

      try {
        const compressedBase64 = await compressBase64(imgUrl, width, height, 0.75);
        const formData = new FormData();
        formData.append("file", compressedBase64);
        formData.append("upload_preset", "ml_default");

        const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dgvcqy3vt/image/upload", {
          method: "POST",
          body: formData
        });
        const imgData = await uploadRes.json();

        if (imgData.secure_url) {
          return imgData.secure_url;
        } else {
          console.error(`Cloudinary Error for ${pathPrefix}:`, imgData);
          alert(`⚠️ تم رفض صورة (${pathPrefix}) من سيرفر الصور.`);
          return "";
        }
      } catch (error) {
        console.error(`Network Error for ${pathPrefix}:`, error);
        alert(`⚠️ مشكلة في الاتصال أثناء رفع صورة (${pathPrefix}).`);
        return "";
      }
    };

    next.logoUrl = await handleImageUpload(next.logoUrl, 400, 320, 'Logo') || "";
    next.aboutMediaUrl = await handleImageUpload(next.aboutMediaUrl, 800, 600, 'AboutImage') || "";

    if (next.buttons) {
      next.buttons = { ...next.buttons };
      if (next.buttons.contacts && next.buttons.contacts.imageUrl) {
        next.buttons.contacts.imageUrl = await handleImageUpload(next.buttons.contacts.imageUrl, 350, 250, 'Button1') || "";
      }
      if (next.buttons.branches && next.buttons.branches.imageUrl) {
        next.buttons.branches.imageUrl = await handleImageUpload(next.buttons.branches.imageUrl, 350, 250, 'Button2') || "";
      }
      if (next.buttons.social && next.buttons.social.imageUrl) {
        next.buttons.social.imageUrl = await handleImageUpload(next.buttons.social.imageUrl, 350, 250, 'Button3') || "";
      }
      if (next.buttons.midea && next.buttons.midea.imageUrl) {
        next.buttons.midea.imageUrl = await handleImageUpload(next.buttons.midea.imageUrl, 350, 250, 'Button4') || "";
      }
    }

    if (next.brands && next.brands.length > 0) {
      next.brands = await Promise.all(next.brands.map(async (brand) => {
        if (brand.logoUrl) { return { ...brand, logoUrl: await handleImageUpload(brand.logoUrl, 200, 120, `Brand-${brand.name}`) || "" }; }
        return brand;
      }));
    }

    if (next.offers && next.offers.length > 0) {
      next.offers = await Promise.all(next.offers.map(async (offer) => {
        if (offer.imageUrl) { return { ...offer, imageUrl: await handleImageUpload(offer.imageUrl, 600, 450, `Offer-${offer.titleEn}`) || "" }; }
        return offer;
      }));
    }

    if (next.testimonials && next.testimonials.length > 0) {
      next.testimonials = await Promise.all(next.testimonials.map(async (testimonial) => {
        if (testimonial.imageUrl) { return { ...testimonial, imageUrl: await handleImageUpload(testimonial.imageUrl, 128, 128, `Testimonial-${testimonial.authorNameEn}`) || "" }; }
        return testimonial;
      }));
    }
    return next;
  };

  const handleFormSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    try {
      const optimizedConfig = await compressConfigImages(localConfig);
      await onSave(optimizedConfig);
      setLocalConfig(optimizedConfig);
      setSuccessMsg(lang === "ar" ? "تم حفظ الإعدادات بنجاح!" : "Saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Save error: ", err);
      setErrorMsg(lang === "ar" ? "فشل في حفظ البيانات. تأكد من اتصال الإنترنت." : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-800">
      <div className="bg-brand-blue text-white py-4 px-6 shadow-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-brand-blue font-bold flex items-center justify-center rounded-lg text-sm font-display">A</div>
          <div>
            <span className="text-3xs tracking-widest uppercase font-bold text-white/60 block">Suez Branch Control System</span>
            <span className="font-display font-bold text-sm tracking-tight">San George Co. Admin Console</span>
          </div>
        </div>
        <button onClick={onExit} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/25 rounded-md text-xs font-bold transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit To Site (الرجوع للموقع)</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:py-8 space-y-8">
        <div className="bg-[#172995]/5 rounded-xl p-5 border border-[#172995]/15 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-extrabold text-[#172995] font-display">San George Corporate Media Vault</h2>
            </div>
            <p className="text-xs text-[#172995]/80 mt-1">Centralized folder of processed image assets.</p>
          </div>
          <button onClick={() => setIsGlobalMediaManagerOpen(true)} type="button" className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-[#172995] text-white font-bold text-xs hover:bg-[#11207e] rounded-xl transition shrink-0 shadow-md cursor-pointer">
            <FolderOpen className="w-4 h-4" />
            <span>Open Central Media Library (إدارة مكتبة الصور)</span>
          </button>
        </div>

        <form onSubmit={handleFormSave} className="space-y-6">
          {/* Brand and Logo */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">1. Global Brand & Logo Settings (الهوية والاسم)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase">Company Name (English)</label>
                <input type="text" name="companyNameEn" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg focus:border-brand-blue" value={localConfig.companyNameEn} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">اسم الشركة (عربي)</label>
                <input type="text" name="companyNameAr" className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg focus:border-brand-blue" value={localConfig.companyNameAr} onChange={handleInputChange} dir="rtl" required />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-2xs font-bold text-neutral-400 uppercase">Tagline (English)</label>
                <input type="text" name="taglineEn" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg" value={localConfig.taglineEn} onChange={handleInputChange} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">عنوان الشعار الفرعي (عربي)</label>
                <input type="text" name="taglineAr" className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg" value={localConfig.taglineAr} onChange={handleInputChange} dir="rtl" />
              </div>
              <div className="md:col-span-2 bg-blue-50/20 p-5 rounded-xl border border-blue-100/60 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <h4 className="text-xs font-Cairo font-extrabold text-[#172995] mb-2">🎁 شعار الشركة (اللوجو)</h4>
                  <MediaPickerField labelEn="Company Rectangular Logo" labelAr="شعار الشركة المستطيل المعتمد" currentValue={localConfig.logoUrl} onChange={(url) => setLocalConfig(prev => ({ ...prev, logoUrl: url }))} lang="ar" maxWidth={400} maxHeight={320} quality={0.75} />
                </div>
                <div>
                  <h4 className="text-xs font-Cairo font-extrabold text-[#172995] mb-2">📸 الصورة الرئيسية للمقر</h4>
                  <MediaPickerField labelEn="Store / Warehouse Media Image" labelAr="الصورة الرئيسية لمخازن ومقرات الشركة" currentValue={localConfig.aboutMediaUrl} onChange={(url) => setLocalConfig(prev => ({ ...prev, aboutMediaUrl: url }))} lang="ar" maxWidth={800} maxHeight={600} quality={0.75} />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">1.5 Security & Admin Password (كلمة المرور)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase block">Admin Passcode</label>
                <input type="text" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.adminPassword || ""} onChange={(e) => setLocalConfig((prev) => ({ ...prev, adminPassword: e.target.value }))} placeholder="admin" />
              </div>
              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">رمز المرور (عربي)</label>
                <input type="text" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-right" value={localConfig.adminPassword || ""} onChange={(e) => setLocalConfig((prev) => ({ ...prev, adminPassword: e.target.value }))} placeholder="admin" dir="rtl" />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">2. About Us Narrative (عن الشركة)</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase block">Business Summary (English)</label>
                <textarea name="aboutTextEn" rows={4} className="w-full p-3 text-xs text-neutral-800 border border-neutral-200 rounded-lg" value={localConfig.aboutTextEn} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">ملخص أعمال الشركة بالسويس (عربي)</label>
                <textarea name="aboutTextAr" rows={4} className="w-full p-3 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo" value={localConfig.aboutTextAr} onChange={handleInputChange} dir="rtl" required />
              </div>
            </div>
          </div>

          {/* 7. Samsung Section (Includes Working Hours + Website URL) */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-blue-600 font-bold border-b border-neutral-100 pb-2">7. Samsung Authorized Portal Config (إعدادات سامسونج)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Phone</label><input type="text" name="samsungPhone" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.samsungPhone || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung WhatsApp</label><input type="text" name="samsungWhatsapp" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.samsungWhatsapp || ""} onChange={handleInputChange} /></div>
              
              {/* مواعيد العمل ورابط سامسونج العام */}
              <div className="space-y-1"><label className="text-2xs font-bold text-blue-600 block uppercase">Samsung Working Hours (En)</label><input type="text" name="samsungWorkingHoursEn" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-blue-200 rounded-lg" value={localConfig.samsungWorkingHoursEn || ""} onChange={handleInputChange} placeholder="e.g. 10:00 AM - 11:00 PM" /></div>
              <div className="space-y-1"><label className="text-2xs font-Cairo font-semibold text-blue-600 block text-right">مواعيد عمل سامسونج (عربي)</label><input type="text" name="samsungWorkingHoursAr" className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-blue-200 rounded-lg font-Cairo" value={localConfig.samsungWorkingHoursAr || ""} onChange={handleInputChange} dir="rtl" placeholder="مثال: من 10 صباحاً إلى 11 مساءً" /></div>
              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-blue-600 block uppercase">Samsung Portal / Website Link</label><input type="text" name="samsungWebsiteUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-blue-200 rounded-lg font-mono" value={localConfig.samsungWebsiteUrl || ""} onChange={handleInputChange} placeholder="https://..." /></div>

              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL</label><input type="text" name="samsungMapUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.samsungMapUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Facebook URL</label><input type="text" name="samsungFacebookUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.samsungFacebookUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Instagram URL</label><input type="text" name="samsungInstagramUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.samsungInstagramUrl || ""} onChange={handleInputChange} /></div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-blue-600 font-bold font-Cairo">Samsung Showrooms & Branches</h4>
              {(localConfig.samsungBranches || []).map((b) => (
                <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                  <button type="button" onClick={() => handleDeleteSamsungBranch(b.id)} className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 rounded p-1"><Trash2 className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.nameEn} onChange={(e) => handleUpdateSamsungBranchField(b.id, "nameEn", e.target.value)} placeholder="Name (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.nameAr} onChange={(e) => handleUpdateSamsungBranchField(b.id, "nameAr", e.target.value)} dir="rtl" placeholder="الاسم (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.addressEn} onChange={(e) => handleUpdateSamsungBranchField(b.id, "addressEn", e.target.value)} placeholder="Address (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.addressAr} onChange={(e) => handleUpdateSamsungBranchField(b.id, "addressAr", e.target.value)} dir="rtl" placeholder="العنوان (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.phone} onChange={(e) => handleUpdateSamsungBranchField(b.id, "phone", e.target.value)} placeholder="Phone" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.mapUrl} onChange={(e) => handleUpdateSamsungBranchField(b.id, "mapUrl", e.target.value)} placeholder="Map URL" />
                  </div>
                </div>
              ))}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1"><Plus className="w-3.5 h-3.5 text-blue-600" /> Add New Samsung Location</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Name (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newSamsungBranch.nameEn} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, nameEn: e.target.value })} />
                  <input type="text" placeholder="الاسم (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newSamsungBranch.nameAr} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, nameAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Address (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newSamsungBranch.addressEn} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, addressEn: e.target.value })} />
                  <input type="text" placeholder="العنوان (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newSamsungBranch.addressAr} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, addressAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Phone" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newSamsungBranch.phone} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, phone: e.target.value })} />
                  <input type="text" placeholder="Map URL" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newSamsungBranch.mapUrl} onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, mapUrl: e.target.value })} />
                </div>
                <button type="button" onClick={handleAddNewSamsungBranch} className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-2xs rounded">Confirm Adding</button>
              </div>
            </div>
          </div>

          {/* 8. Beko Section (Includes Working Hours + Website URL) */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-red-600 font-bold border-b border-neutral-100 pb-2">8. Beko Authorized Portal Config (إعدادات بيكو)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Phone</label><input type="text" name="bekoPhone" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.bekoPhone || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Beko WhatsApp</label><input type="text" name="bekoWhatsapp" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.bekoWhatsapp || ""} onChange={handleInputChange} /></div>
              
              {/* مواعيد العمل ورابط بيكو العام */}
              <div className="space-y-1"><label className="text-2xs font-bold text-red-600 block uppercase">Beko Working Hours (En)</label><input type="text" name="bekoWorkingHoursEn" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-red-200 rounded-lg" value={localConfig.bekoWorkingHoursEn || ""} onChange={handleInputChange} placeholder="e.g. 10:00 AM - 11:00 PM" /></div>
              <div className="space-y-1"><label className="text-2xs font-Cairo font-semibold text-red-600 block text-right">مواعيد عمل بيكو (عربي)</label><input type="text" name="bekoWorkingHoursAr" className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-red-200 rounded-lg font-Cairo" value={localConfig.bekoWorkingHoursAr || ""} onChange={handleInputChange} dir="rtl" placeholder="مثال: من 10 صباحاً إلى 11 مساءً" /></div>
              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-red-600 block uppercase">Beko Portal / Website Link</label><input type="text" name="bekoWebsiteUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-red-200 rounded-lg font-mono" value={localConfig.bekoWebsiteUrl || ""} onChange={handleInputChange} placeholder="https://..." /></div>

              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL</label><input type="text" name="bekoMapUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.bekoMapUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Facebook URL</label><input type="text" name="bekoFacebookUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.bekoFacebookUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Instagram URL</label><input type="text" name="bekoInstagramUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.bekoInstagramUrl || ""} onChange={handleInputChange} /></div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-red-600 font-bold font-Cairo">Beko Showrooms & Branches</h4>
              {(localConfig.bekoBranches || []).map((b) => (
                <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                  <button type="button" onClick={() => handleDeleteBekoBranch(b.id)} className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 rounded p-1"><Trash2 className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.nameEn} onChange={(e) => handleUpdateBekoBranchField(b.id, "nameEn", e.target.value)} placeholder="Name (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.nameAr} onChange={(e) => handleUpdateBekoBranchField(b.id, "nameAr", e.target.value)} dir="rtl" placeholder="الاسم (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.addressEn} onChange={(e) => handleUpdateBekoBranchField(b.id, "addressEn", e.target.value)} placeholder="Address (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.addressAr} onChange={(e) => handleUpdateBekoBranchField(b.id, "addressAr", e.target.value)} dir="rtl" placeholder="العنوان (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.phone} onChange={(e) => handleUpdateBekoBranchField(b.id, "phone", e.target.value)} placeholder="Phone" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.mapUrl} onChange={(e) => handleUpdateBekoBranchField(b.id, "mapUrl", e.target.value)} placeholder="Map URL" />
                  </div>
                </div>
              ))}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1"><Plus className="w-3.5 h-3.5 text-red-600" /> Add New Beko Location</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Name (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newBekoBranch.nameEn} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, nameEn: e.target.value })} />
                  <input type="text" placeholder="الاسم (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newBekoBranch.nameAr} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, nameAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Address (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newBekoBranch.addressEn} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, addressEn: e.target.value })} />
                  <input type="text" placeholder="العنوان (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newBekoBranch.addressAr} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, addressAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Phone" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newBekoBranch.phone} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, phone: e.target.value })} />
                  <input type="text" placeholder="Map URL" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newBekoBranch.mapUrl} onChange={(e) => setNewBekoBranch({ ...newBekoBranch, mapUrl: e.target.value })} />
                </div>
                <button type="button" onClick={handleAddNewBekoBranch} className="px-3.5 py-1.5 bg-red-600 text-white font-bold text-2xs rounded">Confirm Adding</button>
              </div>
            </div>
          </div>

          {/* 8.5 San George / Midea Section (Includes Working Hours + Website URL) */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-teal-600 font-bold border-b border-neutral-100 pb-2">8.5. San George Service Portal Config (إعدادات سان جورج)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Phone Number</label><input type="text" name="mideaPhone" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.mideaPhone || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">WhatsApp Number</label><input type="text" name="mideaWhatsapp" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.mideaWhatsapp || ""} onChange={handleInputChange} /></div>

              {/* مواعيد العمل ورابط سان جورج العام */}
              <div className="space-y-1"><label className="text-2xs font-bold text-teal-600 block uppercase">San George Working Hours (En)</label><input type="text" name="mideaWorkingHoursEn" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-teal-200 rounded-lg" value={localConfig.mideaWorkingHoursEn || ""} onChange={handleInputChange} placeholder="e.g. 10:00 AM - 11:00 PM" /></div>
              <div className="space-y-1"><label className="text-2xs font-Cairo font-semibold text-teal-600 block text-right">مواعيد عمل سان جورج (عربي)</label><input type="text" name="mideaWorkingHoursAr" className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-teal-200 rounded-lg font-Cairo" value={localConfig.mideaWorkingHoursAr || ""} onChange={handleInputChange} dir="rtl" placeholder="مثال: من 10 صباحاً إلى 11 مساءً" /></div>
              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-teal-600 block uppercase">San George Portal / Website Link</label><input type="text" name="mideaWebsiteUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-teal-200 rounded-lg font-mono" value={localConfig.mideaWebsiteUrl || ""} onChange={handleInputChange} placeholder="https://..." /></div>

              <div className="space-y-1 sm:col-span-2"><label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL</label><input type="text" name="mideaMapUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.mideaMapUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Facebook URL</label><input type="text" name="mideaFacebookUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.mideaFacebookUrl || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><label className="text-2xs font-bold text-neutral-400 block uppercase">Instagram URL</label><input type="text" name="mideaInstagramUrl" className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono" value={localConfig.mideaInstagramUrl || ""} onChange={handleInputChange} /></div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-teal-600 font-bold font-Cairo">San George Showrooms & Branches List</h4>
              {(localConfig.mideaBranches || []).map((b) => (
                <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                  <button type="button" onClick={() => handleDeleteMideaBranch(b.id)} className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 rounded p-1"><Trash2 className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.nameEn} onChange={(e) => handleUpdateMideaBranchField(b.id, "nameEn", e.target.value)} placeholder="Name (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.nameAr} onChange={(e) => handleUpdateMideaBranchField(b.id, "nameAr", e.target.value)} dir="rtl" placeholder="الاسم (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={b.addressEn} onChange={(e) => handleUpdateMideaBranchField(b.id, "addressEn", e.target.value)} placeholder="Address (En)" />
                    <input type="text" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={b.addressAr} onChange={(e) => handleUpdateMideaBranchField(b.id, "addressAr", e.target.value)} dir="rtl" placeholder="العنوان (عربي)" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.phone} onChange={(e) => handleUpdateMideaBranchField(b.id, "phone", e.target.value)} placeholder="Phone" />
                    <input type="text" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={b.mapUrl} onChange={(e) => handleUpdateMideaBranchField(b.id, "mapUrl", e.target.value)} placeholder="Map URL" />
                  </div>
                </div>
              ))}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1"><Plus className="w-3.5 h-3.5 text-teal-600" /> Add New San George Location</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Name (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newMideaBranch.nameEn} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, nameEn: e.target.value })} />
                  <input type="text" placeholder="الاسم (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newMideaBranch.nameAr} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, nameAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Address (En)" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md" value={newMideaBranch.addressEn} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, addressEn: e.target.value })} />
                  <input type="text" placeholder="العنوان (عربي)" className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md" value={newMideaBranch.addressAr} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, addressAr: e.target.value })} dir="rtl" />
                  <input type="text" placeholder="Phone" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newMideaBranch.phone} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, phone: e.target.value })} />
                  <input type="text" placeholder="Map URL" className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono" value={newMideaBranch.mapUrl} onChange={(e) => setNewMideaBranch({ ...newMideaBranch, mapUrl: e.target.value })} />
                </div>
                <button type="button" onClick={handleAddNewMideaBranch} className="px-3.5 py-1.5 bg-teal-600 text-white font-bold text-2xs rounded">Confirm Adding</button>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">9. Authorized Brands Board (إدارة الماركات)</h3>
            <div className="bg-neutral-50/50 p-4 border border-neutral-200/60 rounded-xl space-y-4">
              <span className="block text-2xs uppercase tracking-wider text-neutral-400 font-bold">Add New Commercial Partner</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Brand Name" className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} />
                <MediaPickerField labelEn="Brand Logo" labelAr="لوجو الماركة" currentValue={newBrandLogoUrl} onChange={(url) => setNewBrandLogoUrl(url)} lang="ar" maxWidth={200} maxHeight={120} quality={0.7} />
              </div>
              <button type="button" onClick={handleAddBrand} className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-lg">Add Brand</button>
            </div>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-emerald-600 font-bold border-b border-neutral-100 pb-2">10. Deals & Special Offers (إدارة العروض)</h3>
            <div className="bg-neutral-50/50 p-4 border border-neutral-200/60 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Offer Title (En)" className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg" value={newOfferTitleEn} onChange={(e) => setNewOfferTitleEn(e.target.value)} />
                <input type="text" placeholder="عنوان العرض (عربي)" className="w-full px-3 py-1.5 text-xs text-right border border-neutral-200 rounded-lg font-Cairo" dir="rtl" value={newOfferTitleAr} onChange={(e) => setNewOfferTitleAr(e.target.value)} />
                <textarea placeholder="Details (En)" rows={2} className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg" value={newOfferDescEn} onChange={(e) => setNewOfferDescEn(e.target.value)} />
                <textarea placeholder="تفاصيل (عربي)" rows={2} className="w-full px-3 py-1.5 text-xs text-right border border-neutral-200 rounded-lg font-Cairo" dir="rtl" value={newOfferDescAr} onChange={(e) => setNewOfferDescAr(e.target.value)} />
                <div className="md:col-span-2">
                  <MediaPickerField labelEn="Offer Image" labelAr="صورة العرض" currentValue={newOfferImageUrl} onChange={(url) => setNewOfferImageUrl(url)} lang="ar" maxWidth={600} maxHeight={450} quality={0.75} />
                </div>
              </div>
              <button type="button" onClick={handleAddOffer} className="px-4.5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg">Add Offer</button>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-indigo-600 font-bold border-b border-neutral-100 pb-2">11. Client Testimonials (إدارة الآراء)</h3>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name (En)" className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg" value={newTestiNameEn} onChange={(e) => setNewTestiNameEn(e.target.value)} />
                <input type="text" placeholder="الاسم (عربي)" className="w-full px-3 py-1.5 text-xs text-right border border-neutral-200 rounded-lg font-Cairo" dir="rtl" value={newTestiNameAr} onChange={(e) => setNewTestiNameAr(e.target.value)} />
                <textarea placeholder="Feedback (En)" rows={2} className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg" value={newTestiFeedbackEn} onChange={(e) => setNewTestiFeedbackEn(e.target.value)} />
                <textarea placeholder="الرأي (عربي)" rows={2} className="w-full px-3 py-1.5 text-xs text-right border border-neutral-200 rounded-lg font-Cairo" dir="rtl" value={newTestiFeedbackAr} onChange={(e) => setNewTestiFeedbackAr(e.target.value)} />
                <div>
                  <MediaPickerField labelEn="Client Photo" labelAr="صورة العميل" currentValue={newTestiImageUrl} onChange={(url) => setNewTestiImageUrl(url)} lang="ar" maxWidth={128} maxHeight={128} quality={0.7} />
                </div>
              </div>
              <button type="button" onClick={handleAddTestimonial} className="px-4.5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">Add Testimonial</button>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200/60" dir={lang === "ar" ? "rtl" : "ltr"}>
              <p className="font-Cairo font-black">{errorMsg}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-white rounded-xl p-4 border border-neutral-200/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={onReset} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-xs font-bold text-neutral-600 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5" /> <span>Reset UI Defaults</span>
            </button>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="button" onClick={onExit} disabled={isSaving} className="px-5 py-2 text-xs font-bold bg-neutral-100 rounded-lg">Cancel Changes</button>
              <button type="submit" disabled={isSaving} className={`flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold rounded-lg text-white ${isSaving ? "bg-neutral-400" : "bg-brand-blue"}`}>
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
              </button>
            </div>
          </div>
        </form>

        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3 rounded-xl shadow-lg border border-neutral-800 text-xs font-bold">
            🎉 {successMsg}
          </div>
        )}
      </div>

      {isGlobalMediaManagerOpen && <MediaManager lang="ar" onClose={() => setIsGlobalMediaManagerOpen(false)} />}
    </div>
  );
};
