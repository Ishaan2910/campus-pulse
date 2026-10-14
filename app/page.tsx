"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  AlertTriangle, 
  Clock, 
  Layers, 
  BrainCircuit, 
  Play, 
  Plus, 
  ShieldAlert, 
  Copy, 
  Check, 
  X 
} from "lucide-react";

interface SubjectItem {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  attended: number;
  total: number;
  internalMarks: number;
  maxInternal: number;
  weakChapter: string;
  strongChapter: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  techStack: string[];
  githubUrl: string;
  description: string;
  status: string;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  { code: "AI501", name: "Deep Learning & Neural Networks", faculty: "Dr. K. Sharma", credits: 4, attended: 24, total: 30, internalMarks: 38, maxInternal: 50, weakChapter: "Backpropagation Mathematical Derivations", strongChapter: "Convolutional Neural Networks (CNN)" },
  { code: "AI502", name: "Natural Language Processing (NLP)", faculty: "Prof. S. Verma", credits: 4, attended: 18, total: 28, internalMarks: 29, maxInternal: 50, weakChapter: "Transformer Attention Mechanisms & BERT", strongChapter: "N-gram Language Modeling & Tokenization" },
  { code: "AI503", name: "Reinforcement Learning", faculty: "Dr. P. Sen", credits: 3, attended: 19, total: 26, internalMarks: 34, maxInternal: 50, weakChapter: "Q-Learning & Bellman Optimality Equations", strongChapter: "Multi-Armed Bandit Exploration" },
  { code: "CS504", name: "Design & Analysis of Algorithms", faculty: "Prof. A. Rao", credits: 4, attended: 22, total: 30, internalMarks: 31, maxInternal: 50, weakChapter: "NP-Completeness Reductions & Flow Networks", strongChapter: "Divide & Conquer, Dynamic Programming" },
  { code: "AI505", name: "Computer Vision & Image Processing", faculty: "Dr. R. Bannerjee", credits: 3, attended: 25, total: 28, internalMarks: 44, maxInternal: 50, weakChapter: "Feature Extraction & SIFT/SURF Descriptors", strongChapter: "Object Detection (YOLO Architectures)" },
  { code: "CS506", name: "Cloud Infrastructure & MLOps", faculty: "Prof. H. Vance", credits: 3, attended: 17, total: 26, internalMarks: 27, maxInternal: 50, weakChapter: "Kubernetes Model Serving & CI/CD Pipelines", strongChapter: "Docker Containerization & AWS S3 Staging" },
  { code: "MA507", name: "Discrete Mathematics & Graph Theory", faculty: "Dr. T. Agarwal", credits: 3, attended: 23, total: 28, internalMarks: 42, maxInternal: 50, weakChapter: "Generating Functions & Recurrence Relations", strongChapter: "Eulerian & Hamiltonian Graph Paths" }
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "PROJ-101",
    title: "Real-Time Brain Tumor Segmentation",
    category: "Machine Learning",
    techStack: ["PyTorch", "U-Net", "OpenCV", "FastAPI"],
    githubUrl: "https://github.com",
    description: "Multi-modal MRI image segmentation utilizing ResNet-50 backbone with 94.2% dice coefficient.",
    status: "Verified"
  },
  {
    id: "PROJ-102",
    title: "Campus Pulse LMS Microservices Engine",
    category: "Web App",
    techStack: ["Next.js", "Docker", "Kubernetes", "Redis"],
    githubUrl: "https://github.com",
    description: "Automated student monitoring pipeline with continuous event logging and predictive score analysis.",
    status: "Verified"
  }
];

