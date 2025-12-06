import { Smartphone, Zap, Search, Users, Target, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Smartphone size={40} />,
      title: "Easy Reporting",
      description: "Report infrastructure issues with just a few taps from your mobile device",
      color: "text-blue-600"
    },
    {
      icon: <Zap size={40} />,
      title: "Quick Response",
      description: "Get faster resolution with our streamlined issue tracking system",
      color: "text-yellow-600"
    },
    {
      icon: <Search size={40} />,
      title: "Real-time Tracking",
      description: "Track your reported issues from submission to resolution",
      color: "text-green-600"
    },
    {
      icon: <Users size={40} />,
      title: "Community Driven",
      description: "Upvote issues to show public importance and priority",
      color: "text-purple-600"
    },
    {
      icon: <Target size={40} />,
      title: "Priority Boost",
      description: "Boost critical issues for faster attention from authorities",
      color: "text-red-600"
    },
    {
      icon: <Sparkles size={40} />,
      title: "Premium Support",
      description: "Get unlimited reporting and priority support with premium membership",
      color: "text-pink-600"
    }
  ];

  return (
    <section className="bg-base-200 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Port City PIIRS?
          </h2>
          <p className="text-lg opacity-70">
            A modern platform designed for efficient public service delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body items-center text-center">
                <div className={`${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                <p className="opacity-70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;