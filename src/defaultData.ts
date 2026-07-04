import { CompanyConfig } from "./types";

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  companyNameEn: "San George Co.",
  companyNameAr: "شركة سان جورج التجارية",
  taglineEn: "A Legacy of Quality Trade, Commercial Supplies, & Authorized Distribution in Suez",
  taglineAr: "عقود من الخبرة في التجارة والتوريدات التجارية والوكالات المعتمدة في السويس",
  logoUrl: "", // Empty defaults to beautiful SVG logo
  aboutTextEn: "Established in the heart of Suez, San George Co. has grown to become a cornerstone of commercial trading, distributing elite home appliance brands, marine products, and electrical installations. Backed by decades of professional supply chain experience, we connect global consumer electronics and home equipment manufacturers to retail markets and corporate sectors with high efficiency, reliable support, and localized care.",
  aboutTextAr: "تأسست شركة سان جورج التجارية في قلب محافظة السويس، لتصبح واحدة من كبرى الشركات الرائدة في مجال التجارة والتوريدات والوكالات التجارية المعتمدة. نعمل بكفاءة عالية في توزيع الأجهزة المنزلية الكبرى، الإلكترونيات، والمستلزمات التجارية والصناعية. نلتزم دائماً بتقديم مستويات خدمة استثنائية وبناء ثقة متبادلة مع شركائنا وعملائنا في منقطة القناة.",
  aboutMediaUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200", // Suez dock / container logistics themed photo
  
  buttons: {
    contacts: {
      labelEn: "Contacts",
      labelAr: "اتصل بنا",
      visible: true,
    },
    branches: {
      labelEn: "Our Branches",
      labelAr: "فروعنا بالسويس",
      visible: true,
    },
    social: {
      labelEn: "Social Hub",
      labelAr: "شبكة التواصل",
      visible: true,
    },
    midea: {
      labelEn: "San George",
      labelAr: "سان جورج",
      visible: true,
    }
  },
  
  branches: [
    {
      id: "branch-1",
      nameEn: "Suez Port St. Head Office",
      nameAr: "الفرع الرئيسي - شارع بورسعيد",
      addressEn: "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt",
      addressAr: "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر",
      phone: "+20 62 334 1850",
      mapUrl: "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    {
      id: "branch-2",
      nameEn: "El Arbaeen Retail Hub",
      nameAr: "مركز مبيعات حي الأربعين",
      addressEn: "El-Geish Street, Adjacent to Al Arbaeen Square, Suez, Egypt",
      addressAr: "شارع الجيش، بمحاذاة ميدان الأربعين الشهير، السويس، مصر",
      phone: "+20 62 335 9180",
      mapUrl: "https://maps.google.com/maps?q=Al%20Arbaeen,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  ],
  
  contactPhone: "+20 122 345 6789",
  contactEmail: "info@sangeorge.co",
  contactWhatsapp: "201223456789", // format for WhatsApp click-to-chat api
  workingHoursEn: "Saturday - Thursday: 10:00 AM - 10:00 PM (Friday Closed)",
  workingHoursAr: "السبت - الخميس: من 10 صباحاً حتى 10 مساءً (الجمعة عطلة)",
  contactLocationNameEn: "San George Co. Head Office",
  contactLocationNameAr: "المكتب الرئيسي لشركة سان جورج",
  contactLocationAddressEn: "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt",
  contactLocationAddressAr: "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر",
  contactMapUrl: "https://maps.google.com/maps?q=Port%20Said%20St,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed",
  
  facebookUrl: "https://facebook.com/sangeorge.suez",
  instagramUrl: "https://instagram.com/sangeorge.suez",
  tiktokUrl: "https://tiktok.com/@sangeorge.suez",
  linkedinUrl: "", // Empty to verify dynamic hiding works by default

  brands: [
    { id: "b1", name: "Samsung", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png" },
    { id: "b2", name: "Beko", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Beko_logo.svg/512px-Beko_logo.svg.png" },
    { id: "b3", name: "Bosch", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/512px-Bosch-logo.svg.png" },
    { id: "b4", name: "LG", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/512px-LG_logo_%282015%29.svg.png" },
    { id: "b5", name: "Toshiba", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Toshiba_logo.svg/512px-Toshiba_logo.svg.png" },
    { id: "b6", name: "Midea", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Midea_logo.svg/512px-Midea_logo.svg.png" },
    { id: "b7", name: "Haier", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Haier_logo.svg/512px-Haier_logo.svg.png" },
    { id: "b8", name: "Carrier", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Carrier_Logo.svg/512px-Carrier_Logo.svg.png" },
    { id: "b9", name: "Gree", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gree_Electric_logo.svg/512px-Gree_Electric_logo.svg.png" }
  ],
  samsungPhone: "+20 100 234 5678",
  samsungWhatsapp: "201002345678",
  samsungMapUrl: "https://maps.google.com/maps?q=Samsung%20Service%20Center,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed",
  samsungLocationNameEn: "Samsung Authorized Service Center",
  samsungLocationNameAr: "مركز خدمة وصيانة سامسونج المعتمد",
  samsungLocationAddressEn: "El-Geish Street, Near Suez University, Suez, Egypt",
  samsungLocationAddressAr: "شارع الجيش، بجوار بوابة جامعة السويس، السويس، مصر",
  samsungFacebookUrl: "https://facebook.com/SamsungEgypt",
  samsungInstagramUrl: "https://instagram.com/samsungegypt",
  samsungBranches: [
    {
      id: "samsung-b-1",
      nameEn: "Samsung Service Center",
      nameAr: "مركز خدمة وصيانة سامسونج المعتمد",
      addressEn: "El-Geish Street, Near Suez University, Suez, Egypt",
      addressAr: "شارع الجيش، بجوار بوابة جامعة السويس، السويس، مصر",
      phone: "+20 100 234 5678",
      mapUrl: "https://maps.google.com/maps?q=Samsung%20Service%20Center,%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  ],
  bekoPhone: "+20 155 987 6543",
  bekoWhatsapp: "201559876543",
  bekoMapUrl: "https://maps.google.com/maps?q=Beko%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed",
  bekoLocationNameEn: "Beko Brand Shop & Authorized Service",
  bekoLocationNameAr: "معرض وصيانة بيكو المعتمد بالسويس",
  bekoLocationAddressEn: "Suez Promenade, Opposite El-Mallah Garden, Suez, Egypt",
  bekoLocationAddressAr: "ممشي السويس، أمام حديقة الملاحة، السويس، مصر",
  bekoFacebookUrl: "https://facebook.com/BekoEgypt",
  bekoInstagramUrl: "https://instagram.com/beko_egypt",
  bekoBranches: [
    {
      id: "beko-b-1",
      nameEn: "Beko Brand Shop & Authorized Service",
      nameAr: "معرض وصيانة بيكو المعتمد بالسويس",
      addressEn: "Suez Promenade, Opposite El-Mallah Garden, Suez, Egypt",
      addressAr: "ممشي السويس، أمام حديقة الملاحة، السويس، مصر",
      phone: "+20 155 987 6543",
      mapUrl: "https://maps.google.com/maps?q=Beko%20Suez&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  ],
  mideaPhone: "+20 122 345 6789",
  mideaWhatsapp: "201223456789",
  mideaMapUrl: "https://maps.app.goo.gl/U1keM2jD4mAEKZrk7",
  mideaLocationNameEn: "San George Authorized Service",
  mideaLocationNameAr: "مركز صيانة ومعرض سان جورج المعتمد",
  mideaLocationAddressEn: "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt",
  mideaLocationAddressAr: "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر",
  mideaFacebookUrl: "https://facebook.com/sangeorge.suez",
  mideaInstagramUrl: "https://instagram.com/sangeorge.suez",
  mideaBranches: [
    {
      id: "midea-b-1",
      nameEn: "San George Authorized Service",
      nameAr: "مركز صيانة ومعرض سان جورج المعتمد",
      addressEn: "Port Said Street, Near Suez Canal Authority Building, Suez, Egypt",
      addressAr: "شارع بورسعيد، بجوار مبنى إدارة هيئة قناة السويس، السويس، مصر",
      phone: "+20 122 345 6789",
      mapUrl: "https://maps.app.goo.gl/U1keM2jD4mAEKZrk7"
    }
  ],
  offers: [
    {
      id: "offer-1",
      titleAr: "خصم الصيف على تكييفات كاريير وجري المعتمدة",
      titleEn: "Summer Promo: Carrier & Gree Smart Air Conditioners",
      descriptionAr: "احصل الآن على تكييفك المفضل بخصم فوري يصل إلى 15% مع شحن وتركيب مجاني داخل محافظة السويس.",
      descriptionEn: "Beat the heat with up to 15% exceptional discount on Carrier & Gree split/inverter air conditioners with free Suez shipping & installation.",
      badgeAr: "خصم %15",
      badgeEn: "15% OFF",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "offer-2",
      titleAr: "عروض غسالات ومجففات بيكو التركية الذكية",
      titleEn: "Special Offers on Beko智能 Smart Laundry Systems",
      descriptionAr: "خصم مخصص لعملاء السويس على غسالات بيكو الداعمة لتقنيات البخار المتقدمة. تواصل للمواصفات والأسعار.",
      descriptionEn: "Exclusive prices for Suez residents on high-capacity Beko Turkish washing machines & dryers. Contact support now for official quotations.",
      badgeAr: "عرض حصري",
      badgeEn: "Suez Exclusive",
      imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=400"
    }
  ],
  testimonials: [
    {
      id: "testi-1",
      authorNameEn: "Captain Adel El-Sersawy",
      authorNameAr: "كابتن عادل السرساوي",
      authorTitleEn: "Director, Suez Marine Services Co.",
      authorTitleAr: "مدير شركة السويس للخدمات البحرية",
      feedbackEn: "We've sourced electrical installations and Bosch appliances from San George for multiple supply vessels. Their wholesale pricing combined with dependable Suez port delivery makes them our absolute prime partner.",
      feedbackAr: "تعاملنا مع شركة سان جورج لتوريد التجهيزات الكهربائية وأجهزة بوش للعديد من سفن الخدمات الملاحية. الأسعار التنافسية والدقة المتناهية في التوصيل لفرضة السويس تجعلهم خيارنا الأول دائماً.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "testi-2",
      authorNameAr: "الأستاذة نهى عبد الرحمن",
      authorNameEn: "Noha Abdel-Rahman",
      authorTitleAr: "معلمة بمدرسة السويس الثانوية",
      authorTitleEn: "Suez Secondary School Educator",
      feedbackAr: "اشتريت غسالة ومجفف بيكو التركية من فرع شارع بورسعيد. المعاملة فوق ممتازة والتركيب تم في نفس اليوم بمساعدة فني معتمد من الشركة. أنصح بشدة بالتعامل معهم لضمان وراحة عملاء السويس.",
      feedbackEn: "I purchased a Turkish Beko washing machine and dryer from the Port Said branch. The staff was incredibly welcoming, and installation was completed on the very same day by an authorized technician.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "testi-3",
      authorNameEn: "Eng. Moustafa Al-Sheshtawy",
      authorNameAr: "المهندس مصطفى الششتاوي",
      authorTitleEn: "Senior Electrical Engineering Contractor",
      authorTitleAr: "مستشار عقود ومقاولات كهربائية بالسويس",
      feedbackEn: "San George has set the gold standard in Suez as an authorized Samsung and Beko distributor. Truly professional, and their customer support sets a benchmark for customer service.",
      feedbackAr: "سان جورج وضعت كوداً ذهبياً في السويس كوكيل رسمي معتمد لسامسونج وبيكو. الاحترافية العالية وفريق الدعم الفني يثبتان دائماً التزامهم برياستهم لقطاع توريد الأجهزة والأعمال الكبرى.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
    }
  ]
};
