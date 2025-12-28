import { Upload, Cpu, FileCheck, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      step: "01",
      title: "Upload MRI Scan",
      description: "Simply upload your brain MRI scan in any standard format. Our system supports DICOM, JPEG, and PNG files.",
      color: "from-primary to-primary-dark",
    },
    {
      icon: Cpu,
      step: "02",
      title: "AI Analysis",
      description: "Our advanced deep learning model analyzes your scan in seconds, detecting any abnormalities with high precision.",
      color: "from-primary to-primary-dark",
    },
    {
      icon: FileCheck,
      step: "03",
      title: "Get Results",
      description: "Receive a detailed report with tumor detection status and classification including type, size, and location.",
      color: "from-primary to-primary-dark",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get your brain tumor analysis in three simple steps. Fast, accurate, and completely secure.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-background rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 h-full border border-border/50 hover:border-primary/30">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 px-4 py-1 bg-primary rounded-full text-primary-foreground text-sm font-bold">
                  Step {step.step}
                </div>

                {/* Icon */}
                <div className="relative mb-6 mt-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-6 top-24 w-12 h-12 items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-background shadow-soft flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
