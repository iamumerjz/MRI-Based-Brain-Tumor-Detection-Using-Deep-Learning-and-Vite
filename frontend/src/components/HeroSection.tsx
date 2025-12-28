import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-50" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in-up">
              <Shield className="w-4 h-4" />
              <span>AI-Powered Medical Diagnosis</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up animation-delay-200">
              Advanced{" "}
              <span className="text-gradient">Brain Tumor</span>{" "}
              Detection System
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up animation-delay-400">
              Upload your MRI scan and get instant AI-powered analysis. Our cutting-edge 
              technology identifies and classifies brain tumors with exceptional accuracy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="group">
                  <Upload className="w-5 h-5" />
                  Upload Your Scan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="hero-outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in-up animation-delay-1000">
              {[
                { value: "99.2%", label: "Accuracy Rate" },
                { value: "50K+", label: "Scans Analyzed" },
                { value: "4", label: "Tumor Types" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in animation-delay-400">
            {/* Main Brain Visual */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
              
              {/* Brain Container */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center animate-float">
                {/* Inner Ring */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
                
                {/* Center Icon */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 bg-background rounded-full shadow-card flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-20 h-20 md:w-24 md:h-24 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {/* Brain outline */}
                    <path
                      d="M50 10 C30 10, 15 25, 15 45 C15 55, 20 65, 30 70 C25 75, 25 85, 35 90 C45 95, 55 95, 65 90 C75 85, 75 75, 70 70 C80 65, 85 55, 85 45 C85 25, 70 10, 50 10"
                      className="animate-pulse"
                    />
                    {/* Brain details */}
                    <path d="M35 30 Q50 25, 65 30" strokeLinecap="round" />
                    <path d="M30 45 Q50 40, 70 45" strokeLinecap="round" />
                    <path d="M35 60 Q50 55, 65 60" strokeLinecap="round" />
                    <path d="M50 10 L50 90" strokeDasharray="4 4" opacity="0.5" />
                  </svg>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 md:top-0 md:right-0 bg-background rounded-xl shadow-card p-4 animate-float animation-delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Secure</div>
                    <div className="text-xs text-muted-foreground">HIPAA Compliant</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 md:bottom-10 md:-left-10 bg-background rounded-xl shadow-card p-4 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Fast</div>
                    <div className="text-xs text-muted-foreground">Results in seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
