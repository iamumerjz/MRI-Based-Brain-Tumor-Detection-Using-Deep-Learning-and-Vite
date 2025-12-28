import { Brain, Target, Clock, Shield, Microscope, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Deep learning algorithms trained on thousands of MRI scans for accurate tumor detection.",
    },
    {
      icon: Target,
      title: "Precise Classification",
      description: "Identifies tumor type: Glioma, Meningioma, Pituitary, or confirms healthy tissue.",
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get comprehensive analysis in under 30 seconds. No waiting, no delays.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA compliant with end-to-end encryption. Your data never leaves our secure servers.",
    },
    {
      icon: Microscope,
      title: "Detailed Reports",
      description: "Receive comprehensive reports with tumor location, size estimation, and confidence scores.",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Compare scans over time to monitor treatment effectiveness and tumor progression.",
    },
  ];

  const tumorTypes = [
    {
      name: "Glioma",
      description: "Tumors arising from glial cells",
      color: "bg-red-500",
    },
    {
      name: "Meningioma",
      description: "Tumors in the meninges membrane",
      color: "bg-amber-500",
    },
    {
      name: "Pituitary",
      description: "Tumors in the pituitary gland",
      color: "bg-purple-500",
    },
    {
      name: "No Tumor",
      description: "Healthy brain tissue detected",
      color: "bg-green-500",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-glow opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-glow opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="text-gradient">NeuroScan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            State-of-the-art technology combined with medical expertise for reliable brain tumor detection.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tumor Classification Section */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12 border border-primary/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Tumor Classification Types
              </h3>
              <p className="text-muted-foreground mb-8">
                Our AI model is trained to detect and classify the most common types of brain tumors with high accuracy, helping doctors make informed decisions.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {tumorTypes.map((tumor, index) => (
                  <div
                    key={index}
                    className="bg-background rounded-xl p-4 shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${tumor.color}`} />
                      <span className="font-semibold text-foreground">{tumor.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tumor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Representation */}
            <div className="relative flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Circular Progress Indicators */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(191, 100%, 32%)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="12"
                  />
                  
                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#primaryGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="452"
                    strokeDashoffset="36"
                    transform="rotate(-90 100 100)"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gradient">99.2%</span>
                  <span className="text-muted-foreground mt-2">Accuracy Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
