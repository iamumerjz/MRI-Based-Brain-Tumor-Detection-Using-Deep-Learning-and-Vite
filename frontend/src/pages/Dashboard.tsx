import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Upload,
  Clock,
  FileImage,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  Eye,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
    }
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/scan/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setScans(data.scans);
      }
    } catch (error) {
      console.error("Failed to fetch scans:", error);
      toast.error("Failed to load scans");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      toast.success("File uploaded!", {
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success("File uploaded!", {
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("scan", uploadedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/scan/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Scan uploaded successfully!", {
          description: "Analysis is in progress...",
        });
        setShowUploadModal(false);
        setUploadedFile(null);
        
        // Poll for results
        pollScanStatus(data.scanId);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to upload scan");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload scan");
    } finally {
      setUploading(false);
    }
  };

  const pollScanStatus = async (scanId: string) => {
    const token = localStorage.getItem("token");
    let attempts = 0;
    const maxAttempts = 60;

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`${API_URL}/scan/${scanId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.status === "completed") {
            clearInterval(interval);
            toast.success("Analysis completed!", {
              description: "Click to view results",
              action: {
                label: "View",
                onClick: () => navigate(`/scan-results/${scanId}`),
              },
            });
            fetchScans();
          } else if (data.status === "failed") {
            clearInterval(interval);
            toast.error("Analysis failed", {
              description: data.error || "Unknown error",
            });
            fetchScans();
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const calculateStats = () => {
    const totalScans = scans.length;
    const healthyResults = scans.filter(
      (s) => s.result && !s.result.hasTumor
    ).length;
    const detectedCases = scans.filter(
      (s) => s.result && s.result.hasTumor
    ).length;
    const avgConfidence = scans.length
      ? (
          scans.reduce(
            (sum, s) => sum + (s.result?.confidence || 0),
            0
          ) / scans.length
        ).toFixed(1)
      : "0";

    return [
      {
        label: "Total Scans",
        value: totalScans.toString(),
        icon: FileImage,
        trend: "+3 this month",
      },
      {
        label: "Healthy Results",
        value: healthyResults.toString(),
        icon: CheckCircle,
        trend: `${totalScans ? ((healthyResults / totalScans) * 100).toFixed(0) : 0}% rate`,
      },
      {
        label: "Detected Cases",
        value: detectedCases.toString(),
        icon: AlertCircle,
        trend: "Early detection",
      },
      {
        label: "Avg. Confidence",
        value: `${avgConfidence}%`,
        icon: TrendingUp,
        trend: "High accuracy",
      },
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                NeuroScan
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search scans..."
                  className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground">Neurologist</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {userName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your brain scan analyses
            </p>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="group"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus className="w-5 h-5" />
            New Scan
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-background border-border/50 hover:shadow-soft transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-primary mt-2">{stat.trend}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-background border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No scans yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload Your First Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <Link
                    key={scan.id}
                    to={`/scan-results/${scan.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          scan.status === "processing"
                            ? "bg-blue-500/10"
                            : scan.result?.hasTumor
                            ? "bg-amber-500/10"
                            : "bg-green-500/10"
                        }`}
                      >
                        {scan.status === "processing" ? (
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        ) : scan.result?.hasTumor ? (
                          <AlertCircle className="w-6 h-6 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {scan.status === "processing"
                              ? "Processing..."
                              : scan.result?.predClass || "Unknown"}
                          </p>
                          {scan.result?.confidence && (
                            <Badge
                              variant="secondary"
                              className={
                                scan.result.hasTumor
                                  ? "bg-amber-500/10 text-amber-600 border-0"
                                  : "bg-green-500/10 text-green-600 border-0"
                              }
                            >
                              {scan.result.confidence.toFixed(1)}% confidence
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {scan.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Upload MRI Scan
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={uploading}
              >
                ✕
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : uploadedFile
                  ? "border-green-500 bg-green-500/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {uploadedFile ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-foreground font-medium">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">
                    Drag and drop your MRI scan here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports DICOM, JPEG, PNG formats
                  </p>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".dcm,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                    <Button
                      variant="outline"
                      asChild
                      className="cursor-pointer"
                    >
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                disabled={!uploadedFile || uploading}
                onClick={handleAnalyze}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;