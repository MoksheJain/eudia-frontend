"use client";
import { useState, useCallback, useEffect, FC } from "react";
import {
  Bot,
  MessageSquare,
  FileText,
  LayoutDashboard,
  Users,
  HelpCircle,
  Settings,
  Bell,
  Filter,
  ChevronRight,
  X,
  Send,
  Clock, // Added Clock icon for chat/time
} from "lucide-react";

// NOTE: Since the StarsBackground component is not provided, I will comment it out
// import { StarsBackground } from "@/components/ui/stars-background";

interface Contract {
  id: number;
  name: string;
  client: string;
  date: string;
  type: string;
  status: "Active" | "Pending" | "Signed" | "Draft";
}

interface ChatHistoryItem {
  id: number;
  title: string;
  lastMessage: string;
  date: string;
  type: "Legal Q&A" | "Contract Drafting";
}

interface Source {
  file: string;
  link: string;
  preview: string;
  title: string;
  type: "judgment" | "statute" | "document" | string;
}

interface MockResponseWithSources {
  answer: string;
  query: string;
  sources: Source[];
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  sources?: Source[];
}

interface SidebarItemProps {
  icon: any;
  label: string;
  isActive: boolean;
}

interface PanelProps {
  chatWidth: number;
  onClose: () => void;
}

// --- Mock Data Structures ---

const MOCK_STRUCTURED_RESPONSE: MockResponseWithSources = {
  query: "Explain Section 125 CrPC regarding maintenance of wife.",
  answer: `Section 125 of the Code of Criminal Procedure (CrPC) in India deals with the maintenance of a wife, children, and parents. Here's a breakdown of the key aspects:\n\n**Maintenance under Section 125 CrPC:**\n\n1. **Wife:** A wife is entitled to maintenance from her husband if he has sufficient means to maintain her but refuses to do so.\n2. **Children:** Both legitimate and illegitimate children are entitled to maintenance from their parents.\n3. **Parents:** A person is liable to maintain their parents if they are unable to maintain themselves.\n\n[... truncated legal explanation ...]`,
  sources: [
    {
      file: "2023_16_1209_1524_EN.pdf",
      link: "https://drive.google.com/file/d/1qH3G5c0dD2HL9niIgDeySFeCtxiG2fds/view?usp=sharing",
      preview:
        "150. Matrimonial and child care related bene\ufb01 ts include the provisions...",
      title: "Maintenance under CrPC",
      type: "judgment",
    },
    // Truncated sources for brevity, original sources structure is used.
  ],
};

const contracts: Contract[] = [
  {
    id: 1,
    name: "NDA - Project Alpha",
    client: "TechCorp Solutions",
    date: "2024-10-01",
    type: "NDA",
    status: "Active",
  },
  {
    id: 2,
    name: "Service Agreement - Q4",
    client: "Global Industries Inc.",
    date: "2024-09-15",
    type: "MSA",
    status: "Pending",
  },
  {
    id: 3,
    name: "Employment Contract - Jane Doe",
    client: "HR Department",
    date: "2024-10-20",
    type: "HR",
    status: "Signed",
  },
  {
    id: 4,
    name: "Partnership Deal - Beta",
    client: "Innovate Labs",
    date: "2024-11-05",
    type: "Partnership",
    status: "Draft",
  },
];

const recentChats: ChatHistoryItem[] = [
  {
    id: 1,
    title: "Maintenance Law Query",
    lastMessage: "Explain Section 125 CrPC regarding maintenance...",
    date: "2024-11-07",
    type: "Legal Q&A",
  },
  {
    id: 2,
    title: "Drafting NDA for Acme",
    lastMessage: "I need a simple NDA between Acme Corp and Jane Doe...",
    date: "2024-11-06",
    type: "Contract Drafting",
  },
  {
    id: 3,
    title: "Intellectual Property Rights",
    lastMessage: "What is the duration of a standard patent in India?",
    date: "2024-11-05",
    type: "Legal Q&A",
  },
  {
    id: 4,
    title: "Refining Termination Clause",
    lastMessage: "Please adjust the termination clause to 90 days notice.",
    date: "2024-11-05",
    type: "Contract Drafting",
  },
];

