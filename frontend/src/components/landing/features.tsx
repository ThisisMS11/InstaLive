import { Video, MessageSquare, Shield, Layers } from 'lucide-react';

const features = [
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    title: 'Smooth Live Streaming',
    description:
      'Stream in high quality with minimal latency. Our platform ensures your content reaches viewers in real-time.',
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: 'Overlay Addition',
    description:
      'Customize your stream with professional overlays. Add animations, alerts, and branded elements seamlessly.',
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: 'Live Chat Integration',
    description:
      'Engage with your audience in real-time through our integrated chat system. Build your community while streaming.',
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: 'Automatic Moderation',
    description:
      'Keep your chat clean with AI-powered moderation. Automatically block abusive users and inappropriate content.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-tr from-primary to-green-800 bg-clip-text text-transparent font-extrabold">
              Powerful
            </span>
            {' Features'}
            <div>for Streamers</div>
          </h2>
          <p className="max-w-lg mx-auto">
            Everything you need to create professional live streams
          </p>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap gap-8">
          {/* Large Feature Card - 2/3 width on desktop */}
          <div className="w-full md:w-[calc(66%-1rem)] relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-3xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/10 h-full">
              <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_30px_rgba(var(--primary),.3)] group-hover:shadow-none transition-all duration-300">
                {features[0].icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                {features[0].title}
              </h3>
              <p className="text-emerald-100/60 leading-relaxed">
                {features[0].description}
              </p>
            </div>
          </div>

          {/* Medium Feature Card - 1/3 width on desktop */}
          <div className="w-full md:w-[calc(33%-1rem)] relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-3xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/10 h-full">
              <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_30px_rgba(var(--primary),.3)] group-hover:shadow-none transition-all duration-300">
                {features[1].icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                {features[1].title}
              </h3>
              <p className="text-emerald-100/60 leading-relaxed">
                {features[1].description}
              </p>
            </div>
          </div>

          {/* Two Small Feature Cards - 1/2 width each on desktop */}
          <div className="flex w-full gap-8 flex-col sm:flex-row">
            {features.slice(2).map((feature, index) => (
              <div key={index} className="w-full sm:w-1/2 relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative p-8 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-3xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/10">
                  <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_0_30px_rgba(var(--primary),.3)] group-hover:shadow-none transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-emerald-100/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