export default function CampusPulseApp() {
  const [activeTab, setActiveTab] = useState<string>("attendance");
  const [subjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);

  const student = {
    name: "Alex Carter",
    id: "22BCSEAI081",
    department: "Computer Science & Engineering (AI & ML)",
    semester: "Semester 5",
    cgpa: 7.62
  };

  // Detention Appeal Modal State
  const [showAppealModal, setShowAppealModal] = useState<boolean>(false);
  const [appealReason, setAppealReason] = useState<string>("National Hackathon Participation (Smart India Hackathon)");
  const [targetSubject, setTargetSubject] = useState<string>("AI502: Natural Language Processing (NLP)");
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  // New Project Form Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Machine Learning");
  const [newTech, setNewTech] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");

  // Code Sandbox State
  const [code, setCode] = useState<string>(
`# Python 3.11 - Scaled Dot-Product Attention
import numpy as np

def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
    return np.matmul(weights, V)

Q = np.random.rand(2, 4)
K = np.random.rand(2, 4)
V = np.random.rand(2, 4)

out = attention(Q, K, V)
print("Execution Successful!")
print("Computed Context Vector Shape:", out.shape)`
  );
  const [terminalOutput, setTerminalOutput] = useState<string>("Click 'Run Code' to execute script inside virtual sandbox.");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hello Alex! I am your AI Academic Copilot. Ask me about your 7 courses, attendance math, or generating a detention defense appeal letter!" }
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Aggregate Attendance Math
  const totalClassesSum = subjects.reduce((acc, s) => acc + s.total, 0);
  const totalAttendedSum = subjects.reduce((acc, s) => acc + s.attended, 0);
  const overallAttendancePct = Math.round((totalAttendedSum / totalClassesSum) * 100);
  const overallNeededTo75 = Math.max(0, Math.ceil((0.75 * totalClassesSum - totalAttendedSum) / 0.25));

  const generatedAppealLetter = `To,
The Head of Department / Dean of Academic Affairs,
Department of ${student.department},

Subject: Application for Attendance Condonation / On-Duty (OD) Regularization

Respected Sir/Madam,

I am ${student.name} (Roll No: ${student.id}), studying in ${student.semester} of B.Tech CSE (AI & ML). 

My current attendance in ${targetSubject} stands below the mandatory 75% examination threshold due to my participation in:
"${appealReason}".

I have maintained a cumulative CGPA of ${student.cgpa} and have completed all relevant continuous assessment modules and laboratory tasks. I respectfully request you to grant me On-Duty (OD) condonation for the missed lecture hours so that I remain eligible for the upcoming semester examinations.

Relevant proof and event verification documents are attached herewith.

Thanking you.

Sincerely,
${student.name}
Roll No: ${student.id}
Date: ${ new Date().toLocaleDateString()}`;

  const handleSendMessage = (customText?: string) => {
    const text = customText || inputQuery;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    if (!customText) setInputQuery("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "Review your weak chapters in NLP (Transformers) and MLOps (Kubernetes) to protect your semester GPA.";

      if (lower.includes("appeal") || lower.includes("od") || lower.includes("letter")) {
        botResponse = "I have drafted your formal OD appeal letter! Click the 'Generate OD / Detention Appeal' button in the Attendance tab to copy and submit it to the HOD.";
      } else if (lower.includes("attendance") || lower.includes("75")) {
        botResponse = `Your aggregate attendance is ${overallAttendancePct}%. You are under the 75% criteria in NLP (64%) and MLOps (65%). Attend the next ${overallNeededTo75} classes continuously, or submit an OD appeal letter.`;
      } else if (lower.includes("code") || lower.includes("sandbox")) {
        botResponse = "Your attention calculation handles matrix scaling cleanly with np.sqrt(d_k). Ready for embedding layer tests!";
      }

      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 300);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput("Compiling script in virtual container...");
    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(">> Python 3.11.8 environment\n>> Running script...\n\nExecution Successful!\nComputed Context Vector Shape: (2, 4)\nProcess exited with status 0 (0.12s)");
    }, 600);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ProjectItem = {
      id: "PROJ-" + Date.now().toString(),
      title: newTitle,
      category: newCategory,
      techStack: newTech.split(",").map(t => t.trim()).filter(Boolean),
      githubUrl: "https://github.com",
      description: newDesc,
      status: "Verified"
    };

    setProjects([created, ...projects]);
    setShowAddModal(false);
    setNewTitle("");
    setNewTech("");
    setNewDesc("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-gray-900 tracking-tight">CampusPulse AI</h1>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                B.Tech CSE (AI &amp; ML)
              </span>
            </div>
            <p className="text-xs text-gray-500">Autonomous Student Academic Intelligence &amp; Action Hub</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs overflow-x-auto">
          {[
            { id: "attendance", label: "Attendance Analysis" },
            { id: "overview", label: "Overview" },
            { id: "marks", label: "7-Subject Marks" },
            { id: "projects", label: "Project & App Hub" },
            { id: "sandbox", label: "Code Sandbox" },
            { id: "sprint", label: "Study Sprint" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* TAB 1: ATTENDANCE ANALYSIS & DETENTION DEFENSE APPEAL */}
          {activeTab === "attendance" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Attendance Analysis &amp; Detention Clearance</h2>
                  <p className="text-xs text-gray-500">Official 75% examination eligibility tracker across all 7 courses.</p>
                </div>
                
                <button
                  onClick={() => setShowAppealModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <ShieldAlert className="h-4 w-4" /> Generate OD / Detention Appeal
                </button>
              </div>

              {/* Alert Ribbon */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-red-900">Exam Barring Warning: {overallAttendancePct}% Aggregate Attendance</h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      You are in the critical detention zone for <strong>AI502 (NLP: 64%)</strong> and <strong>CS506 (MLOps: 65%)</strong>. Submit an OD request or attend all upcoming lectures.
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-red-700 uppercase">Recovery Target</span>
                  <div className="text-base font-black text-red-900">+{overallNeededTo75} Classes</div>
                </div>
              </div>

              {/* Subject Breakdown List */}
              <div className="space-y-3">
                {subjects.map((sub) => {
                  const pct = Math.round((sub.attended / sub.total) * 100);
                  const isSafe = pct >= 75;
                  const needed = Math.max(0, Math.ceil((0.75 * sub.total - sub.attended) / 0.25));

                  return (
                    <div key={sub.code} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{sub.name}</span>
                          <span className="text-gray-500 block">{sub.code} · Instructor: {sub.faculty}</span>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isSafe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {pct}% {isSafe ? "(Eligible)" : "(Detention Risk)"}
                          </span>
                          <span className="text-gray-500 block text-xs mt-1">{sub.attended} of {sub.total} Classes</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${isSafe ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className={isSafe ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                          {isSafe ? "✓ Safe from exam hall barring." : `⚠ Needs next ${needed} consecutive classes without missing.`}
                        </span>
                        {!isSafe && (
                          <button
                            onClick={() => {
                              setTargetSubject(`${sub.code}: ${sub.name}`);
                              setShowAppealModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Draft OD Letter &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    AC
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                    <p className="text-xs text-gray-500">{student.department} · {student.semester} (Roll: {student.id})</p>
                    <div className="mt-2 inline-block text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded font-semibold">
                      Attendance Recovery Required
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center min-w-20">
                    <span className="text-xs font-semibold text-gray-500 uppercase">CGPA</span>
                    <div className="text-2xl font-bold text-indigo-600">{student.cgpa}</div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center min-w-20">
                    <span className="text-xs font-semibold text-red-600 uppercase">Attendance</span>
                    <div className="text-2xl font-bold text-red-600">{overallAttendancePct}%</div>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center min-w-20">
                    <span className="text-xs font-semibold text-indigo-700 uppercase">Projects</span>
                    <div className="text-2xl font-bold text-indigo-700">{projects.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" /> 7 Enrolled AI &amp; ML Courses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {subjects.map((s) => {
                    const pct = Math.round((s.attended / s.total) * 100);
                    return (
                      <div key={s.code} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800">{s.name}</span>
                          <div className="text-xs text-gray-500">{s.code} · {s.credits} Credits</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          pct >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 7-SUBJECT MARKS */}
          {activeTab === "marks" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Continuous Assessment Marks (Out of 50)</h2>
              <div className="space-y-4">
                {subjects.map((sub) => (
                  <div key={sub.code} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">{sub.name} ({sub.code})</span>
                      <span className="text-base font-bold text-gray-900">{sub.internalMarks} / {sub.maxInternal}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${(sub.internalMarks / sub.maxInternal) * 100}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 bg-red-50 text-red-800 rounded"><strong>Weak:</strong> {sub.weakChapter}</div>
                      <div className="p-2 bg-green-50 text-green-800 rounded"><strong>Strong:</strong> {sub.strongChapter}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Project &amp; App Hub</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Upload Project
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-900">{p.title}</h3>
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-xs font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CODE SANDBOX */}
          {activeTab === "sandbox" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Interactive Code Sandbox (Python 3.11)</h2>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> {isRunning ? "Executing..." : "Run Code"}
                </button>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full bg-gray-950 text-green-400 p-4 rounded-xl font-mono text-xs focus:outline-none"
                spellCheck={false}
              />

              <div className="bg-gray-900 text-gray-300 p-4 rounded-xl font-mono text-xs space-y-1">
                <div className="text-gray-500 font-bold uppercase text-xs">Output Console:</div>
                <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
              </div>
            </div>
          )}

          {/* TAB 6: STUDY SPRINT */}
          {activeTab === "sprint" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">7-Day Study Revision Sprint</h2>
              <div className="space-y-2 text-xs">
                {[
                  { day: "Day 1", subject: "AI502 NLP", topic: "Transformer Self-Attention Calculations", time: "60 mins" },
                  { day: "Day 2", subject: "CS506 MLOps", topic: "Kubernetes Deployments & Service Routing", time: "45 mins" },
                  { day: "Day 3", subject: "AI503 RL", topic: "Q-Learning Bellman Equations Practice", time: "50 mins" },
                  { day: "Day 4", subject: "CS504 Algorithms", topic: "Ford-Fulkerson Max Flow Reductions", time: "60 mins" },
                  { day: "Day 5", subject: "AI501 Deep Learning", topic: "Backpropagation Derivations", time: "45 mins" },
                  { day: "Day 6", subject: "MA507 Discrete Math", topic: "Generating Functions for Recurrences", time: "40 mins" },
                  { day: "Day 7", subject: "AI505 CV Lab", topic: "SIFT Filter Implementations", time: "50 mins" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div><strong>{item.day} · {item.subject}:</strong> {item.topic}</div>
                    <span className="text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Copilot Drawer */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col h-full min-h-[540px] sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Bot className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-xs text-gray-900">CampusPulse Copilot</h3>
                <p className="text-xs text-gray-500">AI Academic &amp; OD Mentor</p>
              </div>
            </div>

            <div className="py-2 flex flex-wrap gap-1 border-b border-gray-100">
              <button
                onClick={() => handleSendMessage("How do I file an On-Duty appeal letter for NLP?")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition"
              >
                OD Appeal Letter
              </button>
              <button
                onClick={() => handleSendMessage("Review my attention python script")}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition"
              >
                Code Review
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-xl max-w-xs ${m.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800 border border-gray-200"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatScrollRef} />
            </div>

            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask about marks, OD appeal, or code..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* DETENTION DEFENSE APPEAL MODAL */}
      {showAppealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <h3 className="font-bold text-sm text-gray-900">Attendance Condonation &amp; OD Appeal Generator</h3>
              </div>
              <button onClick={() => setShowAppealModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Target Subject Facing Detention</label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                >
                  {subjects.map(s => {
                    const subjectPct = Math.round((s.attended / s.total) * 100);
                    return (
                      <option key={s.code} value={`${s.code}: ${s.name}`}>
                        {s.code}: {s.name} ({subjectPct}% attendance)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reason for Absence / Condonation Claim</label>
                <input
                  type="text"
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                  placeholder="e.g. National Hackathon / Paper Presentation / Medical Condonation"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Auto-Drafted Formal Institutional Letter</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto font-mono text-gray-700 leading-relaxed text-xs">
                  <pre className="whitespace-pre-wrap font-sans">{generatedAppealLetter}</pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAppealModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedAppealLetter);
                  setCopiedLetter(true);
                  setTimeout(() => setCopiedLetter(false), 2500);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                {copiedLetter ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLetter ? "Copied to Clipboard!" : "Copy Official Letter"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-base text-gray-900">Upload Project / Model</h3>
            <form onSubmit={handleCreateProject} className="space-y-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drone Obstacle Detection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch, OpenCV, FastAPI"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of the architecture..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