// --- Sub-Components ---

interface SourceAttributionProps {
  sources: Source[];
}

const SourceAttribution: FC<SourceAttributionProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 group"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 group-hover:bg-blue-500 text-gray-600 group-hover:text-white rounded-full text-xs font-semibold transition-colors">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {source.title || source.file}
                </span>
                <span className="flex-shrink-0 px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full capitalize font-medium">
                  {source.type}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {source.preview.replace(/[\u0000-\u001f\u007f-\u009f]/g, "")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const SidebarItem: FC<SidebarItemProps> = ({ icon: Icon, label, isActive }) => (
  <a
    href="#"
    className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </a>
);

// --- 1. Original Chat Panel (Legal Assistant Bot) ---

const ChatPanel: FC<PanelProps> = ({ chatWidth, onClose }) => {
  const initialMessages: ChatMessage[] = [
    {
      role: "bot",
      text: MOCK_STRUCTURED_RESPONSE.answer.trim(),
      sources: MOCK_STRUCTURED_RESPONSE.sources,
    },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: input.trim() },
        {
          role: "bot",
          text: "Thank you for your question. As a legal assistant bot, I am processing this query now...",
          sources: undefined,
        },
      ]);
      setInput("");
    }
  };

  return (
    <div
      className="flex flex-col bg-white border-l border-gray-200 shadow-2xl transition-all duration-300 ease-in-out h-full"
      style={{ width: `${chatWidth}vw`, minWidth: "300px" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-500 text-white rounded-tr-xl">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="text-lg font-bold">Legal Assistant Bot</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Close Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] shadow-md ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none p-3 rounded-xl"
                  : "bg-gray-100 text-gray-800 rounded-tl-none p-3 rounded-xl"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
              {msg.role === "bot" && msg.sources && msg.sources.length > 0 && (
                <SourceAttribution sources={msg.sources} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-full border border-gray-300 p-1">
          <input
            type="text"
            placeholder="Ask a legal question..."
            className="flex-1 bg-transparent p-2 focus:outline-none text-sm"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSend()
            }
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
            disabled={!input.trim()}
            aria-label="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. New Contract Generator Panel (Contract Drafting Studio) ---

const ContractGeneratorPanel: FC<PanelProps> = ({ chatWidth, onClose }) => {
  const initialMessages: ChatMessage[] = [
    {
      role: "bot",
      text: "Hello! I'm the Contract Drafting Studio. I can help you draft a custom legal document. Please describe the contract you need (e.g., 'A simple NDA between Acme Corp and Jane Doe') and specify the key terms.",
    },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      const userQuery = input.trim();
      let botResponse: ChatMessage;

      if (messages.length === 1) {
        // First user input is the generation prompt
        botResponse = {
          role: "bot",
          text: `Processing request for: "${userQuery}".\n\n[Drafting Document...]\n\n**DOCUMENT DRAFT - Non-Disclosure Agreement (NDA)**\n\nThis Non-Disclosure Agreement ("Agreement") is made effective [Date] by and between:\n\n**1. Disclosing Party:**\nAcme Corporation, located at 123 Main St.\n\n**2. Receiving Party:**\nJane Doe, residing at 456 Oak Ave.\n\n**3. Purpose:**\nThe parties are entering into a business relationship concerning proprietary technology research (the "Purpose").\n\n**5. Obligations:**\nThe Receiving Party agrees to use the Confidential Information solely for the Purpose and shall not disclose it to any third party for a period of five (5) years.\n\n--- END OF DRAFT PREVIEW ---\n\nThis preliminary draft is ready. You can download the full file for editing, or you can refine a specific clause by typing your request below.`,
        };
      } else {
        // Subsequent inputs are for refinement
        botResponse = {
          role: "bot",
          text: `Thank you for your refinement suggestion: "${userQuery}". I am updating the draft now. (Mock refinement complete. The contract structure has been adjusted.)`,
        };
      }

      setMessages((prev) => [
        ...prev,
        { role: "user", text: userQuery },
        botResponse,
      ]);
      setInput("");
    }
  };

  return (
    <div
      className="flex flex-col bg-white border-l border-gray-200 shadow-2xl transition-all duration-300 ease-in-out h-full"
      style={{ width: `${chatWidth}vw`, minWidth: "300px" }}
    >
      {/* Subtle difference: changed from bg-blue-500 to bg-emerald-600 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-600 text-white rounded-tr-xl">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-bold">Contract Drafting Studio</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-emerald-700 transition-colors"
          aria-label="Close Contract Generator"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] shadow-md ${
                msg.role === "user"
                  ? // Subtle difference: changed from bg-blue-500 to bg-emerald-500
                    "bg-emerald-500 text-white rounded-br-none p-3 rounded-xl"
                  : "bg-gray-100 text-gray-800 rounded-tl-none p-3 rounded-xl"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
              {/* NOTE: No SourceAttribution component is used here */}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-full border border-gray-300 p-1">
          <input
            type="text"
            // Subtle difference: changed placeholder text
            placeholder="Describe the contract you want to generate..."
            className="flex-1 bg-transparent p-2 focus:outline-none text-sm"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSend()
            }
          />
          <button
            onClick={handleSend}
            // Subtle difference: changed from bg-blue-500 to bg-emerald-600
            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
            disabled={!input.trim()}
            aria-label="Generate Contract"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Sub-Components for New Tabs ---

const RecentContractsList: FC = () => (
  <div className="space-y-4">
    {contracts.length === 0 ? (
      <p className="text-gray-500">No recent contracts found.</p>
    ) : (
      contracts.map((contract) => (
        <div
          key={contract.id}
          className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {contract.name}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{contract.client}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{contract.date}</span>
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {contract.type}
            </span>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                contract.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : contract.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {contract.status}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

const RecentChatsList: FC = () => (
  <div className="space-y-4">
    {recentChats.length === 0 ? (
      <p className="text-gray-500">No recent chats found.</p>
    ) : (
      recentChats.map((chat) => (
        <div
          key={chat.id}
          className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
        >
          <div className="flex items-start space-x-4">
            {chat.type === "Legal Q&A" ? (
              <Bot className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {chat.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {chat.date}
            </span>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                chat.type === "Legal Q&A"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {chat.type === "Legal Q&A" ? "Q&A" : "Drafting"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
);

// --- Main App/Dashboard Component ---

const MIN_CHAT_WIDTH = 20;
const MAX_CHAT_WIDTH = 80;
const SIDEBAR_WIDTH_PX = 256;

export default function App() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  console.log(email);
  const [activePanel, setActivePanel] = useState<"chat" | "generator" | null>(
    null
  );
  // New state for tabs in the main dashboard content
  const [activeDataTab, setActiveDataTab] = useState<"contracts" | "chats">(
    "contracts"
  );
  const isPanelOpen = activePanel !== null;
  const closePanel = useCallback(() => setActivePanel(null), []);

  const [chatWidth, setChatWidth] = useState<number>(25);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      if (isPanelOpen) {
        setChatWidth((prevWidth) =>
          Math.max(MIN_CHAT_WIDTH, Math.min(MAX_CHAT_WIDTH, prevWidth))
        );
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isPanelOpen]);

  const startResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const doResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const totalContentWidth = viewportWidth - SIDEBAR_WIDTH_PX;
      const newDashboardWidthPx = e.clientX - SIDEBAR_WIDTH_PX;

      let newChatWidthPercent =
        100 - (newDashboardWidthPx / totalContentWidth) * 100;

      let newChatWidthVW =
        (newChatWidthPercent / 100) * (totalContentWidth / viewportWidth) * 100;

      newChatWidthVW = Math.max(
        MIN_CHAT_WIDTH,
        Math.min(MAX_CHAT_WIDTH, newChatWidthVW)
      );

      setChatWidth(newChatWidthVW);
    },
    [isResizing, viewportWidth]
  );

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", doResize);
      document.addEventListener("mouseup", stopResize);
    } else {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
    }
    return () => {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, doResize, stopResize]);

  const dashboardWidthStyle: string = isPanelOpen
    ? `calc(100% - ${chatWidth}vw)`
    : "100%";

  // Tab button styling utility
  const getTabClasses = (tabName: "contracts" | "chats") =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      activeDataTab === tabName
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* <StarsBackground /> */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shadow-lg z-10 flex-shrink-0">
        <div>
          <div className="text-2xl font-bold text-blue-600 mb-8 flex items-center">
            Nyay Sahayak
          </div>
          <nav className="space-y-2">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={true}
            />
            <SidebarItem icon={FileText} label="Contracts" isActive={false} />
            <SidebarItem icon={Users} label="Clients" isActive={false} />
            <SidebarItem
              icon={HelpCircle}
              label="Help Center"
              isActive={false}
            />
            <SidebarItem icon={Settings} label="Settings" isActive={false} />
          </nav>
        </div>
      </aside>

      <div
        className={`flex-1 flex overflow-hidden z-10 ${
          isResizing ? "cursor-ew-resize" : ""
        }`}
      >
        <main
          className="flex flex-col p-8 transition-all duration-300 ease-in-out overflow-y-auto min-w-0"
          style={{ width: dashboardWidthStyle }}
        >
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <div className="flex items-center space-x-4">
              <button
                className="relative text-gray-500 hover:text-gray-700"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              </button>
              <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                MJ
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 space-y-8">
            {/* Legal Q&A Assistant Button */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bot className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Legal Q&A Assistant
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get instant answers about contract clauses, legal terms, and
                    compliance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePanel("chat")}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 ${
                  activePanel !== null
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md"
                }`}
                disabled={activePanel !== null}
              >
                <MessageSquare className="w-5 h-5" />
                <span>
                  {activePanel === "chat" ? "Chatting..." : "Start Chatting"}
                </span>
              </button>
            </div>

            {/* Legal Contract Generator Button (Subtle difference in color/icon) */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Legal Contract Generator
                  </h3>
                  <p className="text-sm text-gray-500">
                    Draft custom contracts quickly using an interactive studio.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePanel("generator")}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 ${
                  activePanel !== null
                    ? "bg-emerald-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
                }`}
                disabled={activePanel !== null}
              >
                <FileText className="w-5 h-5" />
                <span>
                  {activePanel === "generator"
                    ? "Drafting..."
                    : "Start Drafting"}
                </span>
              </button>
            </div>

            {/* Tabbed Recent Data Section */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-0 border-b border-gray-200">
                <div className="flex justify-between items-center px-6 pt-4">
                  <div className="flex border-b border-gray-200 -mb-px">
                    <button
                      onClick={() => setActiveDataTab("contracts")}
                      className={getTabClasses("contracts")}
                    >
                      Recent Contracts
                    </button>
                    <button
                      onClick={() => setActiveDataTab("chats")}
                      className={getTabClasses("chats")}
                    >
                      Recent Chats
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-blue-600 flex items-center text-sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </button>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Content Area for Tabs - Made scrollable if content overflows */}
              <div className="p-6 max-h-[400px] overflow-y-auto">
                {activeDataTab === "contracts" && <RecentContractsList />}
                {activeDataTab === "chats" && <RecentChatsList />}
              </div>
            </div>
          </div>
        </main>

        {isPanelOpen && (
          <div
            className="w-2 bg-gray-200 hover:bg-blue-400 transition-colors duration-150 cursor-ew-resize h-full z-20 flex-shrink-0"
            onMouseDown={startResize}
            aria-label="Resize Side Panel"
            role="separator"
          />
        )}

        <div
          className="h-full flex-shrink-0"
          style={{
            width: isPanelOpen ? `${chatWidth}vw` : "0",
            transition: "width 300ms ease-in-out",
            visibility: isPanelOpen ? "visible" : "hidden",
            opacity: isPanelOpen ? 1 : 0,
          }}
        >
          {activePanel === "chat" && (
            <ChatPanel chatWidth={chatWidth} onClose={closePanel} />
          )}
          {activePanel === "generator" && (
            <ContractGeneratorPanel
              chatWidth={chatWidth}
              onClose={closePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
