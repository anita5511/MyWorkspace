import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ArrowUpRight,
  Zap,
  Shield,
  Globe,
  TrendingUp
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { WORKSPACE_APPS } from '../config';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] || 
                LucideIcons.FileText;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 text-lg font-bold">Swarup Workspace</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white/60 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                    placeholder="Search workspace..."
                    type="search"
                  />
                </div>
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                </button>

                <div className="ml-3 relative">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-lg">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="pt-2 pb-3 space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-medium shadow-lg">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            <div className="px-4 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Profile
                </div>
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  Settings
                </div>
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="py-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:flex md:items-center md:justify-between mb-8"
          >
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Access all your workspace apps from one unified platform
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button onClick={logout} variant="outline" className="rounded-xl">
                Sign Out
              </Button>
            </div>
          </motion.div>

          {/* Workspace Apps section */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl overflow-hidden rounded-2xl border border-gray-100">
            <div className="px-6 py-6 sm:px-8">
              <h3 className="text-xl leading-6 font-semibold text-gray-900">
                Your Workspace Apps
              </h3>
              <p className="mt-1 max-w-2xl text-gray-600">
                Active applications ready to use
              </p>
            </div>

            <div className="border-t border-gray-100">
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 sm:p-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {WORKSPACE_APPS.filter(app =>
                  ['Swarup Drive', 'Swarup Music', 'Swarup Play' , 'Codespace' , 'PodcastPro'].includes(app.name)
                ).map((app) => (
                  <motion.div
                    key={app.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-6 rounded-2xl hover:bg-white/60 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
                    >
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${app.color}20 0%, ${app.color}40 100%)`,
                          border: `1px solid ${app.color}30`
                        }}
                      >
                        {app.icon === 'hard-drive' && <LucideIcons.HardDrive style={{ color: app.color }} className="h-10 w-10" />}
                        {app.icon === 'music' && <LucideIcons.Music style={{ color: app.color }} className="h-10 w-10" />}
                        {app.icon === 'play-circle' && <LucideIcons.PlayCircle style={{ color: app.color }} className="h-10 w-10" />}
                        {app.icon === 'code'        && <LucideIcons.Code        style={{ color: app.color }} className="h-10 w-10" />}
                        {app.icon === 'mic'         && <LucideIcons.Mic         style={{ color: app.color }} className="h-10 w-10" />}
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{app.name}</h3>
                        <div className="flex items-center justify-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                          <span>Open</span>
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Upcoming Workspace Apps Section */}
            <div className="px-6 py-6 sm:px-8 border-t border-gray-100 bg-gray-50/50">
              <h3 className="text-xl leading-6 font-semibold text-gray-900">
                Upcoming Workspace Apps
              </h3>
              <p className="mt-1 max-w-2xl text-gray-600">
                Applications launching soon
              </p>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 p-6 sm:p-8 bg-gray-50/50"
              initial="hidden"
              animate="visible"
            >
              {WORKSPACE_APPS.filter(app =>
                !['Swarup Drive', 'Swarup Music', 'Swarup Play' , 'Codespace' , 'PodcastPro'].includes(app.name)
              ).map((app) => (
                <motion.div
                  key={app.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="relative"
                >
                  <div
                    className="flex flex-col items-center p-4 rounded-2xl cursor-not-allowed opacity-60"
                    title="Coming soon"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 border border-gray-200"
                      style={{ backgroundColor: `${app.color}10` }}
                    >
                      {app.icon === 'mail' && <LucideIcons.Mail className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'message-circle' && <LucideIcons.MessageCircle className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'calendar' && <LucideIcons.Calendar className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'video' && <LucideIcons.Video className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'layout' && <LucideIcons.Layout className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'file-text' && <LucideIcons.FileText className="h-8 w-8 text-gray-400" />}
                      {app.icon === 'table'  && <LucideIcons.Table  className="h-8 w-8 text-gray-400" />}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xs font-medium text-gray-400">{app.name}</h3>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-400">
                        <span>Soon</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Modern Feature Highlight Section */}
          <motion.div
            className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Stats Card */}
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 mr-3" />
                  <h3 className="text-xl font-semibold">Workspace Analytics</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-blue-100 text-sm">Active Apps</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-blue-100 text-sm">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-blue-100 text-sm">Daily Uses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Enterprise Security</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your workspace is protected with end-to-end encryption and advanced security protocols.
              </p>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                All systems operational
              </div>
            </div>
          </motion.div>

          {/* Modern Visual Element - Abstract Pattern */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-12 overflow-hidden relative">
              {/* Abstract geometric patterns */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30"></div>
                <div className="absolute top-20 right-16 w-32 h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-40"></div>
                <div className="absolute bottom-16 left-24 w-16 h-16 bg-green-200 rounded-2xl rotate-45 opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-indigo-200 rounded-full opacity-30"></div>
              </div>
              
              <div className="relative text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Connected Worldwide
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Access your workspace from anywhere in the world with seamless synchronization and real-time collaboration.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Modern Design Elements */}
          <motion.div
            className="mt-16 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Decorative line pattern */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>

            {/* Modern bottom visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-sm text-gray-600">Optimized performance for maximum productivity</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure by Design</h4>
                <p className="text-sm text-gray-600">Enterprise-grade security for all your data</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Global Access</h4>
                <p className="text-sm text-gray-600">Available wherever you need to work</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
