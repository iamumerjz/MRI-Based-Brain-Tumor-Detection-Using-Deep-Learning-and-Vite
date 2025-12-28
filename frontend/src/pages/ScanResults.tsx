import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  FileText,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{ original: string; overlay: string; heatmap: string }>({
    original: "",
    overlay: "",
    heatmap: ""
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(1); // Start with overlay
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "recommendations">("overview");

  const imageTypes = [
    { type: "original", label: "Original Scan" },
    { type: "overlay", label: "Grad-CAM Overlay" },
    { type: "heatmap", label: "Attention Heatmap" }
  ];

  useEffect(() => {
    fetchScanDetails();
  }, [scanId]);

  const fetchScanDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/scan/${scanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setScan(data);
        
        // Fetch all images
        const imagePromises = ["original", "overlay", "heatmap"].map(async (type) => {
          const imageRes = await fetch(`${API_URL}/scan/${scanId}/images/${type}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (imageRes.ok) {
            const blob = await imageRes.blob();
            return { type, url: URL.createObjectURL(blob) };
          }
          return null;
        });

        const imageResults = await Promise.all(imagePromises);
        const loadedImages = imageResults.reduce((acc, img) => {
          if (img) acc[img.type as keyof typeof acc] = img.url;
          return acc;
        }, { original: "", overlay: "", heatmap: "" });

        setImages(loadedImages);
      }
    } catch (error) {
      console.error("Failed to fetch scan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setSlideDirection("left");
    setCurrentImageIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNextImage = () => {
    setSlideDirection("right");
    setCurrentImageIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Scan not found</p>
          <Link to="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const classifications = scan.result?.allProbs
    ? Object.entries(scan.result.allProbs)
        .map(([type, prob]) => {
          const probability = typeof prob === 'number' 
            ? (prob > 1 ? prob : prob * 100)
            : 0;
          
          const isNoTumor = type.toLowerCase().includes('no tumor') || 
                            type.toLowerCase().includes('notumor') ||
                            type.toLowerCase() === 'normal';
          
          return {
            type,
            probability,
            isNoTumor,
            color: isNoTumor
              ? "from-green-500 to-emerald-500"
              : type.toLowerCase().includes("glioma")
              ? "from-red-500 to-orange-500"
              : type.toLowerCase().includes("meningioma")
              ? "from-yellow-500 to-amber-500"
              : type.toLowerCase().includes("pituitary")
              ? "from-blue-500 to-cyan-500"
              : "from-purple-500 to-pink-500",
          };
        })
        .sort((a, b) => b.probability - a.probability)
    : scan.result?.predClass
    ? [
        {
          type: scan.result.predClass,
          probability: scan.result.confidence,
          isNoTumor: !scan.result.hasTumor,
          color: !scan.result.hasTumor
            ? "from-green-500 to-emerald-500"
            : scan.result.predClass.toLowerCase().includes("glioma")
            ? "from-red-500 to-orange-500"
            : scan.result.predClass.toLowerCase().includes("meningioma")
            ? "from-yellow-500 to-amber-500"
            : scan.result.predClass.toLowerCase().includes("pituitary")
            ? "from-blue-500 to-cyan-500"
            : "from-purple-500 to-pink-500",
        }
      ]
    : [];

  const findings = scan.result?.hasTumor
    ? [
        `Detected ${scan.result.predClass} with ${scan.result.confidence.toFixed(1)}% confidence`,
        "Immediate consultation with neurologist recommended",
        "Additional imaging may be required",
        "Follow-up assessment within 48 hours advised"
      ]
    : [
        "No abnormal masses detected",
        "Brain structure appears normal",
        "Ventricles are of normal size and position",
        "No signs of edema or inflammation"
      ];

  const recommendations = scan.result?.hasTumor
    ? [
        "Schedule appointment with oncologist within 48 hours",
        "Consider additional contrast-enhanced MRI",
        "Biopsy may be required for definitive diagnosis",
        "Discuss treatment options with healthcare team"
      ]
    : [
        "Continue regular health check-ups",
        "Maintain healthy lifestyle habits",
        "Schedule routine follow-up in 12 months",
        "Report any new symptoms promptly"
      ];

  const currentImage = [images.original, images.overlay, images.heatmap][currentImageIndex];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-foreground">NeuroScan</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Compact Status Banner */}
        <div className={`rounded-xl p-4 mb-6 ${
          scan.result?.hasTumor 
            ? "bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20" 
            : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              scan.result?.hasTumor 
                ? "bg-gradient-to-br from-red-500 to-orange-500" 
                : "bg-gradient-to-br from-green-500 to-emerald-500"
            }`}>
              {scan.result?.hasTumor ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">
                {scan.result?.hasTumor ? "Tumor Detected" : "No Tumor Detected"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {scan.result?.hasTumor 
                  ? `${scan.result.predClass} • ${scan.result.confidence.toFixed(1)}% confidence`
                  : `Analysis complete • ${scan.result?.confidence.toFixed(1)}% confidence`
                }
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground">Scan ID</p>
              <p className="font-mono text-sm font-medium text-foreground">{scan.scanId}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">MRI Scan Analysis</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {scan.processingTime || "Processing..."}
                </div>
              </div>
              
              {/* Image Carousel */}
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative w-full max-w-3xl h-[600px] mx-auto bg-gray-900 rounded-xl overflow-hidden">
                  {currentImage ? (
                    <img
                      key={currentImageIndex}
                      src={currentImage}
                      alt={imageTypes[currentImageIndex].label}
                      className={`w-full h-full object-contain transition-all duration-500 ${
                        slideDirection === "right" 
                          ? "animate-in slide-in-from-right-5" 
                          : "animate-in slide-in-from-left-5"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Image Label */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-white text-sm font-medium">
                      {imageTypes[currentImageIndex].label}
                    </p>
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex justify-center gap-3 mt-4">
                  {imageTypes.map((img, index) => (
                    <button
                      key={img.type}
                      onClick={() => {
                        setSlideDirection(index > currentImageIndex ? "right" : "left");
                        setCurrentImageIndex(index);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentImageIndex === index
                          ? "bg-primary text-white shadow-lg scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tabs Card */}
            <Card className="p-6">
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {(["overview", "details", "recommendations"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Key Findings
                  </h3>
                  <ul className="space-y-3">
                    {findings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          scan.result?.hasTumor ? "bg-red-500" : "bg-green-500"
                        }`} />
                        <span className="text-foreground text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Scan ID</span>
                      </div>
                      <p className="font-mono font-medium text-foreground text-sm">{scan.scanId}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Date & Time</span>
                      </div>
                      <p className="font-medium text-foreground text-sm">
                        {new Date(scan.createdAt).toLocaleDateString()} at{" "}
                        {new Date(scan.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Processing Time</span>
                      </div>
                      <p className="font-medium text-foreground text-sm">{scan.processingTime}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Risk Level</span>
                      </div>
                      <p className={`font-medium text-sm ${
                        scan.result?.riskLevel === "High" ? "text-red-500" : "text-green-500"
                      }`}>{scan.result?.riskLevel}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recommended Next Steps
                  </h3>
                  <ul className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-sm font-medium">{index + 1}</span>
                        </div>
                        <span className="text-foreground text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Classification Results</h2>
              
              {classifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No classification data available</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {classifications.map((cls, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground capitalize text-sm">{cls.type}</span>
                        <span className={`font-bold text-sm ${
                          cls.probability > 50 
                            ? cls.isNoTumor
                              ? "text-green-500"
                              : "text-red-500"
                            : "text-muted-foreground"
                        }`}>
                          {cls.probability.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${cls.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${Math.min(cls.probability, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {classifications.length === 1 && (
                    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Showing primary classification only.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Confidence</h2>
              <div className="relative pt-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="url(#confidenceGradient)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(scan.result?.confidence || 0) * 3.77} 377`}
                      />
                      <defs>
                        <linearGradient id="confidenceGradient">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--primary-light))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-foreground">
                        {scan.result?.confidence.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  AI model confidence level
                </p>
              </div>
            </Card>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Disclaimer</p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                    For informational purposes only. Consult a healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanResults;