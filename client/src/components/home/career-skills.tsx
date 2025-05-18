
import { Target, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

export function CareerSkills() {
  const skills = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Explore new skills",
      description: "Access 10,000+ courses in AI, business, technology, and more."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Earn valuable credentials",
      description: "Get certificates for every course you finish and boost your chances of getting hired after your trials ends at no additional cost."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Learn from the best",
      description: "Take your skills to the next level with expert-led courses and Coursera Coach, your AI-powered guide."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Invest in your career
          </h2>
        </motion.div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {skill.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {skill.title}
              </h3>
              <p className="mt-2 text-base text-gray-600">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
