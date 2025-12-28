import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, CheckCircle2 } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "Free first scan analysis",
    "No registration required",
    "Instant AI-powered results",
    "HIPAA compliant & secure",
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float animation-delay-2000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-blob" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Get Your Brain Scan Analyzed?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Upload your MRI scan now and receive an AI-powered analysis in seconds. 
            Early detection can save lives.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-primary-foreground"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button 
                size="xl" 
                className="bg-background text-primary hover:bg-background/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-bold"
              >
                <Upload className="w-5 h-5" />
                Upload Your Scan Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="xl" 
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                Schedule Consultation
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/60 text-sm mb-4">Trusted by leading healthcare institutions</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              {["Mayo Clinic", "Johns Hopkins", "Cleveland Clinic", "Mass General"].map((name, index) => (
                <span key={index} className="text-primary-foreground font-semibold text-lg">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
