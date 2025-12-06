import { FileText, UserCheck, Wrench, LineChart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: <FileText size={32} />,
      title: "Report Issue",
      description: "Submit details with photo and location of the infrastructure problem",
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: 2,
      icon: <UserCheck size={32} />,
      title: "Admin Reviews",
      description: "Admin verifies and assigns the issue to appropriate staff member",
      color: "bg-green-100 text-green-600"
    },
    {
      number: 3,
      icon: <Wrench size={32} />,
      title: "Staff Works",
      description: "Assigned staff verifies on-site and works to resolve the issue",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      number: 4,
      icon: <LineChart size={32} />,
      title: "Track Progress",
      description: "Get real-time updates and track the complete resolution timeline",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          How It Works
        </h2>
        <p className="text-lg opacity-70">
          Simple steps to report and track infrastructure issues
        </p>
      </div>

      {/* Desktop View - Horizontal */}
      <div className="hidden md:grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="text-center">
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {step.icon}
              </div>
              <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gray-300 -z-10" 
                   style={{ 
                     display: index === steps.length - 1 ? 'none' : 'block',
                     transform: 'translateX(50%)'
                   }}>
              </div>
              <div className="badge badge-primary badge-lg mb-3">{step.number}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm opacity-70">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Vertical with Timeline */}
      <div className="md:hidden">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6 mb-12">
              {/* Icon Circle */}
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 relative z-10`}>
                {step.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-3">
                <div className="badge badge-primary badge-lg mb-2">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm opacity-70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-3xl justify-center mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg mb-6">
              Join thousands of citizens working together for a better Port City
            </p>
            <div className="card-actions justify-center">
              <a href="/register" className="btn btn-accent btn-lg">
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;