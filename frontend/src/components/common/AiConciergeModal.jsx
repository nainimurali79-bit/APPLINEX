import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Minimize2,
  Maximize2,
  Star,
  Tag,
  Check,
  CreditCard,
  Truck,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { appliancesApi } from '../../services/api';

const QUICK_PROMPTS = [
  "❄️ ACs under ₹1,500/mo",
  "🧊 Fridges under ₹1,000/mo",
  "🧺 Washing Machines under ₹800/mo",
  "📺 4K Smart TVs under ₹1,200/mo",
  "💧 Purifiers under ₹600/mo",
  "💰 Best appliances under ₹500",
  "🔒 How does deposit refund work?",
  "🚚 Delivery & ₹0 Installation",
  "🛠️ What if an appliance breaks?"
];

const AiConciergeModal = () => {
  const { isAiConciergeOpen, setIsAiConciergeOpen } = useWishlist();
  const [catalog, setCatalog] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm your **ApplineX AI Concierge**.\n\nTell me what you're looking for, or ask for appliances by your budget (e.g. *'Fridges under ₹1,000'* or *'ACs between ₹1,000 and ₹1,800'*). I can also answer questions about ₹0 maintenance, 100% deposit refunds, and fast 24-hour delivery!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Load live catalog on mount
  useEffect(() => {
    appliancesApi.getAppliances()
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setCatalog(items);
      })
      .catch((err) => {
        console.error('AI Concierge failed to load live catalog:', err);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiConciergeOpen) {
      scrollToBottom();
    }
  }, [messages, isAiConciergeOpen]);

  // Enhanced Multi-Criteria Appliance Search with Budget Range Support
  const searchAppliances = (keywords = [], minPrice = null, maxPrice = null, limit = 3) => {
    if (!catalog || catalog.length === 0) return [];

    let candidates = catalog.filter((item) => {
      const price = parseFloat(item.monthly_price) || 0;
      
      // Price filters
      if (maxPrice !== null && price > maxPrice) return false;
      if (minPrice !== null && price < minPrice) return false;

      // Keyword filters
      if (keywords && keywords.length > 0) {
        const matchText = `${item.name} ${item.category_name || ''} ${item.brand || ''} ${item.subcategory || ''} ${item.description || ''}`.toLowerCase();
        const matchesAny = keywords.some((kw) => matchText.includes(kw.toLowerCase()));
        if (!matchesAny) return false;
      }

      return true;
    });

    if (candidates.length === 0) return [];

    // Prioritize available, then high rating, then featured
    candidates.sort((a, b) => {
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (b.status === 'available' && a.status !== 'available') return 1;
      return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
    });

    return candidates.slice(0, limit).map((chosen) => ({
      id: chosen.id,
      name: chosen.name,
      price: parseInt(chosen.monthly_price),
      deposit: parseInt(chosen.security_deposit || chosen.monthly_price),
      image: chosen.image_url,
      rating: parseFloat(chosen.rating || 4.8),
      brand: chosen.brand,
      category: chosen.category_name || chosen.brand,
      status: chosen.status || 'available'
    }));
  };

  const handleNavigateToAppliance = (applianceId) => {
    setIsAiConciergeOpen(false);
    navigate(`/appliances/${applianceId}`);
  };

  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // ---------------------------------------------------------
    // 1. EXTRACT BUDGET & PRICE RANGE FILTERS
    // ---------------------------------------------------------
    let minPrice = null;
    let maxPrice = null;

    // Pattern: "between 500 and 1000", "500 to 1200", "500 - 1500"
    const rangeMatch = q.match(/(?:between|from)?\s*₹?\s*(\d+)\s*(?:and|to|-)\s*₹?\s*(\d+)/i);
    if (rangeMatch) {
      minPrice = parseInt(rangeMatch[1]);
      maxPrice = parseInt(rangeMatch[2]);
    } else {
      // Pattern: "under 1000", "below 1500", "less than 800", "< 1000"
      const maxMatch = q.match(/(?:under|below|less\s*than|within|upto|up\s*to|<)\s*₹?\s*(\d+)/i) || q.match(/budget\s*₹?\s*(\d+)/i);
      if (maxMatch) {
        maxPrice = parseInt(maxMatch[1]);
      }

      // Pattern: "above 1000", "more than 1500", "> 800"
      const minMatch = q.match(/(?:above|more\s*than|greater\s*than|>)\s*₹?\s*(\d+)/i);
      if (minMatch) {
        minPrice = parseInt(minMatch[1]);
      }
    }

    // Qualitative budget keywords
    if (/cheap|budget|affordable|low\s*cost|economic/i.test(q) && maxPrice === null) {
      maxPrice = 800;
    } else if (/premium|luxury|high\s*end|flagship/i.test(q) && minPrice === null) {
      minPrice = 1800;
    }

    // ---------------------------------------------------------
    // 2. GREETINGS & INTRO
    // ---------------------------------------------------------
    if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|start|greetings)[\s!.]*$/i.test(q)) {
      const topPicks = searchAppliances([], null, null, 2);
      return {
        text: "👋 **Hello! Welcome to ApplineX.**\n\nI can help you find appliances by your exact budget, compare models, or explain our ₹0 maintenance and 100% refundable deposit policies.\n\nTry asking:\n• *'ACs under ₹1,500/mo'*\n• *'Refrigerators between ₹600 and ₹1,200'*\n• *'Best 4K Smart TVs'*\n• *'How does deposit refund work?'*",
        recommendations: topPicks
      };
    }

    // ---------------------------------------------------------
    // 3. CATEGORY SPECIFIC SEARCH WITH BUDGET FILTERING
    // ---------------------------------------------------------

    // A. Refrigerators / Fridges
    if (/refrig|fridge|freez|double\s*door|single\s*door|frost\s*free|convertible/i.test(q)) {
      const recs = searchAppliances(['refrigerator', 'fridge', 'double door', 'single door'], minPrice, maxPrice, 3);
      const budgetNote = maxPrice ? ` within ₹${maxPrice.toLocaleString()}/mo` : minPrice ? ` above ₹${minPrice.toLocaleString()}/mo` : '';
      return {
        text: `❄️ **Top Refrigerator Matches${budgetNote}:**\n\nHere are our top-rated energy-efficient refrigerators suited for your requirements. Every rental includes **free heavy doorstep delivery**, **free voltage stabilizer**, and **₹0 maintenance**!`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['refrigerator'], null, null, 2)
      };
    }

    // B. Air Conditioners / AC
    if (/\bac\b|air\s*condition|cooling|split\s*ac|inverter\s*ac|1\.5\s*ton|1\s*ton|2\s*ton|voltas|lloyd|daikin|carrier/i.test(q)) {
      const recs = searchAppliances(['air conditioner', 'ac', 'inverter', 'split'], minPrice, maxPrice, 3);
      const budgetNote = maxPrice ? ` under ₹${maxPrice.toLocaleString()}/mo` : '';
      return {
        text: `❄️ **Inverter AC Recommendations${budgetNote}:**\n\nEquipped with 5-star inverter compressors and turbo cooling modes. Includes **free copper pipe installation** and **annual refrigerant top-up at ₹0 cost**!`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['air conditioner', 'ac'], null, null, 2)
      };
    }

    // C. Smart TVs / Television
    if (/\btv\b|televis|oled|qled|4k|bravia|screen|display|smart\s*tv|android\s*tv/i.test(q)) {
      const recs = searchAppliances(['tv', 'television', '4k', 'smart tv', 'oled', 'qled'], minPrice, maxPrice, 3);
      const budgetNote = maxPrice ? ` within ₹${maxPrice.toLocaleString()}/mo` : '';
      return {
        text: `📺 **Top 4K Smart TV Matches${budgetNote}:**\n\nExperience vivid colors and Dolby Atmos with built-in Netflix, Prime Video, Hotstar & YouTube. Includes **free wall-mount installation**!`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['tv', 'television'], null, null, 2)
      };
    }

    // D. Washing Machines
    if (/wash|laundry|washer|front\s*load|top\s*load|dryer/i.test(q)) {
      const recs = searchAppliances(['washing machine', 'front load', 'top load', 'washer'], minPrice, maxPrice, 3);
      const budgetNote = maxPrice ? ` under ₹${maxPrice.toLocaleString()}/mo` : '';
      return {
        text: `🧺 **Top Washing Machine Matches${budgetNote}:**\n\nFeaturing AI Direct Drive and steam hygiene wash cycles. Includes **free doorstep plumbing kit and anti-vibration stand**!`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['washing machine'], null, null, 2)
      };
    }

    // E. Water Purifiers / RO
    if (/purifi|water|ro\b|uv\b|filter|aqua|kent|livpure|drink/i.test(q)) {
      const recs = searchAppliances(['water purifier', 'ro', 'purifier', 'kent', 'livpure'], minPrice, maxPrice, 3);
      return {
        text: `💧 **Top Water Purifier Matches:**\n\nMulti-stage RO + UV + Alkaline mineral booster with real-time TDS display. Includes **free 6-month filter replacements and servicing**!`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['water purifier'], null, null, 2)
      };
    }

    // F. Air Coolers
    if (/cooler|desert\s*cooler|personal\s*cooler/i.test(q)) {
      const recs = searchAppliances(['cooler', 'air cooler', 'desert'], minPrice, maxPrice, 3);
      return {
        text: `🌬️ **Top Air Cooler Recommendations:**\n\nHigh airflow honeycomb cooling pads with ice chamber and low electricity consumption.`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['cooler'], null, null, 2)
      };
    }

    // G. Microwaves & Ovens
    if (/micro|oven|bake|grill|convect/i.test(q)) {
      const recs = searchAppliances(['microwave', 'oven', 'convection'], minPrice, maxPrice, 3);
      return {
        text: `🍲 **Top Microwave Oven Matches:**\n\nConvection baking, auto-cook Indian menus, defrosting, and child safety lock.`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['microwave'], null, null, 2)
      };
    }

    // H. Dishwashers
    if (/dish|utensil|vessel/i.test(q)) {
      const recs = searchAppliances(['dishwasher', 'dish'], minPrice, maxPrice, 3);
      return {
        text: `🍽️ **Top Dishwasher Matches:**\n\n13-14 place settings with intensive Kadhai cycles and hygienic 70°C hot water rinse.`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['dishwasher'], null, null, 2)
      };
    }

    // I. Geysers / Water Heaters
    if (/geyser|heater|hot\s*water|instant\s*geyser/i.test(q)) {
      const recs = searchAppliances(['geyser', 'heater', 'water heater'], minPrice, maxPrice, 3);
      return {
        text: `🚿 **Top Geyser / Water Heater Matches:**\n\nHigh-pressure glass-lined storage tank with 5-star energy rating and shock-proof casing.`,
        recommendations: recs.length > 0 ? recs : searchAppliances(['geyser'], null, null, 2)
      };
    }

    // J. Vacuum Cleaners / Air Purifiers / Induction
    if (/vacuum|cleaner|dyson|air\s*purifier|honeywell|induction|cooktop/i.test(q)) {
      const recs = searchAppliances(['vacuum', 'air purifier', 'induction', 'dyson', 'honeywell', 'philips'], minPrice, maxPrice, 3);
      return {
        text: `✨ **Smart Cleaning & Living Appliance Matches:**\n\nPremium smart home appliances designed to elevate your living comfort.`,
        recommendations: recs.length > 0 ? recs : searchAppliances([], null, null, 2)
      };
    }

    // ---------------------------------------------------------
    // 4. PURE BUDGET QUERY (e.g. "under 1000", "cheap appliances", "under 500")
    // ---------------------------------------------------------
    if (maxPrice !== null || minPrice !== null) {
      const recs = searchAppliances([], minPrice, maxPrice, 3);
      const budgetDesc = minPrice && maxPrice 
        ? `between ₹${minPrice.toLocaleString()} and ₹${maxPrice.toLocaleString()}/month`
        : maxPrice 
          ? `under ₹${maxPrice.toLocaleString()}/month`
          : `above ₹${minPrice.toLocaleString()}/month`;

      if (recs.length > 0) {
        return {
          text: `🏷️ **Best Appliances Found (${budgetDesc}):**\n\nHere are top customer-favorite appliances in your budget. Click any appliance card below to view specifications and rent with 1 click!`,
          recommendations: recs
        };
      } else {
        const fallbacks = searchAppliances([], null, 1000, 3);
        return {
          text: `We couldn't find items strictly ${budgetDesc}, but here are our most popular affordable options under ₹1,000/month:`,
          recommendations: fallbacks
        };
      }
    }

    // ---------------------------------------------------------
    // 5. RENTAL POLICIES & FAQS
    // ---------------------------------------------------------

    // Deposit & Refund
    if (/deposit|refund|security|guarantee|money\s*back/i.test(q)) {
      return {
        text: `🔒 **100% Guaranteed Deposit Refund Policy:**\n\n• Your security deposit is **100% refundable**.\n• When your rental period ends and you return the item, our technician conducts a swift doorstep verification.\n• The full deposit is credited back to your original bank account/UPI within **24 to 48 business hours**.\n• No hidden cancellation deductions!`,
        recommendations: []
      };
    }

    // Maintenance & Breakdown
    if (/maint|repair|broke|service|technician|visit|damage|not\s*working|fix/i.test(q)) {
      return {
        text: `🛠️ **Zero Maintenance Guarantee (₹0 Service Charge):**\n\n• All ApplineX rentals come with **complimentary breakdown & repair coverage**.\n• If your AC, fridge, or TV experiences any issue, raise a 1-click maintenance ticket from your **Customer Portal**.\n• A certified brand technician visits within **24 hours** with genuine parts at **₹0 cost to you**!`,
        recommendations: []
      };
    }

    // Delivery & Installation
    if (/deliver|install|shift|relocat|moving|setup|time/i.test(q)) {
      return {
        text: `🚚 **Express 24-Hour Delivery & Free Installation:**\n\n• **Fast Dispatch:** Appliances are thoroughly sanitized and delivered within **24 hours** of KYC approval.\n• **₹0 Professional Setup:** Our technician completes unboxing, electrical/plumbing connections, and provides a full demo.\n• **Free City Relocation:** Moving to a new home in the same city? We shift and reinstall your appliances for free!`,
        recommendations: []
      };
    }

    // Billing & Rent Payment
    if (/payment|billing|monthly|invoice|pay|card|upi|autopay|mandate/i.test(q)) {
      return {
        text: `💳 **How Billing & Payments Work:**\n\n• **At Checkout:** You only pay **Month 1 Rent + Refundable Security Deposit + Delivery Fee**.\n• **Subsequent Months:** Auto-generated monthly invoices are billed on the 1st of every month via Razorpay / Stripe / UPI / Cards.\n• You can download tax invoices anytime from your **Customer Invoices** tab!`,
        recommendations: []
      };
    }

    // KYC & Documents
    if (/kyc|document|aadhaar|pan|id\s*proof|verify/i.test(q)) {
      return {
        text: `📄 **Instant Digital e-KYC Verification:**\n\n• Upload a photo of any government ID (**Aadhaar Card, PAN Card, Driving License, or Passport**).\n• Verification takes less than **10 minutes**.\n• Ensures high-value appliance protection and seamless doorstep handover!`,
        recommendations: []
      };
    }

    // Comparison Tool
    if (/compar|vs\b|versus|differen|which\s*(is|one|better)/i.test(q)) {
      return {
        text: `⚖️ **Side-by-Side Appliance Comparison:**\n\nYou can compare up to 4 appliances in detail using our **Compare Tool**!\n\n• Compare monthly rates, power consumption, capacity, BEE star ratings, and smart IoT specs.\n\n👉 [Open Appliance Comparison Tool](/appliances/compare)`,
        recommendations: []
      };
    }

    // ---------------------------------------------------------
    // 6. DEFAULT INTELLIGENT FALLBACK
    // ---------------------------------------------------------
    const defaultRecs = searchAppliances([], null, null, 3);
    return {
      text: `Thanks for asking! ApplineX is India's leading smart household appliance rental platform with **₹0 maintenance**, **free 24-hour doorstep delivery**, and **100% refundable security deposits**.\n\nTell me what you're looking for by budget or category (e.g. *"Fridges under ₹1,000"*, *"AC between 1000 and 1500"*, *"Best 4K Smart TVs"*), or browse our top picks below:`,
      recommendations: defaultRecs
    };
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotReply(text);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        recommendations: response.recommendations || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  if (!isAiConciergeOpen) {
    return (
      <div 
        onClick={() => setIsAiConciergeOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          cursor: 'pointer'
        }}
      >
        <button
          className="btn-ai"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.4rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.45)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Bot size={20} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }} />
          </div>
          <span>Ask AI Concierge</span>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            padding: '2px 7px',
            borderRadius: '10px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            PRO
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '420px',
        maxWidth: 'calc(100vw - 30px)',
        height: '630px',
        maxHeight: 'calc(100vh - 40px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(11, 25, 44, 0.35)',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1050,
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B192C 0%, #17113A 100%)',
        color: '#FFFFFF',
        padding: '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(124, 58, 237, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #00C4FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
          }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ApplineX AI Concierge
              <span style={{ fontSize: '0.65rem', backgroundColor: '#10B981', color: '#FFFFFF', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                ONLINE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
              Smart appliance discovery & instant matching
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAiConciergeOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close Assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Message Chat List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.25rem',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '0.6rem',
              maxWidth: '92%',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}>
              {msg.sender === 'bot' && (
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)'
                }}>
                  <Bot size={16} color="#FFFFFF" />
                </div>
              )}

              <div style={{ width: '100%' }}>
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#1E60D5' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '0.85rem 1.1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(30, 96, 213, 0.3)' : '0 2px 8px rgba(15, 23, 42, 0.06)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>

                {/* Multiple Embedded Appliance Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    {msg.recommendations.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleNavigateToAppliance(app.id)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #DDD6FE',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = '#7C3AED';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.22)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = '#DDD6FE';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.12)';
                        }}
                      >
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid #E2E8F0'
                        }}>
                          <img
                            src={app.image}
                            alt={app.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              backgroundColor: '#EDE9FE',
                              color: '#7C3AED',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {app.category}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={11} fill="#F59E0B" /> {app.rating}
                            </span>
                          </div>

                          <div style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {app.name}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E60D5' }}>
                              ₹{app.price.toLocaleString()}
                              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>/mo</span>
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              Deposit: ₹{app.deposit?.toLocaleString() || app.price?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToAppliance(app.id);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.78rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            flexShrink: 0
                          }}
                        >
                          Rent <ChevronRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7C3AED', fontSize: '0.8rem', fontStyle: 'italic', paddingLeft: '2.5rem' }}>
            <div className="pulse-dot" style={{ backgroundColor: '#7C3AED' }} />
            <span>AI Concierge is scanning catalog & calculating best match...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{
        padding: '0.65rem 1rem',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        gap: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            style={{
              padding: '0.35rem 0.75rem',
              backgroundColor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              color: '#7C3AED',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#7C3AED';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F3FF';
              e.currentTarget.style.color = '#7C3AED';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Text Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '0.85rem 1rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="E.g. ACs under 1500, Fridges under 1000..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="btn btn-primary"
          style={{ padding: '0.6rem 0.9rem', borderRadius: '8px' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AiConciergeModal;
