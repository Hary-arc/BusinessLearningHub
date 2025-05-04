
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What educational background do I need to pursue a career in AI?",
    answer: "A background in Computer Science, Mathematics, or related fields is beneficial. However, many successful AI professionals come from diverse backgrounds and have learned through bootcamps and online courses."
  },
  {
    question: "What programming languages should I learn for a career in AI?",
    answer: "Python is the most popular language for AI development, followed by R, Java, and C++. Start with Python as it has extensive AI/ML libraries like TensorFlow and PyTorch."
  },
  {
    question: "What skills are essential for a career in AI?",
    answer: "Key skills include programming, mathematics (statistics, calculus, linear algebra), machine learning algorithms, data structures, and problem-solving abilities."
  },
  {
    question: "What types of roles are available in the AI field?",
    answer: "Common roles include Machine Learning Engineer, AI Researcher, Data Scientist, Computer Vision Engineer, NLP Engineer, and AI Ethics Specialist."
  },
  {
    question: "What are the potential career paths and growth opportunities in AI?",
    answer: "Career paths include technical roles (Senior AI Engineer, Lead Researcher), management roles (AI Project Manager, Director of AI), and specialized roles (AI Ethics Officer, AI Product Manager)."
  }
];

export function FAQSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Our Responses to Your Inquiries: Unblocking the Way to Clarity
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <img
              src="/faq-illustration.png"
              alt="FAQ Illustration"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -top-4 -right-4 bg-pink-400 rounded-full p-4 shadow-lg">
              <div className="text-white text-4xl font-bold">FAQ</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <Disclosure.Button className="flex justify-between w-full px-4 py-4 text-left text-gray-800 hover:bg-gray-100 focus:outline-none">
                      <span className="font-medium">{faq.question}</span>
                      <ChevronDown className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 py-4 text-gray-600 bg-white">
                      {faq.answer}
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
