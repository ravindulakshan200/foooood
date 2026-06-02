export type Locale = "en" | "si";

export const translations = {
  en: {
    nav: { home: "Home", menu: "Menu", contact: "Contact", track: "Track Order", orderNow: "Order Now" },
    footer: {
      quickLinks: "Quick Links",
      ourMenu: "Our Menu",
      cartCheckout: "Cart & Checkout",
      contactUs: "Contact Us",
      findUs: "Find Us",
      stayUpdated: "Stay Updated",
      newsletterDesc: "Get notified about new dishes, special offers and seasonal promotions.",
      subscribed: "Subscribed! We'll keep you updated.",
      subscribeFail: "Could not subscribe. Please try again.",
      alreadySubscribed: "You're already subscribed!",
    },
    track: {
      title: "Track Your Order",
      subtitle: "Enter the phone number used when ordering",
      search: "Track Order",
      noOrders: "No orders found for this number.",
      orderId: "Order",
      payment: "Payment",
      status: "Status",
    },
    common: { loading: "Loading…", error: "Something went wrong" },
  },
  si: {
    nav: { home: "මුල් පිටුව", menu: "මෙනුව", contact: "සම්බන්ධ වන්න", track: "ඇණවුම බලන්න", orderNow: "ඇණවුම කරන්න" },
    footer: {
      quickLinks: "ඉක්මන් සබැඳි",
      ourMenu: "අපේ මෙනුව",
      cartCheckout: "Cart සහ ගෙවීම",
      contactUs: "අප අමතන්න",
      findUs: "අපි සොයාගන්න",
      stayUpdated: "නවතම දැනුම්දීම්",
      newsletterDesc: "නව කෑම, විශේෂ පිරිනැමීම් සහ seasonal offers ගැන දැනුම්දීම් ලබාගන්න.",
      subscribed: "Subscribe වුණා! අපි ඔබව දැනුම් දෙමු.",
      subscribeFail: "Subscribe වෙන්න බැරි වුණා. නැවත උත්සාහ කරන්න.",
      alreadySubscribed: "ඔබ දැනටමත් subscribe කරලා!",
    },
    track: {
      title: "ඔබේ ඇණවුම Track කරන්න",
      subtitle: "ඇණවුම කරද්දී use කළ phone number එක දාන්න",
      search: "ඇණවුම බලන්න",
      noOrders: "මේ number එකට orders නැහැ.",
      orderId: "ඇණවුම",
      payment: "ගෙවීම",
      status: "තත්වය",
    },
    common: { loading: "Load වෙනවා…", error: "යමක් වැරදි වුණා" },
  },
} as const;

export type TranslationKeys = (typeof translations)[Locale];
