import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  BarChart,
  Clock,
  Lock,
  Mail,
  MessageCircle,
  HardDrive,
  Calendar,
  Video,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { PRICING_PLANS, TEAM_MEMBERS, WORKSPACE_APPS } from '../config';

const HomePage = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Transform How Your Team Works Together
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Swarup Workspace brings all your favorite productivity tools in one place. Create, collaborate, and get more done - together.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/signup">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg">
                    See How It Works
                  </Button>
                </a>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                className="relative rounded-xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img 
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                  alt="Swarup Workspace Dashboard" 
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Swarup Workspace?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform is designed to streamline your workflow, boost productivity, and make collaboration seamless.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn}
            >
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-700">
                Work together in real-time with your team no matter where they are located.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn}
            >
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-700">
                Your data is protected with enterprise-grade security and compliance controls.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn}
            >
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Productivity Boost</h3>
              <p className="text-gray-700">
                Streamline your workflow and get more done with integrated tools and automation.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn}
            >
              <Globe className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Work from Anywhere</h3>
              <p className="text-gray-700">
                Access your workspace from any device, anywhere in the world with internet access.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Choose the plan that's right for you and your team. All plans include a 30-day free trial.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {PRICING_PLANS.map((plan) => (
              <motion.div 
                key={plan.id}
                className={`bg-white rounded-xl overflow-hidden border ${
                  plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm'
                } relative`}
                variants={fadeIn}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.frequency}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="About Swarup Workspace" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Swarup Workspace</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2022, Swarup Workspace was born from a simple idea: that work should be easier, more intuitive, and more collaborative.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our mission is to build tools that help teams work better together. We believe in creating software that gets out of your way and lets you focus on what matters most - delivering great work.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">500+</h3>
                    <p className="text-gray-700">Companies using our platform</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">20+</h3>
                    <p className="text-gray-700">Countries reached</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">1M+</h3>
                    <p className="text-gray-700">Hours saved monthly</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">99.9%</h3>
                    <p className="text-gray-700">Uptime reliability</p>
                  </div>
                </div>
              </div>
              <Link to="/#team">
                <Button>
                  Meet Our Team
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} id="team" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              The talented people behind Swarup Workspace who are dedicated to building the best collaboration tools.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {TEAM_MEMBERS.map((member) => (
              <motion.div 
                key={member.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                variants={fadeIn}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-700 mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    {member.social.twitter && (
                      <a 
                        href={member.social.twitter} 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a 
                        href={member.social.linkedin} 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a 
                        href={member.social.github} 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform how your team works?</h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of companies that use Swarup Workspace to collaborate more effectively, move projects forward, and get more done together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-blue-700" size="lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
