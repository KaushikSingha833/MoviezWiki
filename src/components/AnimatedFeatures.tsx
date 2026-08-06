"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Globe2, Bookmark, MonitorPlay } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />,
    title: "AI-Powered Summaries",
    description: "Don't want spoilers? Our Gemini AI generates instant, spoiler-free plot summaries with a single click.",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  {
    icon: <Globe2 className="w-8 h-8 text-emerald-400" />,
    title: "Global Cinema Tracker",
    description: "Filter top 10 movies by country and discover the wealthiest actors and actresses in local industries.",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    icon: <Bookmark className="w-8 h-8 text-rose-400" />,
    title: "Personalized Wishlist",
    description: "Create your secure account to save movies for later. Your data syncs instantly across all your devices.",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  {
    icon: <MonitorPlay className="w-8 h-8 text-[#F5C518]" />,
    title: "Instant HD Trailers",
    description: "Watch the latest high-definition trailers right inside a sleek, cinematic modal without leaving the app.",
    bg: "bg-[#F5C518]/10",
    border: "border-[#F5C518]/20"
  }
];

export default function AnimatedFeatures() {
  return (
    <section className="py-24 bg-[#121212] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Everything you need. <span className="text-neutral-500">In one place.</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            MoviezWiki is engineered to provide the most seamless and interactive movie discovery experience on the web.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-2xl bg-[#1a1a1a] border border-neutral-800 hover:border-neutral-600 transition-colors group`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.border} border group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}