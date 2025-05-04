
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "What educational background do I need to pursue a career in AI?",
      answer: "While a degree in Computer Science, Mathematics, or related fields is beneficial, there are multiple paths to an AI career. Strong foundations in mathematics, programming, and machine learning concepts are essential. Many successful professionals also come from self-taught backgrounds with practical experience."
    },
    {
      question: "What programming languages should I learn for a career in AI?",
      answer: "Python is the most widely used language in AI development, followed by R and Julia. Knowledge of JavaScript, Java, or C++ can also be valuable depending on your specific focus area. Start with Python as it has extensive machine learning libraries and a gentle learning curve."
    },
    {
      question: "What skills are essential for a career in AI?",
      answer: "Key skills include: programming, mathematics (statistics, linear algebra, calculus), machine learning algorithms, data preprocessing, neural networks, and problem-solving. Soft skills like communication and teamwork are equally important."
    },
    {
      question: "What types of roles are available in the AI field?",
      answer: "Common roles include Machine Learning Engineer, AI Researcher, Data Scientist, Computer Vision Engineer, NLP Engineer, and AI Ethics Specialist. Each role requires different combinations of technical and domain-specific skills."
    },
    {
      question: "What are the potential career paths and growth opportunities in AI?",
      answer: "Career paths include technical leadership roles, research positions, specialized consulting, and entrepreneurship. The field offers opportunities in various industries like healthcare, finance, robotics, and autonomous systems."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-center mb-8">Our Responses to Your Inquiries: Unblocking the Way to Clarity</p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border">
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
