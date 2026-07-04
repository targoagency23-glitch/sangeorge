import React, { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Search, Trash2, Edit2, RotateCw, RefreshCw, X, FolderOpen, Calendar, HardDrive, Check, Crop, Sliders, ChevronRight, ChevronLeft, Layers } from "lucide-react";

// DB Interface and Initialization
export interface MediaLibraryItem {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // Compressed Base64 data
  width: number;
  height: number;
  createdAt: string;
}

const DB_NAME = "SanGeorgeMediaDB_v2";
const STORE_NAME = "media_assets";

export const initMediaDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export const loadMediaItemsFromDB = async (): Promise<MediaLibraryItem[]> => {
  try {
    const db = await initMediaDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        // Sort descending by creation date
        const results = request.result || [];
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to load items from DB:", err);
    return [];
  }
};

export const saveMediaItemToDB = async (item: MediaLibraryItem): Promise<void> => {
  const db = await initMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteMediaItemFromDB = async (id: string): Promise<void> => {
  const db = await initMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Client Side Optimization and Compression helper (Disabled automatic compression to keep 100% original quality)
export const compressImage = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<{ dataUrl: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        // Resolve with the original natural dimensions and untouched Data URL for 100% original quality
        resolve({ 
          dataUrl, 
          width: img.naturalWidth || img.width || maxWidth, 
          height: img.naturalHeight || img.height || maxHeight 
        });
      };
      img.onerror = () => {
        resolve({ dataUrl, width: maxWidth, height: maxHeight });
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

export const compressBase64 = (
  dataUrl: string,
  _maxWidth = 1000,
  _maxHeight = 1000,
  _quality = 0.8
): Promise<string> => {
  // Directly return the original Base64/data URL to prevent quality degradation
  return Promise.resolve(dataUrl);
};

// Formatting helpers
export const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// --- IMAGE EDITOR COMPONENT ---
interface ImageEditorProps {
  item: MediaLibraryItem;
  onSave: (updatedItem: MediaLibraryItem) => void;
  onClose: () => void;
  lang?: "ar" | "en";
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ item, onSave, onClose, lang = "en" }) => {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  // Crop settings: percentages from borders
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  
  const [aspectRatio, setAspectRatio] = useState<"free" | "1:1" | "16:9" | "4:3">("free");
  const [savingState, setSavingState] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Load actual image
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = item.dataUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgObj(img);
    };
  }, [item]);

  // Handle preset aspect ratios adjustments
  const applyAspectPreset = (preset: typeof aspectRatio) => {
    setAspectRatio(preset);
    if (preset === "1:1") {
      setCropLeft(15);
      setCropRight(15);
      setCropTop(15);
      setCropBottom(15);
    } else if (preset === "16:9") {
      setCropLeft(5);
      setCropRight(5);
      setCropTop(22);
      setCropBottom(22);
    } else if (preset === "4:3") {
      setCropLeft(10);
      setCropRight(10);
      setCropTop(17);
      setCropBottom(17);
    } else {
      setCropLeft(0);
      setCropRight(0);
      setCropTop(0);
      setCropBottom(0);
    }
  };

  // Re-draw canvas preview on sliders change
  useEffect(() => {
    if (!imgObj || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Direct measurements
    const origW = imgObj.width;
    const origH = imgObj.height;

    // Define output canvas coordinates based on rotation sizing
    const is90or270 = rotation % 180 !== 0;
    const virtualW = is90or270 ? origH : origW;
    const virtualH = is90or270 ? origW : origH;

    // Determine Crop pixel bounding box
    const pixelLeft = Math.floor((cropLeft / 100) * virtualW);
    const pixelRight = Math.floor((cropRight / 100) * virtualW);
    const pixelTop = Math.floor((cropTop / 100) * virtualH);
    const pixelBottom = Math.floor((cropBottom / 100) * virtualH);

    const croppedWidth = Math.max(10, virtualW - pixelLeft - pixelRight);
    const croppedHeight = Math.max(10, virtualH - pixelTop - pixelBottom);

    canvas.width = croppedWidth;
    canvas.height = croppedHeight;

    ctx.clearRect(0, 0, croppedWidth, croppedHeight);

    // Save context state for complex translations
    ctx.save();

    // Map crop top-left to viewport coordinates
    ctx.translate(-pixelLeft, -pixelTop);

    // Dynamic rotation & flips around image center
    ctx.translate(virtualW / 2, virtualH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-origW / 2, -origH / 2);

    ctx.drawImage(imgObj, 0, 0);
    ctx.restore();
  }, [imgObj, rotation, flipH, flipV, cropLeft, cropRight, cropTop, cropBottom]);

  const handleApplyChanges = async () => {
    if (!previewCanvasRef.current || !imgObj) return;
    setSavingState(true);

    try {
      const canvas = previewCanvasRef.current;
      const dataUrl = canvas.toDataURL(item.type, 0.85);

      const updated: MediaLibraryItem = {
        ...item,
        dataUrl,
        size: Math.round((dataUrl.length * 3) / 4), // Approximate bytes size
        width: canvas.width,
        height: canvas.height,
        createdAt: new Date().toISOString() // Marked updated
      };

      await saveMediaItemToDB(updated);
      onSave(updated);
    } catch (e) {
      console.error("Failed to edit image on canvas:", e);
    } finally {
      setSavingState(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-neutral-950/70 p-4 font-sans text-neutral-800">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header toolbar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex justify-between items-center shrink-0">
          <div>
            <h4 className="text-sm font-bold tracking-tight flex items-center gap-2">
              <Crop className="w-4 h-4 text-brand-blue" />
              {lang === "en" ? `Fine-tune and Edit: ${item.name}` : `تعديل وضبط جودة الصورة: ${item.name}`}
            </h4>
            <p className="text-4xs text-neutral-400 mt-0.5 font-mono">
              {item.width}x{item.height} px • {formatBytes(item.size)}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 text-neutral-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Panels body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Canvas View Column */}
          <div className="lg:col-span-8 bg-neutral-100 p-6 flex flex-col items-center justify-center relative min-h-[250px] md:min-h-[380px]">
            {!imgObj ? (
              <div className="flex flex-col items-center gap-2 text-neutral-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-xs">{lang === "en" ? "Loading workspace..." : "جاري تحميل محرك التعديل..."}</span>
              </div>
            ) : (
              <div className="relative max-w-full max-h-[45vh] bg-neutral-900 rounded-xl p-2 border border-neutral-200 shadow-xl flex items-center justify-center overflow-auto">
                <canvas 
                  ref={previewCanvasRef} 
                  className="max-w-full max-h-[40vh] object-contain rounded-lg"
                  style={{ display: "block" }} 
                />
              </div>
            )}
            <p className="text-4xs text-neutral-400 absolute bottom-2 font-mono uppercase tracking-widest">
              Live Canvas Frame Buffer
            </p>
          </div>

          {/* Editors parameters Column */}
          <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-neutral-100 bg-neutral-50/50 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              {/* Transforms Box */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#172995] uppercase tracking-wider block">
                  {lang === "en" ? "Transform Controls" : "عمليات الدوران والانعكاس"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex flex-col items-center justify-center p-2.5 bg-white border border-neutral-200 hover:border-brand-blue/30 rounded-xl text-xs font-semibold hover:bg-brand-blue/5 transition text-neutral-700"
                  >
                    <RotateCw className="w-4 h-4 text-[#172995] mb-1" />
                    <span>90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipH(!flipH)}
                    className={`flex flex-col items-center justify-center p-2.5 bg-white border rounded-xl text-xs font-semibold hover:bg-brand-blue/5 transition text-neutral-700 ${flipH ? "border-[#172995] bg-[#172995]/5" : "border-neutral-200"}`}
                  >
                    <Layers className="w-4 h-4 text-[#172995] mb-1 transform rotate-90" />
                    <span>Flip H</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipV(!flipV)}
                    className={`flex flex-col items-center justify-center p-2.5 bg-white border rounded-xl text-xs font-semibold hover:bg-brand-blue/5 transition text-neutral-700 ${flipV ? "border-[#172995] bg-[#172995]/5" : "border-neutral-200"}`}
                  >
                    <Layers className="w-4 h-4 text-[#172995] mb-1" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>

              {/* Crop Aspect Ratio Presets */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#172995] uppercase tracking-wider block">
                  {lang === "en" ? "Aspect Ratio Crop" : "أبعاد واقتصاص الحواف المسبقة"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(["free", "1:1", "16:9", "4:3"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => applyAspectPreset(ratio)}
                      className={`py-1.5 px-3 border rounded-lg text-[11px] font-bold uppercase tracking-wider transition text-center ${aspectRatio === ratio ? "bg-[#172995] text-white border-[#172995] shadow-xs" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"}`}
                    >
                      {ratio === "free" ? (lang === "en" ? "Full / Free" : "حر (الكامل)") : ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Crop Sliders */}
              <div className="space-y-4 bg-white p-4 border border-neutral-200/60 rounded-xl">
                <span className="text-[10px] font-bold text-[#172995] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  {lang === "en" ? "Fine Custom Crop Sliders" : "شريط التحكم بالهوامش والحدود"}
                </span>
                
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-3xs text-neutral-400 font-bold mb-1">
                      <span>LEFT MARGIN</span>
                      <span>{cropLeft}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      value={cropLeft}
                      onChange={(e) => setCropLeft(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#172995]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-3xs text-neutral-400 font-bold mb-1">
                      <span>RIGHT MARGIN</span>
                      <span>{cropRight}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      value={cropRight}
                      onChange={(e) => setCropRight(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#172995]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-3xs text-neutral-400 font-bold mb-1">
                      <span>TOP MARGIN</span>
                      <span>{cropTop}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      value={cropTop}
                      onChange={(e) => setCropTop(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#172995]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-3xs text-neutral-400 font-bold mb-1">
                      <span>BOTTOM MARGIN</span>
                      <span>{cropBottom}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      value={cropBottom}
                      onChange={(e) => setCropBottom(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#172995]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom save bar */}
            <div className="pt-4 border-t border-neutral-100 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-1.5 text-xs font-bold text-neutral-500 bg-neutral-100 hover:bg-neutral-100/80 rounded-lg transition"
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                type="button"
                disabled={savingState}
                onClick={handleApplyChanges}
                className="flex-grow flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold bg-[#172995] text-white hover:bg-[#11207e] rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {savingState ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {lang === "en" ? "Apply & Save" : "حفظ التغييرات"}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


// --- CENTRALIZED MEDIA LIBRARY DIALOG ---
interface MediaManagerProps {
  onSelectImage?: (url: string) => void;
  onClose: () => void;
  lang?: "ar" | "en";
}

export const MediaManager: React.FC<MediaManagerProps> = ({ onSelectImage, onClose, lang = "ar" }) => {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Tab controller: "browse" or "upload"
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  
  // Multi-file state simulation with progress bar
  const [uploadFiles, setUploadFiles] = useState<{ id: string; name: string; size: number; progress: number; status: "loading" | "done" | "error" }[]>([]);
  
  // Image Editor popup
  const [editingItem, setEditingItem] = useState<MediaLibraryItem | null>(null);

  // File drag drop areas refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      const dbItems = await loadMediaItemsFromDB();
      setItems(dbItems);
      if (dbItems.length > 0 && !selectedItemId) {
        setSelectedItemId(dbItems[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processAndUploadFiles(Array.from(files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAndUploadFiles(Array.from(files));
    }
  };

  // Modern process flow with dynamic compression to avoid browser limits
  const processAndUploadFiles = async (filesBlob: File[]) => {
    const validFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif", "image/avif"];
    const verified = filesBlob.filter(f => validFormats.includes(f.type) || f.name.endsWith(".avif"));

    if (verified.length === 0) {
      alert("Invalid format. Please support JPEG, PNG, WEBP, SVG, GIF, or AVIF images only.");
      return;
    }

    setActiveTab("browse");

    const batch = verified.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: f.name.replace(/\.[^/.]+$/, ""), // remove ext for representation
      size: f.size,
      progress: 10,
      status: "loading" as const
    }));

    setUploadFiles((prev) => [...batch, ...prev]);

    for (let i = 0; i < verified.length; i++) {
      const file = verified[i];
      const trackingId = batch[i].id;

      try {
        // Step 1: reading simulation indicator
        setUploadFiles((prev) => prev.map((u) => u.id === trackingId ? { ...u, progress: 40 } : u));
        
        // Step 2: Canvas resizing and compression
        const result = await compressImage(file, 900, 900, 0.8);
        
        setUploadFiles((prev) => prev.map((u) => u.id === trackingId ? { ...u, progress: 80 } : u));

        const newItem: MediaLibraryItem = {
          id: `media-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: file.type || "image/jpeg",
          size: Math.round((result.dataUrl.length * 3) / 4), // size in bytes
          dataUrl: result.dataUrl,
          width: result.width,
          height: result.height,
          createdAt: new Date().toISOString()
        };

        // Saving directly to fast IndexedDB store
        await saveMediaItemToDB(newItem);

        // Success state
        setUploadFiles((prev) => prev.map((u) => u.id === trackingId ? { ...u, progress: 100, status: "done" } : u));
        
        setItems((prev) => [newItem, ...prev]);
        setSelectedItemId(newItem.id);

      } catch (err) {
        console.error("Optimized upload failed:", err);
        setUploadFiles((prev) => prev.map((u) => u.id === trackingId ? { ...u, status: "error" } : u));
      }
    }

    // Auto-clear helper items in 4 seconds
    setTimeout(() => {
      setUploadFiles((prev) => prev.filter(p => !batch.some(b => b.id === p.id)));
    }, 4000);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm(lang === "en" ? "Are you sure you want to delete this asset permanently?" : "هل أنت متأكد من حذف هذه الصورة/الملف نهائياً؟")) return;
    try {
      await deleteMediaItemFromDB(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItemId === id) {
        setSelectedItemId(items.find((item) => item.id !== id)?.id || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateName = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    try {
      const found = items.find((i) => i.id === id);
      if (found) {
        const updated = { ...found, name: newName.trim() };
        await saveMediaItemToDB(updated);
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Search filtering
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-3xs font-sans text-neutral-800" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP MAIN TOOLBARS */}
        <div className="px-6 py-4 border-b border-neutral-150 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 tracking-tight font-display">
                {lang === "en" ? "Corporate Media Library" : "المستودع الرقمي ومكتبة ملفات سان جورج"}
              </h3>
              <p className="text-4xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                {lang === "en" ? "Centralized Asset Hub" : "منصة الحفظ اللوجستي المركزي للوسائط"}
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className="self-end sm:self-center p-2 hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE DIRECTORY MENU */}
        <div className="px-6 bg-white border-b border-neutral-100 flex items-center justify-between py-2 shrink-0 overflow-x-auto gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "browse" ? "bg-neutral-100 text-[#172995]" : "text-neutral-500 hover:bg-neutral-50"}`}
            >
              {lang === "en" ? "Browse Items" : "استعراض الملفات والأصول"}
            </button>
            <button
              onClick={() => {
                setActiveTab("upload");
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "upload" ? "bg-neutral-100 text-[#172995]" : "text-neutral-500 hover:bg-neutral-50"}`}
            >
              {lang === "en" ? "Upload Files" : "رفع ملفات جديدة"}
            </button>
          </div>

          {/* Search trigger bar */}
          <div className="relative max-w-xs w-full">
            <Search className={`w-4 h-4 text-neutral-450 absolute top-2 ${lang === "ar" ? "right-3" : "left-3"}`} />
            <input
              type="text"
              placeholder={lang === "en" ? "Search media files..." : "بحث باسم الملف المرفق..."}
              className={`w-full py-1 text-xs bg-neutral-100 border border-neutral-200/50 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#172995]/50 ${lang === "ar" ? "pr-9 pl-4 text-right" : "pl-9 pr-4 text-left"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN MULTI PANEL DESK */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT CONTENT GALLERY VIEW */}
          <div 
            className={`flex-1 overflow-y-auto p-6 ${dragOver ? "bg-brand-blue/5 border-2 border-dashed border-brand-blue" : "bg-neutral-50/40"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Direct multi progress upload status lines */}
            {uploadFiles.length > 0 && (
              <div className="mb-6 p-4 bg-white border border-[#172995]/20 rounded-xl space-y-3 shadow-3xs">
                <span className="text-[10px] font-bold text-[#172995] uppercase tracking-wider block">
                  {lang === "en" ? "ACTIVE PROCESSING LINE" : "جاري ضغط ومعالجة الصور المرفقة"}
                </span>
                <div className="space-y-2">
                  {uploadFiles.map((up) => (
                    <div key={up.id} className="flex items-center justify-between text-xs gap-4">
                      <span className="font-medium text-neutral-700 truncate max-w-xs">{up.name}</span>
                      <div className="flex-1 max-w-xs bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-350 ${up.status === "error" ? "bg-red-500" : "bg-[#172995]"}`}
                          style={{ width: `${up.progress}%` }}
                        />
                      </div>
                      <span className="text-3xs text-neutral-400 font-semibold uppercase">{up.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#172995] mb-2" />
                <span className="text-xs font-bold uppercase">{lang === "en" ? "Reading assets store..." : "جاري فك تشفير مستودع الأصول..."}</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 rounded-xl bg-white">
                <ImageIcon className="w-12 h-12 text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-neutral-400 mb-1">
                  {searchQuery ? (lang === "en" ? "No matching files found." : "لا توجد نتائج بحث مطابقة.") : (lang === "en" ? "Media Library is currently empty." : "لا توجد ملفات مرفوعة حالياً في المكتبة.")}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-white bg-[#172995] hover:bg-[#11207e] font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-3xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "Choose files to Upload" : "اختر ملفات لرفع الصّور"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredItems.map((item) => {
                  const isCurSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`group relative aspect-square bg-white border rounded-xl overflow-hidden cursor-pointer shadow-3xs hover:shadow-xs hover:border-brand-blue/40 transition-all ${isCurSelected ? "ring-2 ring-[#172995] border-[#172995]" : "border-neutral-200"}`}
                    >
                      {/* Selection Badge indicator */}
                      {isCurSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#172995] text-white p-1 rounded-full z-10 shadow-3xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className="w-full h-full flex items-center justify-center p-2.5 bg-neutral-100/50">
                        <img
                          src={item.dataUrl}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-3xs transition-transform group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* File details overlay strip */}
                      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/75 px-2.5 py-1 text-[10px] text-white truncate text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* RIGHT PANELS DETAILS VIEW */}
          {selectedItem && (
            <div className={`w-full md:w-80 border-t md:border-t-0 md:border-l ${lang === "ar" ? "border-r border-neutral-150 text-right" : "border-l border-neutral-150 text-left"} bg-white p-5 flex flex-col justify-between overflow-y-auto shrink-0 font-sans`}>
              <div className="space-y-5">
                
                {/* Visual Header Detail box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#172995] uppercase tracking-wider block">
                    {lang === "en" ? "ASSETS METRICS" : "معايير وحجم الملف"}
                  </span>
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60 flex items-center justify-center aspect-video relative">
                    <img 
                      src={selectedItem.dataUrl} 
                      alt={selectedItem.name} 
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Meta details list */}
                <div className="space-y-3.5 text-xs text-neutral-600">
                  <div className="space-y-1">
                    <label className="text-3xs uppercase tracking-wider text-neutral-400 block font-bold">File Reference Name</label>
                    <input
                      type="text"
                      className={`w-full px-2 py-1 text-xs text-neutral-800 border border-neutral-200 rounded-lg bg-neutral-55 focus:bg-white focus:outline-none ${lang === "ar" ? "text-right" : "text-left"}`}
                      value={selectedItem.name}
                      onChange={(e) => handleUpdateName(selectedItem.id, e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-neutral-50 px-3 py-2 border border-neutral-100 rounded-lg font-mono text-[10px]">
                    <div>
                      <span className="text-4xs text-neutral-400 block font-bold">FILE SIZE</span>
                      <span className="font-bold text-neutral-700">{formatBytes(selectedItem.size)}</span>
                    </div>
                    <div>
                      <span className="text-4xs text-neutral-400 block font-bold">TYPE</span>
                      <span className="font-bold text-neutral-700 uppercase">{selectedItem.type.split("/")[1] || "JPEG"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-neutral-50 px-3 py-2 border border-neutral-100 rounded-lg font-mono text-[10px]">
                    <div>
                      <span className="text-4xs text-neutral-400 block font-bold">RESOLUTION</span>
                      <span className="font-bold text-neutral-700">{selectedItem.width}x{selectedItem.height} px</span>
                    </div>
                    <div>
                      <span className="text-4xs text-neutral-400 block font-bold">DATE ADDED</span>
                      <span className="font-bold text-neutral-700 text-3xs">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Sub controls actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(selectedItem)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-100 hover:bg-neutral-100/80 hover:text-neutral-900 text-neutral-700 text-xs font-bold rounded-lg transition"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Edit / Crop" : "تحرير واقتصاص"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Delete" : "حذف نهائي"}</span>
                  </button>
                </div>

              </div>

              {/* Central Trigger output select */}
              {onSelectImage && (
                <div className="pt-5 border-t border-neutral-100 mt-5">
                  <button
                    type="button"
                    onClick={() => onSelectImage(selectedItem.dataUrl)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#172995] hover:bg-[#11207e] text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === "en" ? "Select this Asset" : "تأكيد واستخدام هذه الصورة المحددة"}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* RENDER CANVAS EDITOR POPUP OVERLAY */}
      {editingItem && (
        <ImageEditor
          item={editingItem}
          lang={lang}
          onClose={() => setEditingItem(null)}
          onSave={(updated) => {
            setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
            setEditingItem(null);
            setSelectedItemId(updated.id);
          }}
        />
      )}

    </div>
  );
};


// --- CUSTOM INTEGRATED USER INTERFACES FOR FIELDS PICKER ---
interface MediaPickerFieldProps {
  labelEn: string;
  labelAr: string;
  currentValue: string;
  onChange: (value: string) => void;
  lang?: "ar" | "en";
  helperText?: string;
  id?: string;
  uploadButtonLabelAr?: string;
  uploadButtonLabelEn?: string;
  // Dynamic compression overrides
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const MediaPickerField: React.FC<MediaPickerFieldProps> = ({
  labelEn,
  labelAr,
  currentValue,
  onChange,
  lang = "ar",
  helperText,
  id,
  uploadButtonLabelAr,
  uploadButtonLabelEn,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.8
}) => {
  const [isOpenManager, setIsOpenManager] = useState(false);

  const handleImageSelect = async (rawUrl: string) => {
    if (rawUrl && rawUrl.startsWith("data:image/")) {
      try {
        const compressed = await compressBase64(rawUrl, maxWidth, maxHeight, quality);
        onChange(compressed);
      } catch (err) {
        console.error("Downscaling failed: ", err);
        onChange(rawUrl);
      }
    } else {
      onChange(rawUrl);
    }
  };

  return (
    <div className="space-y-2 font-sans" id={id}>
      <div className="flex justify-between items-center">
        <label className={`text-2xs font-bold uppercase tracking-wider text-neutral-400 ${lang === "en" ? "text-left" : "text-right"}`}>
          {lang === "en" ? labelEn : labelAr}
        </label>
        {currentValue && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-3xs text-red-500 hover:text-red-650 hover:underline font-bold"
          >
            {lang === "en" ? "Clear / Remove" : "تفريغ / إزالة الصورة"}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-neutral-50/50 p-4 border border-neutral-200/60 rounded-xl">
        {/* Render interactive local visual box placeholder if empty */}
        <div className="w-20 h-20 shrink-0 bg-white border border-neutral-205 rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-3xs">
          {currentValue ? (
            <img 
              src={currentValue} 
              alt="Media Thumbnail" 
              className="max-h-full max-w-full object-contain" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <ImageIcon className="w-7 h-7 text-neutral-300" />
          )}
        </div>

        <div className="flex-1 space-y-2 w-full">
          {helperText && (
            <p className="text-3xs text-neutral-400 font-medium">
              {helperText}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsOpenManager(true)}
              className="px-3.5 py-1.5 bg-[#172995] hover:bg-[#11207e] text-white text-xs font-bold rounded-lg transition shadow-3xs cursor-pointer"
            >
              {lang === "en" ? "Browse Media Locker" : "تصفح واختيار صورة معتمدة"}
            </button>

            {/* Custom Direct fast upload selection Area */}
            <label className="px-3.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold rounded-lg transition shadow-3xs cursor-pointer flex items-center justify-center gap-1">
              <Upload className="w-3.5 h-3.5 text-neutral-450" />
              <span>
                {lang === "en" 
                  ? (uploadButtonLabelEn || "Upload Directly") 
                  : (uploadButtonLabelAr || "رفع اللوجو مباشرة")
                }
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
                className="hidden"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    try {
                      const res = await compressImage(files[0], maxWidth, maxHeight, quality);
                      // Auto store directly inside system local IndexedDB for future use and select instantly
                      const item: MediaLibraryItem = {
                        id: `media-${Date.now()}`,
                        name: files[0].name.replace(/\.[^/.]+$/, ""),
                        type: files[0].type,
                        size: Math.round((res.dataUrl.length * 3) / 4),
                        dataUrl: res.dataUrl,
                        width: res.width,
                        height: res.height,
                        createdAt: new Date().toISOString()
                      };
                      await saveMediaItemToDB(item);
                      handleImageSelect(res.dataUrl);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Render matching instance of global browse box modal */}
      {isOpenManager && (
        <MediaManager
          lang={lang}
          onSelectImage={(url) => {
            handleImageSelect(url);
            setIsOpenManager(false);
          }}
          onClose={() => setIsOpenManager(false)}
        />
      )}
    </div>
  );
};
