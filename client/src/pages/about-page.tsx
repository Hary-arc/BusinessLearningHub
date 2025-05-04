
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl text-center mb-8">
            About CatterpiWeb
          </h1>
          <div className="prose prose-lg mx-auto">
            <p>
              CatterpiWeb is a leading online learning platform dedicated to providing high-quality education in technology, business, and professional development.
            </p>
            <p>
              Our mission is to make education accessible to everyone, everywhere. We work with industry experts and leading professionals to create comprehensive courses that help learners advance their careers and achieve their goals.
            </p>
            <h2>Our Values</h2>
            <ul>
              <li>Excellence in Education</li>
              <li>Innovation in Learning</li>
              <li>Accessibility for All</li>
              <li>Community-Driven Growth</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
