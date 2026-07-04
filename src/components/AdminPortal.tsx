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
      
      // Auto-propagate Master Location fields into the respective first branch
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

  // Branch repeater mechanics
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
      branches: [...prev.branches, branchWithId]
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
      
      // Auto-sync first branch changes back to Master settings fields
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

  // Samsung branch repeater mechanics
  const [newSamsungBranch, setNewSamsungBranch] = useState<Omit<Branch, "id">>({
    nameEn: "",
    nameAr: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    mapUrl: ""
  });

  const handleAddNewSamsungBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSamsungBranch.nameEn || !newSamsungBranch.nameAr) {
      alert("Please enter both English and Arabic branch names.");
      return;
    }
    const branchWithId: Branch = {
      ...newSamsungBranch,
      id: `samsung-branch-${Date.now()}`
    };
    setLocalConfig((prev) => ({
      ...prev,
      samsungBranches: [...(prev.samsungBranches || []), branchWithId]
    }));
    setNewSamsungBranch({
      nameEn: "",
      nameAr: "",
      addressEn: "",
      addressAr: "",
      phone: "",
      mapUrl: ""
    });
  };

  const handleDeleteSamsungBranch = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      samsungBranches: (prev.samsungBranches || []).filter((b) => b.id !== id)
    }));
  };

  const handleUpdateSamsungBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.samsungBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, samsungBranches: updatedBranches };
      
      // Auto-sync first Samsung branch changes back to Master Samsung settings fields
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

  // Beko branch repeater mechanics
  const [newBekoBranch, setNewBekoBranch] = useState<Omit<Branch, "id">>({
    nameEn: "",
    nameAr: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    mapUrl: ""
  });

  const handleAddNewBekoBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBekoBranch.nameEn || !newBekoBranch.nameAr) {
      alert("Please enter both English and Arabic branch names.");
      return;
    }
    const branchWithId: Branch = {
      ...newBekoBranch,
      id: `beko-branch-${Date.now()}`
    };
    setLocalConfig((prev) => ({
      ...prev,
      bekoBranches: [...(prev.bekoBranches || []), branchWithId]
    }));
    setNewBekoBranch({
      nameEn: "",
      nameAr: "",
      addressEn: "",
      addressAr: "",
      phone: "",
      mapUrl: ""
    });
  };

  const handleDeleteBekoBranch = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      bekoBranches: (prev.bekoBranches || []).filter((b) => b.id !== id)
    }));
  };

  const handleUpdateBekoBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.bekoBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, bekoBranches: updatedBranches };
      
      // Auto-sync first Beko branch changes back to Master Beko settings fields
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

  // Midea branch repeater mechanics
  const [newMideaBranch, setNewMideaBranch] = useState<Omit<Branch, "id">>({
    nameEn: "",
    nameAr: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    mapUrl: ""
  });

  const handleAddNewMideaBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMideaBranch.nameEn || !newMideaBranch.nameAr) {
      alert("Please enter both English and Arabic branch names.");
      return;
    }
    const branchWithId: Branch = {
      ...newMideaBranch,
      id: `midea-branch-${Date.now()}`
    };
    setLocalConfig((prev) => ({
      ...prev,
      mideaBranches: [...(prev.mideaBranches || []), branchWithId]
    }));
    setNewMideaBranch({
      nameEn: "",
      nameAr: "",
      addressEn: "",
      addressAr: "",
      phone: "",
      mapUrl: ""
    });
  };

  const handleDeleteMideaBranch = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      mideaBranches: (prev.mideaBranches || []).filter((b) => b.id !== id)
    }));
  };

  const handleUpdateMideaBranchField = (id: string, field: keyof Branch, val: string) => {
    setLocalConfig((prev) => {
      const updatedBranches = (prev.mideaBranches || []).map((b) => (b.id === id ? { ...b, [field]: val } : b));
      let updated = { ...prev, mideaBranches: updatedBranches };
      
      // Auto-sync first Midea branch changes back to Master Midea settings fields
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

  // Brand management mechanics
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState("");

  const handleAddBrand = () => {
    if (!newBrandName.trim()) {
      alert("Please enter a brand name.");
      return;
    }
    const brandWithId: BrandItem = {
      id: `brand-${Date.now()}`,
      name: newBrandName.trim(),
      logoUrl: newBrandLogoUrl.trim()
    };
    setLocalConfig((prev) => ({
      ...prev,
      brands: [...prev.brands, brandWithId]
    }));
    setNewBrandName("");
    setNewBrandLogoUrl("");
  };

  const handleRemoveBrand = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      brands: prev.brands.filter(b => b.id !== id)
    }));
  };

  // Offers & Discounts management mechanics
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
    if (!newOfferTitleAr.trim()) {
      alert("الرجاء إدخال عنوان العرض باللغة العربية على الأقل.");
      return;
    }
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
    setLocalConfig((prev) => ({
      ...prev,
      offers: [...(prev.offers || []), offerWithId]
    }));
    setNewOfferTitleAr("");
    setNewOfferTitleEn("");
    setNewOfferDescAr("");
    setNewOfferDescEn("");
    setNewOfferBadgeAr("");
    setNewOfferBadgeEn("");
    setNewOfferImageUrl("");
    setNewOfferPhone("");
    setNewOfferWhatsapp("");
  };

  const handleRemoveOffer = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      offers: (prev.offers || []).filter(o => o.id !== id)
    }));
  };

  // Testimonial management mechanics
  const [newTestiNameEn, setNewTestiNameEn] = useState("");
  const [newTestiNameAr, setNewTestiNameAr] = useState("");
  const [newTestiTitleEn, setNewTestiTitleEn] = useState("");
  const [newTestiTitleAr, setNewTestiTitleAr] = useState("");
  const [newTestiFeedbackEn, setNewTestiFeedbackEn] = useState("");
  const [newTestiFeedbackAr, setNewTestiFeedbackAr] = useState("");
  const [newTestiRating, setNewTestiRating] = useState<number>(5);
  const [newTestiImageUrl, setNewTestiImageUrl] = useState("");

  const handleAddTestimonial = () => {
    if (!newTestiNameAr.trim() && !newTestiNameEn.trim()) {
      alert("Please enter at least an English or Arabic author name.");
      return;
    }
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
    setLocalConfig((prev) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), testiWithId]
    }));
    // Reset fields
    setNewTestiNameEn("");
    setNewTestiNameAr("");
    setNewTestiTitleEn("");
    setNewTestiTitleAr("");
    setNewTestiFeedbackEn("");
    setNewTestiFeedbackAr("");
    setNewTestiRating(5);
    setNewTestiImageUrl("");
  };

  const handleRemoveTestimonial = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((t) => t.id !== id)
    }));
  };

  const compressConfigImages = async (configData: CompanyConfig): Promise<CompanyConfig> => {
    const next = { ...configData };

    // 1. Company Logo: max 400x320
    if (next.logoUrl) {
      next.logoUrl = await compressBase64(next.logoUrl, 400, 320, 0.75);
    }

    // 2. About Media: max 800x600
    if (next.aboutMediaUrl) {
      next.aboutMediaUrl = await compressBase64(next.aboutMediaUrl, 800, 600, 0.75);
    }

    // 3. Custom Action Buttons
    if (next.buttons) {
      next.buttons = { ...next.buttons };
      if (next.buttons.contacts) {
        next.buttons.contacts = { ...next.buttons.contacts };
        if (next.buttons.contacts.imageUrl) {
          next.buttons.contacts.imageUrl = await compressBase64(next.buttons.contacts.imageUrl, 350, 250, 0.7);
        }
      }
      if (next.buttons.branches) {
        next.buttons.branches = { ...next.buttons.branches };
        if (next.buttons.branches.imageUrl) {
          next.buttons.branches.imageUrl = await compressBase64(next.buttons.branches.imageUrl, 350, 250, 0.7);
        }
      }
      if (next.buttons.social) {
        next.buttons.social = { ...next.buttons.social };
        if (next.buttons.social.imageUrl) {
          next.buttons.social.imageUrl = await compressBase64(next.buttons.social.imageUrl, 350, 250, 0.7);
        }
      }
    }

    // 4. Commercial partner brands: max 200x120
    if (next.brands && next.brands.length > 0) {
      next.brands = await Promise.all(
        next.brands.map(async (brand) => {
          if (brand.logoUrl) {
            const logoCompressed = await compressBase64(brand.logoUrl, 200, 120, 0.7);
            return { ...brand, logoUrl: logoCompressed };
          }
          return brand;
        })
      );
    }

    // 5. Special Offers Board: max 600x450
    if (next.offers && next.offers.length > 0) {
      next.offers = await Promise.all(
        next.offers.map(async (offer) => {
          if (offer.imageUrl) {
            const imgCompressed = await compressBase64(offer.imageUrl, 600, 450, 0.75);
            return { ...offer, imageUrl: imgCompressed };
          }
          return offer;
        })
      );
    }

    // 6. Testimonials Row: max 128x128
    if (next.testimonials && next.testimonials.length > 0) {
      next.testimonials = await Promise.all(
        next.testimonials.map(async (testimonial) => {
          if (testimonial.imageUrl) {
            const imgCompressed = await compressBase64(testimonial.imageUrl, 128, 128, 0.7);
            return { ...testimonial, imageUrl: imgCompressed };
          }
          return testimonial;
        })
      );
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
      // Synchronize the local input state as well with optimized values
      setLocalConfig(optimizedConfig);
      setSuccessMsg(
        lang === "ar" 
          ? "تم حفظ الإعدادات وتحديث الموقع الإلكتروني بنجاح!" 
          : "Configuration saved and landing page updated in Suez database!"
      );
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err: any) {
      console.error("Save error: ", err);
      let errMsgFriendly = lang === "ar"
        ? "فشل في حفظ البيانات. يرجى التحقق من اتصالك بالإنترنت وصحة إعدادات قاعدة البيانات."
        : "Failed to save configuration. Please check your internet connection and database settings.";
      
      try {
        if (err && err.message) {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.error) {
            errMsgFriendly += ` (${parsed.error})`;
          }
        }
      } catch (_) {
        if (err && err.message) {
          errMsgFriendly += ` (${err.message})`;
        }
      }
      setErrorMsg(errMsgFriendly);
    } finally {
      setIsSaving(false);
    }
  };

  // Export fully client-side single html file generator
  const triggerHTMLDownload = () => {
    const serializedConfigJson = JSON.stringify(localConfig, null, 2);
    
    // Assemble the complete client-facing index.html with Cairo, Inter, Tailwind & customized dynamic configuration
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${localConfig.companyNameEn} - شركة سان جورج التجارية</title>
    <!-- Tailwind CSS v3 Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', 'Cairo', sans-serif; }
        .font-display { font-family: 'Outfit', 'Cairo', sans-serif; }
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
    </style>
</head>
<body class="bg-[#FFFFFF] text-gray-800 antialiased selection:bg-[#172995]/10 selection:text-[#172995]">

    <!-- APP WRAPPER -->
    <div class="min-h-screen flex flex-col">

        <!-- HEADER SECTION -->
        <header class="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-40">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <!-- Brand Logo & Identity -->
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#172995] text-white flex items-center justify-center font-bold text-xl rounded-xl">
                        SG
                    </div>
                    <div>
                        <h1 class="font-display font-extrabold text-base md:text-lg text-gray-900 leading-tight">
                            ${localConfig.companyNameEn}
                        </h1>
                        <p class="font-Cairo text-xs font-bold text-[#172995]" dir="rtl">
                            ${localConfig.companyNameAr}
                        </p>
                    </div>
                </div>

                <!-- Decorative Badge for Suez Trade Link -->
                <div class="hidden sm:flex items-center gap-2 bg-[#172995]/5 px-3 py-1.5 rounded-full">
                    <span class="w-1.5 h-1.5 bg-[#172995] rounded-full animate-ping"></span>
                    <span class="text-xs text-[#172995] font-Cairo font-semibold">تأسس في السويس</span>
                </div>
            </div>
        </header>

        <!-- HERO BANNER SECTION -->
        <main class="flex-grow">
            <section class="max-w-7xl mx-auto px-4 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <!-- Col 1: Hero Text & Arabic Overlay -->
                <div class="lg:col-span-7 space-y-6">
                    <span class="inline-block bg-[#172995]/10 text-[#172995] text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                        Authorized Trading Partner • شريك تجاري معتمد
                    </span>
                    
                    <div class="space-y-3">
                        <h2 class="font-display font-extrabold text-3xl md:text-5xl text-gray-900 tracking-tight leading-tight">
                            ${localConfig.taglineEn}
                        </h2>
                        <h3 className="font-Cairo font-bold text-lg md:text-xl text-gray-500" dir="rtl">
                            ${localConfig.taglineAr}
                        </h3>
                    </div>

                    <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                        ${localConfig.aboutTextEn}
                    </p>
                    
                    <p class="font-Cairo text-sm md:text-base leading-relaxed text-gray-500 border-r-2 border-[#172995] pr-4" dir="rtl">
                        ${localConfig.aboutTextAr}
                    </p>

                    <!-- CONNECTIVITY MODULE: Dynamic Three Big Buttons Grid -->
                    <div class="pt-6">
                        <h4 class="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                            <span>Interactive Portlets</span>
                            <span class="h-px bg-gray-100 flex-1"></span>
                        </h4>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <!-- Toggle branches button -->
                            ${localConfig.buttons.branches.visible ? `
                            <button onclick="openModal('branches')" class="group p-5 bg-white border border-gray-200 hover:border-[#172995]/30 hover:shadow-md text-right flex flex-col justify-between h-32 transition-all transform hover:-translate-y-1">
                                <span class="bg-gray-50 p-2 rounded-lg self-end text-lg text-gray-700">📍</span>
                                <div>
                                    <span class="block text-xs text-gray-400 font-display font-medium uppercase tracking-wide">${localConfig.buttons.branches.labelEn}</span>
                                    <span class="block text-sm font-Cairo font-bold text-gray-800">${localConfig.buttons.branches.labelAr}</span>
                                </div>
                            </button>
                            ` : ""}

                            <!-- Toggle social button -->
                            ${localConfig.buttons.social.visible ? `
                            <button onclick="openModal('social')" class="group p-5 bg-white border border-gray-200 hover:border-[#172995]/30 hover:shadow-md text-right flex flex-col justify-between h-32 transition-all transform hover:-translate-y-1">
                                <span class="bg-gray-50 p-2 rounded-lg self-end text-lg text-gray-700">🌐</span>
                                <div>
                                    <span class="block text-xs text-gray-400 font-display font-medium uppercase tracking-wide">${localConfig.buttons.social.labelEn}</span>
                                    <span class="block text-sm font-Cairo font-bold text-gray-800">${localConfig.buttons.social.labelAr}</span>
                                </div>
                            </button>
                            ` : ""}
                        </div>
                    </div>
                </div>

                <!-- Col 2: Media Slot Container -->
                <div class="lg:col-span-5">
                    <div class="relative bg-gray-50 rounded-3xl p-3 border border-gray-150 shadow-md">
                        <div class="aspect-[4/3] w-full rounded-2xl overflow-hidden relative">
                            <img 
                                src="${localConfig.aboutMediaUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200"}" 
                                alt="Suez trading outlet San George" 
                                class="w-full h-full object-cover"
                            />
                            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 text-white flex flex-col justify-end">
                                <span class="text-3xs tracking-widest uppercase font-bold text-white/80">Suez Operational Base</span>
                                <span class="text-sm font-bold font-Cairo mt-1">المستودعات ومواقع الخدمات اللوجستية في السويس</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- BRANDS INFINITE TICKER MARQUEE -->
            <section class="py-10 bg-gray-50 border-y border-gray-100 overflow-hidden relative">
                <div class="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                <div class="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
                    <span class="text-xs uppercase tracking-widest text-gray-400 font-bold">Authorized Brands</span>
                    <span class="text-xs font-Cairo font-bold text-gray-400">الوكالات التجارية المعتمدة</span>
                </div>

                <div class="relative w-full overflow-hidden flex items-center">
                    <div class="animate-marquee whitespace-nowrap flex gap-10 items-center">
                        ${[...localConfig.brands, ...localConfig.brands, ...localConfig.brands].map((b) => `
                        <div class="inline-flex items-center justify-center bg-white px-8 py-3 rounded-2xl border border-gray-150 shadow-xs" style="min-width: 160px; height: 62px;">
                            ${b.logoUrl ? `
                            <img src="${b.logoUrl}" alt="${b.name}" class="max-h-9 max-w-[120px] object-contain" />
                            ` : `
                            <span class="text-gray-700 font-extrabold font-display text-xs tracking-wider uppercase">${b.name}</span>
                            `}
                        </div>
                        `).join("")}
                    </div>
                </div>
            </section>
        </main>

        <!-- FOOTER BAR -->
        <footer class="bg-white border-t border-gray-100 py-8 px-4 text-center mt-6">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <span class="text-xs text-gray-400 font-medium">
                    © 2026 ${localConfig.companyNameEn}. All Rights Reserved.
                </span>
                <span class="text-xs text-gray-400 font-Cairo font-semibold">
                    شركة سان جورج التجارية - السويس
                </span>
            </div>
        </footer>

    </div>

    <!-- --- INTERACTIVE MODAL OVERLAYS --- -->
    <div id="modal-container" class="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
        <div class="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" onclick="closeModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 border border-gray-100 transform scale-100">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
                <div>
                    <h3 id="modal-title-en" class="font-display text-lg font-extrabold text-[#172995]"></h3>
                    <p id="modal-title-ar" class="font-Cairo text-xs font-bold text-gray-400 mt-0.5" dir="rtl"></p>
                </div>
                <button onclick="closeModal()" class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition">✕</button>
            </div>

            <!-- Dynamic Content Slot -->
            <div id="modal-content-slot" class="p-6"></div>
        </div>
    </div>



    <!-- BRANCHES MODAL HTML CHUNK -->
    <template id="template-branches">
        <div class="space-y-6">
            <div class="flex flex-wrap gap-2 border-b border-gray-100 pb-3" id="branch-tabs-container">
                ${localConfig.branches.map((b, i) => `
                <button onclick="tabBranch('${b.id}')" id="btn-tab-${b.id}" class="branch-tab-btn px-4 py-2 text-xs rounded-lg font-medium transition-all ${i === 0 ? "bg-[#172995] text-white" : "bg-gray-50 text-gray-600"}">
                    <div class="text-left font-bold">${b.nameEn}</div>
                </button>
                `).join("")}
            </div>

            <div id="active-branch-desc" class="space-y-4">
                <!-- Swapped programmatically inside javascript script -->
            </div>
        </div>
    </template>

    <!-- SOCIAL MODAL HTML CHUNK -->
    <template id="template-social">
        <div class="space-y-4 text-center">
            <p class="text-xs text-gray-400 font-medium">Connect with San George Suez social handles:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                ${localConfig.facebookUrl ? `
                <a href="${localConfig.facebookUrl}" target="_blank" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-blue-50/50 hover:border-blue-300 transition text-blue-600">
                    <span class="font-bold text-sm text-gray-800">Facebook</span>
                    <span>🌐</span>
                </a>
                ` : ""}
                ${localConfig.instagramUrl ? `
                <a href="${localConfig.instagramUrl}" target="_blank" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-pink-50/50 hover:border-pink-300 transition text-pink-600">
                    <span class="font-bold text-sm text-gray-800">Instagram</span>
                    <span>📸</span>
                </a>
                ` : ""}
                ${localConfig.tiktokUrl ? `
                <a href="${localConfig.tiktokUrl}" target="_blank" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-500 transition text-gray-900">
                    <span class="font-bold text-sm text-gray-800">TikTok</span>
                    <span>🎵</span>
                </a>
                ` : ""}
                ${localConfig.linkedinUrl ? `
                <a href="${localConfig.linkedinUrl}" target="_blank" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-blue-50/50 hover:border-blue-300 transition text-sky-700">
                    <span class="font-bold text-sm text-gray-800">LinkedIn</span>
                    <span>💼</span>
                </a>
                ` : ""}
            </div>
        </div>
    </template>

    <!-- JS BACKING SYSTEM -->
    <script>
        const ACTIVE_CONFIG = ${serializedConfigJson};

        function openModal(type) {
            const container = document.getElementById('modal-container');
            const slot = document.getElementById('modal-content-slot');
            const titleEn = document.getElementById('modal-title-en');
            const titleAr = document.getElementById('modal-title-ar');

            container.classList.remove('hidden');

            if (type === 'social') {
                titleEn.innerText = "Social Channels Hub";
                titleAr.innerText = "مواقع التواصل الاجتماعي";
                const template = document.getElementById('template-social');
                slot.innerHTML = template.innerHTML;
            } else if (type === 'branches') {
                titleEn.innerText = "Our Branch Directory";
                titleAr.innerText = "فروعنا ومنافذنا في السويس";
                const template = document.getElementById('template-branches');
                slot.innerHTML = template.innerHTML;
                
                // Set first branch active
                if (ACTIVE_CONFIG.branches.length > 0) {
                    tabBranch(ACTIVE_CONFIG.branches[0].id);
                }
            }
        }

        function closeModal() {
            document.getElementById('modal-container').classList.add('hidden');
        }

        function getEmbedMapUrl(url, fallbackQuery) {
            if (!url) {
                if (fallbackQuery) {
                    return "https://maps.google.com/maps?q=" + encodeURIComponent(fallbackQuery) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
                }
                return "";
            }
            var trimmed = url.trim();
            if (trimmed.indexOf("output=embed") !== -1 || trimmed.indexOf("/embed") !== -1 || trimmed.indexOf("embed?pb=") !== -1) {
                return trimmed;
            }
            if (trimmed.indexOf("maps.app.goo.gl") !== -1 || trimmed.indexOf("goo.gl/maps") !== -1) {
                if (fallbackQuery) {
                    return "https://maps.google.com/maps?q=" + encodeURIComponent(fallbackQuery) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
                }
            }
            var coordMatch = trimmed.match(/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)/);
            if (coordMatch) {
                return "https://maps.google.com/maps?q=" + coordMatch[1] + "," + coordMatch[2] + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            }
            var placeMatch = trimmed.match(/\\/place\\/([^/]+)/);
            if (placeMatch) {
                var placeName = decodeURIComponent(placeMatch[1].replace(/\\+/g, " "));
                return "https://maps.google.com/maps?q=" + encodeURIComponent(placeName) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            }
            if (trimmed.indexOf("http") === 0 && trimmed.indexOf("google.com/maps") !== -1 && fallbackQuery) {
                return "https://maps.google.com/maps?q=" + encodeURIComponent(fallbackQuery) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            }
            if (trimmed && trimmed.indexOf("http") !== 0) {
                return "https://maps.google.com/maps?q=" + encodeURIComponent(trimmed) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            }
            if (fallbackQuery) {
                return "https://maps.google.com/maps?q=" + encodeURIComponent(fallbackQuery) + "&t=&z=15&ie=UTF8&iwloc=&output=embed";
            }
            return trimmed;
        }

        function tabBranch(branchId) {
            // Un-highlight all tab buttons
            document.querySelectorAll('.branch-tab-btn').forEach(btn => {
                btn.className = "branch-tab-btn px-4 py-2 text-xs rounded-lg font-medium transition-all bg-gray-50 text-gray-600";
            });

            const activeBtn = document.getElementById('btn-tab-' + branchId);
            if (activeBtn) {
                activeBtn.className = "branch-tab-btn px-4 py-2 text-xs rounded-lg font-medium transition-all bg-[#172995] text-white";
            }

            const branchObj = ACTIVE_CONFIG.branches.find(b => b.id === branchId);
            if (branchObj) {
                const descSlot = document.getElementById('active-branch-desc');
                descSlot.innerHTML = \`
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div class="space-y-4">
                            <div>
                                <h4 class="text-base font-bold text-gray-900 font-display">\${branchObj.nameEn}</h4>
                                <p class="text-base font-Cairo font-bold text-[#172995] mt-1 text-right" dir="rtl">\${branchObj.nameAr}</p>
                            </div>
                            <div class="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                <p class="font-medium text-gray-800">📍 \${branchObj.addressEn}</p>
                                <p class="font-Cairo text-gray-500 text-right" dir="rtl">\${branchObj.addressAr}</p>
                                \${branchObj.phone ? \`<p class="font-medium text-gray-800">☎️ \${branchObj.phone}</p>\` : ""}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 h-44 relative">
                                \${branchObj.mapUrl ? \`<iframe src="\${getEmbedMapUrl(branchObj.mapUrl, \`\${branchObj.nameAr || branchObj.nameEn}, \${branchObj.addressAr || branchObj.addressEn}\`)}" width="100%" height="100%" style="border:0;" allowfullscreen="false" loading="lazy"></iframe>\` : "<div class='h-full flex items-center justify-center text-xs text-gray-400'>Map unavailable</div>"}
                            </div>
                            \${branchObj.mapUrl ? \`
                            <div class="flex justify-end">
                                <a href="\${branchObj.mapUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all" style="text-decoration: none;">
                                    <span>🗺️ Open in Google Maps</span>
                                </a>
                            </div>
                            \` : ""}
                        </div>
                    </div>
                \`;


            }
        }
    </script>

</body>
</html>
`;

    const blob = new Blob([htmlTemplate], { type: "text/html;charset=utf-8" });
    const localUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = localUrl;
    link.download = "sangeorge-standalone.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(localUrl);
  };

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-800">
      {/* Top Admin Header */}
      <div className="bg-brand-blue text-white py-4 px-6 shadow-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-brand-blue font-bold flex items-center justify-center rounded-lg text-sm font-display">
            A
          </div>
          <div>
            <span className="text-3xs tracking-widest uppercase font-bold text-white/60 block">Suez Branch Control System</span>
            <span className="font-display font-bold text-sm tracking-tight">San George Co. Admin Console</span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/25 rounded-md text-xs font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit To Site (الرجوع للموقع)</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:py-8 space-y-8">
        {/* Helper Banner */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 font-display">Standalone Export Engine</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instantly save currently updated Suez details down into a production-ready standalone HTML document block.
            </p>
          </div>

          <button
            onClick={triggerHTMLDownload}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 rounded-lg transition shrink-0 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Portable HTML</span>
          </button>
        </div>

        {/* Central Media Vault Portal Widget */}
        <div className="bg-[#172995]/5 rounded-xl p-5 border border-[#172995]/15 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-extrabold text-[#172995] font-display">San George Corporate Media Vault</h2>
            </div>
            <p className="text-xs text-[#172995]/80 mt-1">
              Centralized folder of processed image assets. Upload, resize, crop, and reuse graphic elements seamlessly across Suez profiles.
            </p>
          </div>

          <button
            onClick={() => setIsGlobalMediaManagerOpen(true)}
            type="button"
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-[#172995] text-white font-bold text-xs hover:bg-[#11207e] rounded-xl transition shrink-0 shadow-md cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open Central Media Library (إدارة مكتبة الصور)</span>
          </button>
        </div>

        <form onSubmit={handleFormSave} className="space-y-6">
          {/* SECTION 1: GLOBAL COMPANY NAME & LOGO IDENTITY */}
          <div className="bg-white rounded-xl p-6 border border-neutral-205 border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">
              1. Global Brand & Logo Settings (الهوية والاسم)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase">Company Name (English)</label>
                <input
                  type="text"
                  name="companyNameEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  value={localConfig.companyNameEn}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">اسم الشركة (عربي)</label>
                <input
                  type="text"
                  name="companyNameAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg focus:border-brand-blue"
                  value={localConfig.companyNameAr}
                  onChange={handleInputChange}
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-2xs font-bold text-neutral-400 uppercase">Tagline (English)</label>
                <input
                  type="text"
                  name="taglineEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.taglineEn}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">عنوان الشعار الفرعي (عربي)</label>
                <input
                  type="text"
                  name="taglineAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg"
                  value={localConfig.taglineAr}
                  onChange={handleInputChange}
                  dir="rtl"
                />
              </div>

              <div className="md:col-span-2 bg-blue-50/20 p-5 rounded-xl border border-blue-100/60 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <h4 className="text-xs font-Cairo font-extrabold text-[#172995] mb-2">🎁 خانة رفع وإدارة شعار الشركة (اللوجو)</h4>
                  <MediaPickerField
                    labelEn="Company Rectangular Logo"
                    labelAr="شعار الشركة المستطيل المعتمد"
                    currentValue={localConfig.logoUrl}
                    onChange={(url) => setLocalConfig(prev => ({ ...prev, logoUrl: url }))}
                    lang="ar"
                    helperText="ارفع اللوجو الخاص بك هنا مباشرة. في حالة تركه فارغاً، سيتم دمج الـ 4 فروع وأشكال وإظهار مستطيل اللوجو المبتكر تلقائياً."
                    uploadButtonLabelAr="اسحب أو ارفع اللوجو الآن"
                    uploadButtonLabelEn="Upload Rectangular Logo"
                    maxWidth={400}
                    maxHeight={320}
                    quality={0.75}
                  />
                </div>

                <div>
                  <h4 className="text-xs font-Cairo font-extrabold text-[#172995] mb-2">📸 الصورة الرئيسية للشركة ومقر السويس</h4>
                  <MediaPickerField
                    labelEn="Store / Warehouse Media Image"
                    labelAr="الصورة الرئيسية لمخازن ومقرات الشركة"
                    currentValue={localConfig.aboutMediaUrl}
                    onChange={(url) => setLocalConfig(prev => ({ ...prev, aboutMediaUrl: url }))}
                    lang="ar"
                    helperText="Main visual displaying Suez warehouses, trading activities, or corporate showroom."
                    uploadButtonLabelAr="رفع الصورة مباشرة"
                    uploadButtonLabelEn="Upload Image Directly"
                    maxWidth={800}
                    maxHeight={600}
                    quality={0.75}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1.5: PASSWORD PASSWORD CONFIGURATION */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">
              1.5 Security & Admin Password (تغيير كلمة المرور للوحة التحكم)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase block">Admin Dashboard Passcode</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg focus:border-brand-blue font-mono"
                  value={localConfig.adminPassword || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalConfig((prev) => ({
                      ...prev,
                      adminPassword: val
                    }));
                  }}
                  placeholder="admin"
                />
                <span className="text-3xs text-neutral-400 block">
                  This passcode protects access to San George Suez dynamic configurations. Default is <code className="bg-neutral-50 px-1 py-0.5 rounded text-brand-blue">admin</code>.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">رمز مرور لوحة التحكم (عربي)</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg focus:border-brand-blue font-mono text-right"
                  value={localConfig.adminPassword || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalConfig((prev) => ({
                      ...prev,
                      adminPassword: val
                    }));
                  }}
                  placeholder="admin"
                  dir="rtl"
                />
                <span className="text-3xs text-neutral-400 block text-right font-Cairo">
                  رمز المرور المخصص لحماية وتعديل بيانات المعارض وعروض الأسعار بالسويس. الافتراضي هو <code className="bg-neutral-50 px-1 py-0.5 rounded text-brand-blue">admin</code>.
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: ABOUT US TEXT EDITOR */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">
              2. About Us Narrative (عن الشركة وأنشتطها)
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 uppercase block">Rich Narrative / Business Summary (English)</label>
                <textarea
                  name="aboutTextEn"
                  rows={4}
                  className="w-full p-3 text-xs text-neutral-800 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-blue leading-relaxed font-sans"
                  value={localConfig.aboutTextEn}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">ملخص أعمال ونشاط الشركة في محافظة السويس (عربي)</label>
                <textarea
                  name="aboutTextAr"
                  rows={4}
                  className="w-full p-3 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg leading-relaxed font-Cairo font-semibold"
                  value={localConfig.aboutTextAr}
                  onChange={handleInputChange}
                  dir="rtl"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: THREE-BUTTONS INTERACTIVE COMPONENT TOGGLES */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">
              3. Interactive Portlet Buttons (إعدادات أزرار الاتصال والتحكم)
            </h3>
            <p className="text-3xs text-neutral-400">Toggle whether each button overlay is visible on the main Suez trading screen.</p>

            <div className="space-y-4">
              {/* Branches Toggle */}
              <div className="flex flex-col gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-800">Button 2: Branches (سامسونج)</span>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 rounded-sm"
                        value={localConfig.buttons.branches.labelEn}
                        onChange={(e) => handleButtonLabelChange("branches", "En", e.target.value)}
                        placeholder="Label English"
                      />
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 text-right rounded-sm font-Cairo"
                        value={localConfig.buttons.branches.labelAr}
                        onChange={(e) => handleButtonLabelChange("branches", "Ar", e.target.value)}
                        placeholder="العنوان بالعربية"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleButtonToggle("branches")}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      localConfig.buttons.branches.visible ? "bg-brand-blue" : "bg-neutral-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                      localConfig.buttons.branches.visible ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="pt-2 border-t border-neutral-200/50">
                  <MediaPickerField
                    labelEn="Button 2 Custom Image (Full Banner)"
                    labelAr="صورة الزر الثاني بالكامل (سامسونج)"
                    currentValue={localConfig.buttons.branches.imageUrl || ""}
                    onChange={(url) => handleButtonImageChange("branches", url)}
                    lang="ar"
                    helperText="Upload or choose an image to fill the entire button. Icons/texts will be hidden if selected."
                    maxWidth={350}
                    maxHeight={250}
                    quality={0.7}
                  />
                </div>
              </div>

              {/* Social Toggle */}
              <div className="flex flex-col gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-800">Button 3: Social Hub (بيكو)</span>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 rounded-sm"
                        value={localConfig.buttons.social.labelEn}
                        onChange={(e) => handleButtonLabelChange("social", "En", e.target.value)}
                        placeholder="Label English"
                      />
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 text-right rounded-sm font-Cairo"
                        value={localConfig.buttons.social.labelAr}
                        onChange={(e) => handleButtonLabelChange("social", "Ar", e.target.value)}
                        placeholder="العنوان بالعربية"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleButtonToggle("social")}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      localConfig.buttons.social.visible ? "bg-brand-blue" : "bg-neutral-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                      localConfig.buttons.social.visible ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="pt-2 border-t border-neutral-200/50">
                  <MediaPickerField
                    labelEn="Button 3 Custom Image (Full Banner)"
                    labelAr="صورة الزر الثالث بالكامل (بيكو)"
                    currentValue={localConfig.buttons.social.imageUrl || ""}
                    onChange={(url) => handleButtonImageChange("social", url)}
                    lang="ar"
                    helperText="Upload or choose an image to fill the entire button. Icons/texts will be hidden if selected."
                    maxWidth={350}
                    maxHeight={250}
                    quality={0.7}
                  />
                </div>
              </div>

              {/* Midea Toggle */}
              <div className="flex flex-col gap-3 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-800">Button 4: San George Portal (سان جورج)</span>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 rounded-sm"
                        value={localConfig.buttons.midea?.labelEn || "San George"}
                        onChange={(e) => handleButtonLabelChange("midea", "En", e.target.value)}
                        placeholder="Label English"
                      />
                      <input
                        type="text"
                        className="px-2 py-1 text-3xs border border-neutral-200 text-right rounded-sm font-Cairo"
                        value={localConfig.buttons.midea?.labelAr || "سان جورج"}
                        onChange={(e) => handleButtonLabelChange("midea", "Ar", e.target.value)}
                        placeholder="العنوان بالعربية"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleButtonToggle("midea")}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      (localConfig.buttons.midea?.visible ?? true) ? "bg-brand-blue" : "bg-neutral-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                      (localConfig.buttons.midea?.visible ?? true) ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
                <div className="pt-2 border-t border-neutral-200/50">
                  <MediaPickerField
                    labelEn="Button 4 Custom Image (Full Banner)"
                    labelAr="صورة الزر الرابع بالكامل (سان جورج)"
                    currentValue={localConfig.buttons.midea?.imageUrl || ""}
                    onChange={(url) => handleButtonImageChange("midea", url)}
                    lang="ar"
                    helperText="Upload or choose an image to fill the entire button. Icons/texts will be hidden if selected."
                    maxWidth={350}
                    maxHeight={250}
                    quality={0.7}
                  />
                </div>
              </div>
            </div>
          </div>



          {/* SECTION 7: SAMSUNG AUTHORIZED PORTAL CONFIGURATION */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-blue-600 font-bold border-b border-neutral-100 pb-2">
              7. Samsung Authorized Portal Config (بيانات توكيل وصيانة سامسونج)
            </h3>
            <p className="text-3xs text-neutral-400">Configure dedicated contacts, showrooms, and map URLs for Samsung in Suez.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Telephone Number</label>
                <input
                  type="text"
                  name="samsungPhone"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.samsungPhone || ""}
                  onChange={handleInputChange}
                  placeholder="+20 100 234 5678"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung WhatsApp Number</label>
                <input
                  type="text"
                  name="samsungWhatsapp"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.samsungWhatsapp || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 201002345678"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Showroom Title (English)</label>
                <input
                  type="text"
                  name="samsungLocationNameEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.samsungLocationNameEn || ""}
                  onChange={handleInputChange}
                  placeholder="Samsung Showroom"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">عنوان مسمى معرض سامسونج (عربي)</label>
                <input
                  type="text"
                  name="samsungLocationNameAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.samsungLocationNameAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="معرض سامسونج المعتمد"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Street Address (English)</label>
                <input
                  type="text"
                  name="samsungLocationAddressEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.samsungLocationAddressEn || ""}
                  onChange={handleInputChange}
                  placeholder="El-Geish Street, Suez"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان التفصيلي للمعرض (عربي)</label>
                <input
                  type="text"
                  name="samsungLocationAddressAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.samsungLocationAddressAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="شارع الجيش، السويس"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL / Iframe src URL</label>
                <input
                  type="text"
                  name="samsungMapUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.samsungMapUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/maps?q=..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Facebook URL</label>
                <input
                  type="url"
                  name="samsungFacebookUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.samsungFacebookUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Samsung Instagram URL</label>
                <input
                  type="url"
                  name="samsungInstagramUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.samsungInstagramUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            {/* Samsung Showrooms Directory Repeater */}
            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-blue-600 font-bold font-Cairo">
                Samsung Showrooms & Branches List (فروع ومعارض سامسونج بالسويس)
              </h4>
              
              {/* Existing Samsung branches */}
              {(localConfig.samsungBranches || []).length > 0 ? (
                <div className="space-y-3">
                  {(localConfig.samsungBranches || []).map((b) => (
                    <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleDeleteSamsungBranch(b.id)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition rounded p-1 cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Showroom Name (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md focus:border-blue-600"
                            value={b.nameEn}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "nameEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">اسم المعرض/الفرع (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo font-semibold"
                            value={b.nameAr}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "nameAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Address Details (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                            value={b.addressEn}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "addressEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان بالتفصيل (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                            value={b.addressAr}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "addressAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Telephone Support</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                            value={b.phone}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "phone", e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Google Maps Embed URL</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                            value={b.mapUrl}
                            onChange={(e) => handleUpdateSamsungBranchField(b.id, "mapUrl", e.target.value)}
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-3xs text-neutral-400">No extra Samsung showrooms registered yet. Falls back to default singular location above.</p>
              )}

              {/* Form to add a new Samsung branch */}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1 font-Cairo">
                  <Plus className="w-3.5 h-3.5 text-blue-605 text-blue-600" />
                  <span>Add New Samsung Location (إضافة فرع/موقع لسامسونج)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Showroom Name (e.g. Samsung Suez Canal Mall)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newSamsungBranch.nameEn}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, nameEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="اسم المعرض بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newSamsungBranch.nameAr}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, nameAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Street Address (En)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newSamsungBranch.addressEn}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, addressEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="العنوان بالكامل بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newSamsungBranch.addressAr}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, addressAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Phone Support"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                    value={newSamsungBranch.phone}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Google Maps Embed URL"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                    value={newSamsungBranch.mapUrl}
                    onChange={(e) => setNewSamsungBranch({ ...newSamsungBranch, mapUrl: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNewSamsungBranch}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white font-bold text-2xs rounded transition cursor-pointer"
                >
                  Confirm Adding Samsung Location
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 8: BEKO AUTHORIZED PORTAL CONFIGURATION */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-red-600 font-bold border-b border-neutral-100 pb-2">
              8. Beko Authorized Portal Config (بيانات توكيل وصيانة بيكو)
            </h3>
            <p className="text-3xs text-neutral-400">Configure dedicated contacts, showrooms, and map URLs for Beko in Suez.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Telephone Number</label>
                <input
                  type="text"
                  name="bekoPhone"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.bekoPhone || ""}
                  onChange={handleInputChange}
                  placeholder="+20 155 987 6543"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko WhatsApp Number</label>
                <input
                  type="text"
                  name="bekoWhatsapp"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.bekoWhatsapp || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 201559876543"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Showroom Title (English)</label>
                <input
                  type="text"
                  name="bekoLocationNameEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.bekoLocationNameEn || ""}
                  onChange={handleInputChange}
                  placeholder="Beko Showroom"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">عنوان مسمى معرض بيكو (عربي)</label>
                <input
                  type="text"
                  name="bekoLocationNameAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.bekoLocationNameAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="معرض بيكو المعتمد"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Street Address (English)</label>
                <input
                  type="text"
                  name="bekoLocationAddressEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.bekoLocationAddressEn || ""}
                  onChange={handleInputChange}
                  placeholder="Suez Promenade, Suez"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان التفصيلي للمعرض (عربي)</label>
                <input
                  type="text"
                  name="bekoLocationAddressAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.bekoLocationAddressAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="ممشي السويس، السويس"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL / Iframe src URL</label>
                <input
                  type="text"
                  name="bekoMapUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.bekoMapUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/maps?q=..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Facebook URL</label>
                <input
                  type="url"
                  name="bekoFacebookUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.bekoFacebookUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Beko Instagram URL</label>
                <input
                  type="url"
                  name="bekoInstagramUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.bekoInstagramUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            {/* Beko Showrooms Directory Repeater */}
            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-red-600 font-bold font-Cairo">
                Beko Showrooms & Branches List (فروع ومعارض بيكو بالسويس)
              </h4>
              
              {/* Existing Beko branches */}
              {(localConfig.bekoBranches || []).length > 0 ? (
                <div className="space-y-3">
                  {(localConfig.bekoBranches || []).map((b) => (
                    <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleDeleteBekoBranch(b.id)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition rounded p-1 cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Showroom Name (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md focus:border-red-600"
                            value={b.nameEn}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "nameEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">اسم المعرض/الفرع (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo font-semibold"
                            value={b.nameAr}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "nameAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Address Details (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                            value={b.addressEn}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "addressEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان بالتفصيل (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                            value={b.addressAr}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "addressAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Telephone Support</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                            value={b.phone}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "phone", e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Google Maps Embed URL</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                            value={b.mapUrl}
                            onChange={(e) => handleUpdateBekoBranchField(b.id, "mapUrl", e.target.value)}
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-3xs text-neutral-400">No extra Beko showrooms registered yet. Falls back to default singular location above.</p>
              )}

              {/* Form to add a new Beko branch */}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1 font-Cairo">
                  <Plus className="w-3.5 h-3.5 text-red-650 text-red-600" />
                  <span>Add New Beko Location (إضافة فرع/موقع لبيكو)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Showroom Name (e.g. Beko Suez Promenade)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newBekoBranch.nameEn}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, nameEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="اسم المعرض بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newBekoBranch.nameAr}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, nameAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Street Address (En)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newBekoBranch.addressEn}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, addressEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="العنوان بالكامل بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newBekoBranch.addressAr}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, addressAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Phone Support"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                    value={newBekoBranch.phone}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Google Maps Embed URL"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                    value={newBekoBranch.mapUrl}
                    onChange={(e) => setNewBekoBranch({ ...newBekoBranch, mapUrl: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNewBekoBranch}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-750 text-white font-bold text-2xs rounded transition cursor-pointer"
                >
                  Confirm Adding Beko Location
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 8.5: MIDEA AUTHORIZED PORTAL CONFIGURATION */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-teal-600 font-bold border-b border-neutral-100 pb-2">
              8.5. San George Service Portal Config (بيانات توكيل وصيانة سان جورج)
            </h3>
            <p className="text-3xs text-neutral-400">Configure dedicated contacts, showrooms, and map URLs for San George in Suez.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George Telephone Number</label>
                <input
                  type="text"
                  name="mideaPhone"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.mideaPhone || ""}
                  onChange={handleInputChange}
                  placeholder="+20 122 345 6789"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George WhatsApp Number</label>
                <input
                  type="text"
                  name="mideaWhatsapp"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono"
                  value={localConfig.mideaWhatsapp || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 201223456789"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George Showroom Title (English)</label>
                <input
                  type="text"
                  name="mideaLocationNameEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.mideaLocationNameEn || ""}
                  onChange={handleInputChange}
                  placeholder="San George Showroom"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">عنوان مسمى معرض سان جورج (عربي)</label>
                <input
                  type="text"
                  name="mideaLocationNameAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.mideaLocationNameAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="معرض سان جورج المعتمد"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George Street Address (English)</label>
                <input
                  type="text"
                  name="mideaLocationAddressEn"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg"
                  value={localConfig.mideaLocationAddressEn || ""}
                  onChange={handleInputChange}
                  placeholder="Port Said Street, Suez"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان التفصيلي للمعرض (عربي)</label>
                <input
                  type="text"
                  name="mideaLocationAddressAr"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg font-Cairo"
                  value={localConfig.mideaLocationAddressAr || ""}
                  onChange={handleInputChange}
                  dir="rtl"
                  placeholder="شارع بورسعيد، السويس"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">Google Maps embed URL / Iframe src URL</label>
                <input
                  type="text"
                  name="mideaMapUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.mideaMapUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/maps?q=..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George Facebook URL</label>
                <input
                  type="url"
                  name="mideaFacebookUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.mideaFacebookUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-neutral-400 block uppercase">San George Instagram URL</label>
                <input
                  type="url"
                  name="mideaInstagramUrl"
                  className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg font-mono text-xs"
                  value={localConfig.mideaInstagramUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            {/* Midea Showrooms Directory Repeater */}
            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-4">
              <h4 className="text-2xs uppercase tracking-wider text-teal-600 font-bold font-Cairo">
                San George Showrooms & Branches List (فروع ومعارض سان جورج بالسويس)
              </h4>
              
              {/* Existing Midea branches */}
              {(localConfig.mideaBranches || []).length > 0 ? (
                <div className="space-y-3">
                  {(localConfig.mideaBranches || []).map((b) => (
                    <div key={b.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleDeleteMideaBranch(b.id)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition rounded p-1 cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Showroom Name (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md focus:border-teal-600"
                            value={b.nameEn}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "nameEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">اسم المعرض/الفرع (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo font-semibold"
                            value={b.nameAr}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "nameAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Address Details (En)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                            value={b.addressEn}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "addressEn", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs font-Cairo font-semibold text-neutral-400 block text-right">العنوان بالتفصيل (عربي)</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                            value={b.addressAr}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "addressAr", e.target.value)}
                            dir="rtl"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Telephone Support</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                            value={b.phone}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "phone", e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Google Maps Embed URL</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                            value={b.mapUrl}
                            onChange={(e) => handleUpdateMideaBranchField(b.id, "mapUrl", e.target.value)}
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-3xs text-neutral-400">No extra San George showrooms registered yet. Falls back to default singular location above.</p>
              )}

              {/* Form to add a new Midea branch */}
              <div className="border border-dashed border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50 space-y-3">
                <span className="text-2xs font-bold text-neutral-800 flex items-center gap-1 font-Cairo">
                  <Plus className="w-3.5 h-3.5 text-teal-650 text-teal-600" />
                  <span>Add New San George Location (إضافة فرع/موقع لسان جورج)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Showroom Name (e.g. San George Suez)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newMideaBranch.nameEn}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, nameEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="اسم المعرض بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newMideaBranch.nameAr}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, nameAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Street Address (En)"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md"
                    value={newMideaBranch.addressEn}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, addressEn: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="العنوان بالكامل بالعربية"
                    className="w-full px-2 py-1 text-xs text-right border border-neutral-200 rounded-md font-Cairo"
                    value={newMideaBranch.addressAr}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, addressAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="text"
                    placeholder="Phone Support"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono"
                    value={newMideaBranch.phone}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Google Maps Embed URL"
                    className="w-full px-2 py-1 text-xs border border-neutral-200 rounded-md font-mono text-3xs"
                    value={newMideaBranch.mapUrl}
                    onChange={(e) => setNewMideaBranch({ ...newMideaBranch, mapUrl: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNewMideaBranch}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-750 text-white font-bold text-2xs rounded transition cursor-pointer"
                >
                  Confirm Adding San George Location
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 9: COMMERCE BRANDS MANAGER */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#172995] font-bold border-b border-neutral-100 pb-2">
              9. Authorized Brands Board (إدارة الماركات واللوجوهات المعتمدة)
            </h3>

            {/* Visual list of brands with logo previews */}
            {localConfig.brands.length === 0 ? (
              <p className="text-xs text-neutral-400 py-2">No commercial brands added yet. (لا توجد ماركات مضافة حالياً)</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
                {localConfig.brands.map((brand) => (
                  <div key={brand.id} className="relative group bg-neutral-50 p-4 border border-neutral-200/65 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveBrand(brand.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-white text-neutral-400 hover:text-red-500 rounded-lg border border-neutral-100 shadow-3xs cursor-pointer hover:scale-105 transition"
                      title={`Remove ${brand.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {brand.logoUrl ? (
                      <div className="h-10 flex items-center justify-center bg-white rounded-lg p-1 border border-neutral-100 w-full">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="max-h-8 max-w-[80px] object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="h-10 flex items-center justify-center bg-neutral-100 rounded-lg p-1 border border-neutral-200/30 w-full">
                        <span className="text-4xs text-neutral-400 font-bold uppercase tracking-widest truncate">{brand.name}</span>
                      </div>
                    )}
                    <span className="block text-[10px] font-bold text-neutral-700 truncate w-full mt-1">{brand.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Inline creation block */}
            <div className="bg-neutral-50/50 p-4 border border-neutral-200/60 rounded-xl space-y-4 mt-4">
              <span className="block text-2xs uppercase tracking-wider text-neutral-400 font-bold">Add New Commercial Partner (إضافة توكيل/ماركة جديدة)</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 justify-center flex flex-col">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Brand Name (اسم التوكيل)</label>
                  <input
                    type="text"
                    placeholder="e.g. Panasonic"
                    className="w-full px-3 py-2 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-brand-blue"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddBrand(); } }}
                  />
                </div>
                <div>
                  <MediaPickerField
                    labelEn="Brand Logo Badge"
                    labelAr="لوجو الماركة الشريكة (لوجو)"
                    currentValue={newBrandLogoUrl}
                    onChange={(url) => setNewBrandLogoUrl(url)}
                    lang="ar"
                    helperText="Upload/Choose picture. This will represent the brand logo in top marquee strip."
                    uploadButtonLabelAr="رفع لوجو التوكيل مباشرة"
                    uploadButtonLabelEn="Upload Brand Logo Directly"
                    maxWidth={200}
                    maxHeight={120}
                    quality={0.7}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                   type="button"
                   onClick={handleAddBrand}
                   className="px-4 py-2 bg-brand-blue text-white text-xs font-bold hover:bg-[#11207e] rounded-lg transition shadow-xs cursor-pointer"
                >
                  Add Partner Brand (حفظ الماركة)
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 10: OFFERS & DISCOUNTS BOARD */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-emerald-600 font-bold border-b border-neutral-100 pb-2">
              10. Deals & Special Offers (إدارة العروض والخصومات والصفقات الحالية)
            </h3>
            <p className="text-3xs text-neutral-400">Configure promotional campaigns, seasonal discounts, and deals for customers in Suez.</p>

            {/* List of current configure offers */}
            {(!localConfig.offers || localConfig.offers.length === 0) ? (
              <p className="text-xs text-neutral-400 py-2">No promotional offers active. (لا توجد عروض ترويجية نشطة حالياً)</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localConfig.offers.map((offer) => (
                  <div key={offer.id} className="relative bg-neutral-50 p-4 border border-neutral-200/65 rounded-xl flex gap-4">
                    {offer.imageUrl && (
                      <img
                        src={offer.imageUrl}
                        alt={offer.titleEn}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {offer.badgeAr && (
                          <span className="text-[10px] font-Cairo font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                            {offer.badgeAr}
                          </span>
                        )}
                        <h4 className="font-bold text-xs text-neutral-800 truncate">{offer.titleAr}</h4>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-Cairo leading-snug line-clamp-2">{offer.descriptionAr}</p>
                      <div className="text-[9px] text-neutral-400 font-mono flex flex-wrap gap-2 pt-1 border-t border-neutral-200/50">
                        {offer.phone && <span>📞 {offer.phone}</span>}
                        {offer.whatsapp && <span>💬 {offer.whatsapp}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOffer(offer.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white text-neutral-400 hover:text-red-500 rounded-lg border border-neutral-150 hover:border-red-200 shadow-3xs cursor-pointer hover:scale-105 transition"
                      title="Remove offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form for new offer addition */}
            <div className="bg-neutral-50/50 p-4 border border-neutral-200/60 rounded-xl space-y-4 mt-2">
              <span className="block text-2xs uppercase tracking-wider text-neutral-400 font-bold">Create New Deal (إضافة عرض صفقة جديد)</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Offer Title (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15% Off Beko Dryers"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newOfferTitleEn}
                    onChange={(e) => setNewOfferTitleEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">عنوان العرض باللغة العربية (مطلوب)</label>
                  <input
                    type="text"
                    placeholder="مثال: خصم ١٥٪ على مجففات بيكو"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo"
                    dir="rtl"
                    value={newOfferTitleAr}
                    onChange={(e) => setNewOfferTitleAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Offer Details (English)</label>
                  <textarea
                    placeholder="Describe the promotion guidelines, model names, specific terms..."
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white resize-none"
                    value={newOfferDescEn}
                    onChange={(e) => setNewOfferDescEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">تفاصيل وشروط العرض بالعربي (مطلوب)</label>
                  <textarea
                    placeholder="تفاصيل العرض، الموديلات المشمولة، طريقة الحصول عليه..."
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo resize-none"
                    dir="rtl"
                    value={newOfferDescAr}
                    onChange={(e) => setNewOfferDescAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Badge Text (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Free Delivery"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newOfferBadgeEn}
                    onChange={(e) => setNewOfferBadgeEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">نص الشارة/العلامة بالعربية (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: شحن مجاني"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo"
                    dir="rtl"
                    value={newOfferBadgeAr}
                    onChange={(e) => setNewOfferBadgeAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Offer Hotline (Optional override)</label>
                  <input
                    type="text"
                    placeholder="e.g. +20 122..."
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white font-mono"
                    value={newOfferPhone}
                    onChange={(e) => setNewOfferPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Offer Whatsapp (Optional override)</label>
                  <input
                    type="text"
                    placeholder="e.g. 20122..."
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white font-mono"
                    value={newOfferWhatsapp}
                    onChange={(e) => setNewOfferWhatsapp(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <MediaPickerField
                    labelEn="Offer Image Showcase"
                    labelAr="صورة توضيحية أو ملصق العرض"
                    currentValue={newOfferImageUrl}
                    onChange={(url) => setNewOfferImageUrl(url)}
                    lang="ar"
                    helperText="Upload or select a promotion card, product graphic, or discount poster."
                    uploadButtonLabelAr="رفع صورة للعرض مباشرة"
                    uploadButtonLabelEn="Upload Promo Image"
                    maxWidth={600}
                    maxHeight={450}
                    quality={0.75}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-200/50">
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Active Offer (إضافة العرض الجديد لوحة العروض)</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 11: CLIENT TESTIMONIALS BOARD */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200/60 shadow-2xs space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-indigo-600 font-bold border-b border-neutral-100 pb-2">
              11. Client Testimonials (إدارة آراء وتقييمات العملاء)
            </h3>
            <p className="text-3xs text-neutral-400">Configure client testimonials, customer feedbacks, and corporate reviews to display on the landing page.</p>

            {/* List of current testimonials */}
            {(!localConfig.testimonials || localConfig.testimonials.length === 0) ? (
              <p className="text-xs text-neutral-400 py-2">No testimonials created yet. (لا توجد آراء عملاء مضافة حالياً)</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localConfig.testimonials.map((testi) => (
                  <div key={testi.id} className="relative bg-neutral-50 p-4 border border-neutral-200/65 rounded-xl flex gap-4">
                    {testi.imageUrl && (
                      <img
                        src={testi.imageUrl}
                        alt={testi.authorNameEn}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-neutral-800 truncate">{testi.authorNameAr} ({testi.authorNameEn})</h4>
                        <button
                          type="button"
                          onClick={() => handleRemoveTestimonial(testi.id)}
                          className="bg-neutral-100 hover:bg-red-50 hover:text-red-500 text-neutral-400 p-1.5 rounded-lg transition shrink-0 cursor-pointer"
                          title="Remove Testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] font-semibold text-neutral-500 font-Cairo leading-none">{testi.authorTitleAr || testi.authorTitleEn}</p>
                      <div className="flex gap-0.5 text-amber-500 py-0.5">
                        {Array.from({ length: testi.rating }).map((_, idx) => (
                          <span key={idx} className="text-xs">★</span>
                        ))}
                      </div>
                      <p className="text-[10px] text-neutral-650 text-neutral-700 font-Cairo leading-snug line-clamp-3 italic text-right" dir="rtl">"{testi.feedbackAr}"</p>
                      <p className="text-[9px] text-neutral-500 font-sans leading-snug line-clamp-2 italic">"{testi.feedbackEn}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Testimonial Form */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/50 space-y-4">
              <h4 className="text-xs font-bold text-neutral-700 border-b border-neutral-200/50 pb-1.5 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-500" />
                Add New Customer Feedback (إضافة رأي عميل جديد)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Author Name (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Captain Adel El-Sersawy"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newTestiNameEn}
                    onChange={(e) => setNewTestiNameEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">اسم صاحب التقييم بالعربية</label>
                  <input
                    type="text"
                    placeholder="مثال: كابتن عادل السرساوي"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo"
                    dir="rtl"
                    value={newTestiNameAr}
                    onChange={(e) => setNewTestiNameAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Author Title/Company (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Director, Suez Marine Services"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newTestiTitleEn}
                    onChange={(e) => setNewTestiTitleEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">المسمى الوظيفي أو الشركة بالعربية</label>
                  <input
                    type="text"
                    placeholder="مثال: مدير شركة السويس للخدمات البحرية"
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo"
                    dir="rtl"
                    value={newTestiTitleAr}
                    onChange={(e) => setNewTestiTitleAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Feedback/Review (English)</label>
                  <textarea
                    rows={2}
                    placeholder="Provide customer experience details..."
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newTestiFeedbackEn}
                    onChange={(e) => setNewTestiFeedbackEn(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-Cairo font-semibold text-neutral-400 block text-right">الرأي أو التجربة بالعربية</label>
                  <textarea
                    rows={2}
                    placeholder="اكتب التقييم ورأي العميل بالتفصيل..."
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 text-right border border-neutral-200 rounded-lg bg-white font-Cairo"
                    dir="rtl"
                    value={newTestiFeedbackAr}
                    onChange={(e) => setNewTestiFeedbackAr(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">Stars Rating (التقييم بالنجوم)</label>
                  <select
                    className="w-full px-3 py-1.5 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-white"
                    value={newTestiRating}
                    onChange={(e) => setNewTestiRating(Number(e.target.value))}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <MediaPickerField
                    labelEn="Client Avatar/Photo"
                    labelAr="صورة العميل أو شعار شركته"
                    currentValue={newTestiImageUrl}
                    onChange={(url) => setNewTestiImageUrl(url)}
                    lang="ar"
                    helperText="Upload or select a square avatar photo, portrait background, or custom profile image."
                    uploadButtonLabelAr="رفع صورة رمزية للعميل"
                    uploadButtonLabelEn="Upload Client Avatar"
                    maxWidth={128}
                    maxHeight={128}
                    quality={0.7}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-200/50">
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial (إضافة تقييم العميل لآرائنا المعروضة)</span>
                </button>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200/60 flex items-start gap-3 animate-fade-in text-xs font-semibold" dir={lang === "ar" ? "rtl" : "ltr"}>
              <span className="text-base shrink-0">⚠️</span>
              <div className="flex-1">
                <p className={lang === "ar" ? "font-Cairo font-black text-right" : "font-sans font-extrabold text-left"}>
                  {lang === "ar" ? "فشل الحفظ في قاعدة البيانات" : "Database Sync Failed"}
                </p>
                <p className={`mt-1 font-medium text-slate-600 ${lang === "ar" ? "text-right font-Cairo" : "text-left"}`}>
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {/* Action Footer Button Rails */}
          <div className="bg-white rounded-xl p-4 border border-neutral-200/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onReset}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-red-50 hover:text-red-600 border border-neutral-250 border-neutral-200 text-xs font-bold text-neutral-600 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset UI Defaults (استعادة الافتراضي)</span>
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExit}
                disabled={isSaving}
                className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Changes
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold rounded-lg shadow-sm transition cursor-pointer ${
                  isSaving 
                    ? "bg-neutral-450 bg-neutral-400 text-neutral-100 cursor-not-allowed opacity-80" 
                    : "bg-brand-blue text-white hover:bg-brand-blue-hover"
                }`}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {isSaving 
                    ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") 
                    : (lang === "ar" ? "حفظ الإعدادات" : "Save Database Settings")}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Floating Save message */}
        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3 rounded-xl shadow-lg border border-neutral-800 animate-slide-up text-xs font-bold">
            🎉 {successMsg}
          </div>
        )}
      </div>

      {/* Central Global Media Vault Manager dialog popup */}
      {isGlobalMediaManagerOpen && (
        <MediaManager
          lang="ar"
          onClose={() => setIsGlobalMediaManagerOpen(false)}
        />
      )}
    </div>
  );
};
