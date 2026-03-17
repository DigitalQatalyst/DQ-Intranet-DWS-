import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

function getBotResponse(userMessage: string): { text: string; action?: () => void; suggestions?: string[] } {
  const lowerMessage = userMessage.toLowerCase().trim();
  const has = (pattern: RegExp) => pattern.test(lowerMessage);

  // Enhanced greetings with proactive help
  if (has(/^(hi|hello|hey|greetings|good morning|good afternoon)/)) {
    return {
      text: 'Hi! Welcome to DQ! 👋 I\'m your onboarding assistant. I can help you with:\n\n• Starting your onboarding journey\n• Understanding DQ Organization and frameworks (GHC, 6XD)\n• Finding your role and responsibilities\n• Getting support and answers\n• Navigating tools and processes\n\nWhat would you like to know first?',
      suggestions: ['Where do I start?', 'What is DQ?', 'What is GHC?', 'I need help']
    };
  }

  // First day / Getting started
  if (has(/(first day|day one|getting started|what should i do|where to begin|new here|just joined|first steps)/)) {
    return {
      text: 'Welcome! Here\'s what to focus on your first day:\n\n1. **Start your onboarding journey** - Click the button above to begin\n2. **Understand DQ Organization** - Learn about the company you\'ve joined\n3. **Review your role** - See your responsibilities and contribution paths\n4. **Set up tools** - Get access to DWS platform and essential systems\n5. **Know where to get help** - Your People Partner, Communication Center, or Unit Lead\n\nWould you like me to guide you through any of these?',
      suggestions: ['Tell me about DQ', 'What is my role?', 'Where do I get help?']
    };
  }

  // Hero/Start section - enhanced
  if (has(/(start|begin|journey|onboarding|where do i start|how do i start|what's next|next step)/)) {
    return {
      text: 'Perfect! Here\'s your onboarding path:\n\n**Step 1:** Click "Start My Onboarding Journey" - This guides you through DQ\'s culture and ways of working\n\n**Step 2:** Understand DQ Organization - Learn about the frameworks that shape everything\n\n**Step 3:** Learn about GHC and 6XD - These define how quality and work happen\n\n**Step 4:** Review your position - See how you fit and contribute\n\n**Step 5:** Know where to get help - Support is always available\n\nReady to start?',
      suggestions: ['Tell me about DQ Organization', 'What is GHC?', 'What is 6XD?']
    };
  }

  // Organization questions - enhanced with more detail
  if (has(/(organization|organisation|what is dq|who is dq|company|about dq|dq culture|what kind of company)/)) {
    return {
      text: '**DQ Organization** - Complete Overview:\n\n**What DQ Is:**\nDQ is a purpose-driven organization built on intentional frameworks. Before you do anything, understanding the organisation helps you make sense of:\n\n• How work happens here\n• Why decisions are made the way they are\n• The frameworks that shape everything (GHC and 6XD)\n\n**How DQ Works:**\nDQ operates with two core frameworks:\n• **GHC (Golden Honeycomb of Competence)** - For standards and capability\n• **6X Digitals (6XD)** - For how work actually happens\n\n**How to Use This Knowledge:**\n• Start with understanding DQ Organization to get context\n• Then learn about GHC to understand standards\n• Finally, learn about 6XD to see how work happens\n• This foundation helps you make better decisions and understand why things work the way they do\n\n**When You Need More:**\nYou can explore the full DQ Organization page for deeper details, but this gives you the essential foundation.',
      suggestions: ['What is GHC?', 'What is 6XD?', 'How does DQ work?', 'What is my role?']
    };
  }

  // GHC questions - enhanced with "how to use"
  if (has(/(ghc|golden honeycomb|standards|capability|quality|framework|competence|how is quality|decision making)/)) {
    return {
      text: '**GHC (Golden Honeycomb of Competence)** - Complete Guide:\n\n**What It Is:**\nThe GHC defines our purpose, principles, and decision-making foundations so everyone works from the same base. It\'s the framework that ensures consistency and quality across DQ.\n\n**Why It Matters:**\nUnderstanding GHC means you know:\n• What quality looks like at DQ\n• How to make decisions that align with DQ\'s standards\n• The foundations that guide all our work\n• How to evaluate if something meets DQ standards\n\n**How to Use GHC:**\n• **For Decision Making:** When making choices, refer to GHC principles to ensure alignment\n• **For Quality Standards:** Use GHC to understand what "good" looks like in your work\n• **For Capability Development:** GHC guides how you grow and develop at DQ\n• **For Understanding Context:** GHC explains why things are done certain ways\n\n**When to Use It:**\n• Making decisions about work approaches\n• Evaluating quality of deliverables\n• Planning your development\n• Understanding organizational priorities\n\n**Key Takeaway:** GHC is your reference point for standards, quality, and decision-making at DQ.',
      suggestions: ['What is 6XD?', 'How does this relate to my role?', 'How do I learn more about GHC?', 'What is DQ Organization?']
    };
  }

  // 6XD questions - enhanced with "how to use"
  if (has(/(6xd|6x|digitals|how does work happen|agile|tms|atp|delivery|work happens|how do we deliver|operational|contribution|products)/)) {
    return {
      text: '**6X Digitals (6XD)** - Complete Guide:\n\n**What It Is:**\n6XD is the operational system that turns DQ vision into real outcomes. It\'s not just a framework - it\'s how work actually gets done at DQ.\n\n**How 6XD Works:**\n• Connects directly to Agile TMS (Team Management System) and ATP (Agile Transformation Program)\n• Every associate contributes to DQ products through this system\n• It\'s where vision becomes operational practice\n• It defines how work flows from idea to delivery\n\n**Why It Matters:**\nAlthough part of GHC, 6XD is separate because:\n• It\'s the lived, operational system (not just theory)\n• It links directly to how you deliver and contribute\n• It connects to Agile TMS where your work is tracked\n• It\'s how DQ products are built and maintained\n\n**How to Use 6XD:**\n• **For Your Work:** Understand how your tasks connect to DQ products through 6XD\n• **For Delivery:** See how Agile TMS and ATP relate to 6XD principles\n• **For Contribution:** Know how your work contributes to DQ products\n• **For Understanding Flow:** See how ideas become deliverables through 6XD\n\n**When to Use It:**\n• Planning your work and contributions\n• Understanding how your role connects to DQ products\n• Learning about Agile TMS and ATP\n• Seeing how operational work happens\n\n**Key Takeaway:** 6XD is the "how" - the operational system that makes DQ\'s vision real through Agile TMS and ATP.',
      suggestions: ['What is GHC?', 'How does this affect my role?', 'What are DQ products?', 'What is Agile TMS?']
    };
  }

  // Position/Role questions - enhanced
  if (has(/(position|role|responsibilities|my job|where do i fit|contribution|my role|what do i do|accountability|my responsibilities)/)) {
    return {
      text: '**Your Position at DQ** - Complete Overview:\n\n**What It Means:**\n• Every role at DQ is intentionally designed with clear responsibilities\n• Your position reflects how critical your contribution is\n• You bridge organizational context with individual accountability\n\n**What to Know About Your Role:**\n• Each role has clear contribution paths\n• Understanding your position helps you see how you create impact\n• Your responsibilities are designed to align with DQ\'s frameworks (GHC and 6XD)\n• Your role connects to DQ products through 6XD\n\n**How to Use This Information:**\n• **For Understanding Impact:** See how your role contributes to DQ\'s success\n• **For Planning Work:** Use your role definition to guide what you focus on\n• **For Development:** Understand what capabilities your role requires\n• **For Alignment:** Ensure your work aligns with your role\'s responsibilities\n\n**When to Review Your Role:**\n• During onboarding (now!)\n• When planning your work\n• When understanding your contribution\n• When developing new capabilities\n\n**Key Takeaway:** Your role is intentionally designed - understanding it helps you contribute effectively and see your impact.',
      suggestions: ['How does this relate to GHC?', 'What about 6XD?', 'Where do I get help?', 'What is DQ Organization?']
    };
  }

  // Support/Help questions - enhanced
  if (has(/(help|support|stuck|question|don't know|confused|assistance|contact|need help|who can help|who do i contact)/)) {
    return {
      text: '**You\'re not expected to do this alone!** Here\'s where to get help:\n\n**1. People Partner**\n• **What:** HR topics, onboarding questions, people-related support\n• **When to use:** HR questions, benefits, policies, people issues\n• **How to access:** Contact through DWS Communication Center or directly\n\n**2. DWS Communication Center**\n• **What:** Ask questions, raise requests, get clarifications centrally\n• **When to use:** General questions, requests, clarifications\n• **How to access:** Available through the DWS platform\n\n**3. FAQs & Glossary**\n• **What:** Self-serve answers to common DQ terms, tools, and processes\n• **When to use:** Quick answers, definitions, process questions\n• **How to access:** Available in the DWS platform\n\n**4. Unit or Delivery Lead**\n• **What:** Day-to-day work priorities, expectations, and delivery guidance\n• **When to use:** Work-related questions, priorities, delivery guidance\n• **How to access:** Your direct manager or team lead\n\n**Remember:** It\'s normal to have questions. Reach out when you need help - that\'s what these resources are here for.',
      suggestions: ['Contact People Partner', 'DWS Communication Center', 'FAQs & Glossary', 'Unit Lead']
    };
  }

  // Progress questions - enhanced
  if (has(/(progress|status|how am i doing|complete|finished|done|days remaining|courses|how much|percentage|tracking)/)) {
    return {
      text: '**Your Onboarding Progress** - Complete Guide:\n\n**Progress Indicators (shown above):**\n• **Days Remaining** - Time left in your 30-day onboarding period\n• **Courses Remaining** - How many onboarding courses you\'ve completed\n• **Overall Progress** - Combined progress across time and courses\n\n**What This Means:**\n• Progress updates automatically as you complete steps\n• Focus on understanding, not speed\n• It\'s self-paced - take the time you need\n• Each indicator shows a different aspect of your progress\n\n**How to Use This Information:**\n• **Days Remaining:** Plan your onboarding activities within the timeframe\n• **Courses Remaining:** Track which courses you still need to complete\n• **Overall Progress:** See your combined progress across all areas\n\n**If you\'re logged in:** You\'ll see your personal progress. If not, you\'ll see general information.\n\n**Key Takeaway:** Progress is about understanding, not speed. Take your time to truly understand DQ.',
      suggestions: ['What should I focus on?', 'Where do I start?', 'I need help']
    };
  }

  // Tools and systems - enhanced
  if (has(/(tools|systems|platform|dws|what tools|software|applications|access|setup)/)) {
    return {
      text: '**Essential Tools at DQ** - Complete Guide:\n\n**1. DWS Platform**\n• **What:** Your main navigation hub (you\'re using it now!)\n• **How to use:** Navigate to different sections, find information, access resources\n• **When to use:** Daily - it\'s your main entry point\n\n**2. Communication Tools**\n• **What:** For team collaboration and messaging\n• **How to use:** Connect with team members, share updates, collaborate\n• **When to use:** Daily communication and collaboration\n\n**3. Project Management Systems**\n• **What:** For tracking work and deliverables\n• **How to use:** Track tasks, see progress, manage deliverables\n• **When to use:** For all work-related tracking\n\n**4. Learning Platform (LMS)**\n• **What:** For courses, GHC, and 6XD learning\n• **How to use:** Take courses, track learning progress, access materials\n• **When to use:** During onboarding and ongoing development\n\n**5. Work Directory**\n• **What:** To find roles, positions, and team information\n• **How to use:** Search for roles, see position details, find team members\n• **When to use:** When you need role or team information\n\n**Getting Access:** Your People Partner or IT support can help with tool access and setup.',
      suggestions: ['How do I get access?', 'Where do I learn to use them?', 'I need help']
    };
  }

  // Culture and values - enhanced
  if (has(/(culture|values|how do we work|work style|company culture|dq way|how things work here)/)) {
    return {
      text: '**DQ Culture & Ways of Working** - Complete Guide:\n\n**Core Principles:**\n• Purpose-driven organization\n• Built on intentional frameworks (GHC and 6XD)\n• Every role matters - clear responsibilities and contribution paths\n• Quality and standards are defined through GHC\n• Work happens through 6XD operational system\n\n**What This Means for You:**\n• Understand the frameworks to make sense of decisions\n• Your contribution is critical - every role is intentionally designed\n• Support is available - you\'re not expected to know everything immediately\n• Quality matters - GHC defines what good looks like\n• Work flows through 6XD - understand how your work connects\n\n**How to Work at DQ:**\n• **Start with Context:** Understand DQ Organization first\n• **Use Frameworks:** Apply GHC for standards, 6XD for operations\n• **Know Your Role:** Understand how you contribute\n• **Ask for Help:** Support is always available\n• **Focus on Quality:** Use GHC to guide your work\n\n**Key Takeaway:** DQ culture is built on intentional frameworks - understanding them helps you work effectively.',
      suggestions: ['What is GHC?', 'What is 6XD?', 'What is my role?', 'What is DQ Organization?']
    };
  }

  // Timeline and expectations - enhanced
  if (has(/(timeline|how long|duration|expectations|what to expect|when|timeframe|deadline|due date)/)) {
    return {
      text: '**Onboarding Timeline & Expectations** - Complete Guide:\n\n**Timeline:**\n• Standard onboarding period: 30 days\n• Self-paced - take the time you need\n• Focus on understanding, not speed\n\n**What\'s Expected:**\n• Understand DQ Organization and frameworks\n• Learn about GHC (standards and capability)\n• Understand 6XD (how work happens)\n• Know your role and responsibilities\n• Know where to get help\n\n**What\'s NOT Expected:**\n• You don\'t need to know everything immediately\n• It\'s okay to ask questions\n• Support is available throughout\n• You don\'t need to rush through\n\n**How to Approach Onboarding:**\n• **Take Your Time:** It\'s self-paced for a reason\n• **Focus on Understanding:** Quality over speed\n• **Ask Questions:** That\'s what support is for\n• **Use Resources:** Leverage all available help\n• **Track Progress:** Use the indicators above\n\n**Progress:** Track your progress using the indicators above. Focus on understanding each section before moving on.',
      suggestions: ['Where do I start?', 'What should I focus on?', 'I need help']
    };
  }

  // What to learn / priorities - enhanced
  if (has(/(what to learn|priorities|what's important|focus|what should i|recommend|suggest|advice)/)) {
    return {
      text: '**Your Onboarding Priorities** - Complete Guide:\n\n**Priority 1: Understand DQ Organization**\n• **Why:** It gives context for everything else\n• **What to learn:** What DQ is, how it works, the frameworks\n• **How to use:** Foundation for understanding everything else\n\n**Priority 2: Learn GHC Framework**\n• **Why:** Defines standards, quality, and decision-making\n• **What to learn:** What GHC is, how to use it, when it applies\n• **How to use:** Reference for decisions and quality standards\n\n**Priority 3: Understand 6XD**\n• **Why:** This is how work actually happens and where you contribute\n• **What to learn:** What 6XD is, how it connects to Agile TMS/ATP\n• **How to use:** Understand how your work flows and contributes\n\n**Priority 4: Know Your Role**\n• **Why:** See how everything connects to your specific position\n• **What to learn:** Your responsibilities, contribution paths\n• **How to use:** Guide your work and understand your impact\n\n**Priority 5: Know Where to Get Help**\n• **Why:** Support resources for when you need assistance\n• **What to learn:** Who to contact, when to ask for help\n• **How to use:** Access support when needed\n\n**Tip:** Go through each section in order. Each one builds on the previous. Take your time!',
      suggestions: ['Tell me about DQ Organization', 'What is GHC?', 'What is 6XD?']
    };
  }

  // Relationship between concepts - enhanced
  if (has(/(relationship|how are they related|difference between|ghc vs|6xd vs|connection|link)/)) {
    return {
      text: '**How GHC and 6XD Work Together** - Complete Guide:\n\n**GHC (Golden Honeycomb of Competence):**\n• Defines standards, capability, and decision-making foundations\n• The "what" and "why" - principles and quality standards\n• Ensures everyone works from the same base\n• Sets the foundation for all work\n\n**6XD (6X Digitals):**\n• The operational system - how work actually happens\n• The "how" - turns vision into real outcomes\n• Where every associate contributes to DQ products\n• Connects to Agile TMS and ATP\n\n**The Connection:**\n6XD is part of GHC but separate because it\'s the lived, operational system. GHC sets the standards; 6XD is how you deliver against those standards through Agile TMS and ATP.\n\n**How to Use This Understanding:**\n• **For Decision Making:** Use GHC to understand standards, 6XD to see how it\'s implemented\n• **For Your Work:** GHC guides quality, 6XD guides operations\n• **For Understanding Flow:** GHC is the foundation, 6XD is the execution\n• **For Development:** GHC shows what to learn, 6XD shows how to apply it\n\n**Key Takeaway:** Understand GHC first (the foundation), then 6XD (how you contribute). They work together - GHC sets standards, 6XD delivers them.',
      suggestions: ['Tell me more about GHC', 'Tell me more about 6XD', 'What is my role?']
    };
  }

  // Default response - more helpful
  return {
    text: 'I can help you with several things:\n\n**Getting Started:**\n• Where to begin your onboarding\n• First day priorities\n• What to focus on\n\n**Understanding DQ:**\n• DQ Organization overview\n• GHC framework (standards & capability)\n• 6XD (how work happens)\n\n**Your Role:**\n• Finding your position\n• Understanding responsibilities\n• How you contribute\n\n**Support:**\n• Where to get help\n• Tools and systems\n• Contacts and resources\n\nWhat would you like to know more about?',
    suggestions: ['Where do I start?', 'What is DQ?', 'What is GHC?', 'I need help']
  };
}

export function OnboardingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to DQ! I\'m your onboarding assistant.\n\nI can help you:\n• Start your onboarding journey\n• Understand DQ Organization and frameworks\n• Find your role and responsibilities\n• Get support and answers\n\nWhat would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ['Where do I start?', 'What is DQ?', 'What is GHC?', 'I need help']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const response = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // REMOVED: Automatic navigation - user can navigate manually if needed
      // The chatbot now provides comprehensive summaries and explanations
      // without automatically redirecting users to other pages
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:scale-110"
        aria-label="Open Onboarding Assistant"
        style={{
          background: 'linear-gradient(135deg, #FB5535 0%, #030F35 100%)',
          boxShadow: '0 4px 20px rgba(251, 85, 53, 0.4)'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-200 flex flex-col max-h-[600px]">
          {/* Header */}
          <div 
            className="p-4 text-white flex justify-between items-center"
            style={{
              background: 'linear-gradient(135deg, #FB5535 0%, #030F35 100%)'
            }}
          >
            <div>
              <h3 className="font-semibold text-base">Onboarding Assistant</h3>
              <p className="text-xs text-white/80">I'm here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#030F35] text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
                
                {/* Show suggestions after bot messages */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={`${suggestion}-${idx}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-[#FB5535] transition-colors text-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex gap-1 items-center">
                    <Loader size={16} className="animate-spin text-[#FB5535]" />
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about onboarding..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-[#030F35] text-white rounded-lg hover:bg-[#0B1C3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Where do I start?" or "What is GHC?"
            </p>
          </div>
        </div>
      )}
    </>
  );
}
