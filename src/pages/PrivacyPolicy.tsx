import React from 'react';
import { MatchGrinderLogo } from '@/components/MatchGrinderLogo';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Eye, User, MapPin, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <MatchGrinderLogo />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {currentDate}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Introduction
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to MatchGrinder ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web services (collectively, the "Service").
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              By using MatchGrinder, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Personal Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you register for an account, we collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Name (first name and last name)</li>
              <li>Email address</li>
              <li>Date of birth</li>
              <li>Gender (optional)</li>
              <li>Profile picture (optional)</li>
              <li>Biographical information (bio)</li>
              <li>Phone number (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Location Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              To help you find nearby games and connect with local players, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Your location (city, region, or coordinates)</li>
              <li>Search radius preferences</li>
              <li>Venue and location data for game events</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Location data is used solely to match you with nearby games and players. You can control location sharing in your device settings or app preferences.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Sports and Activity Information
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Sports interests and preferences</li>
              <li>Skill levels for different sports</li>
              <li>Participation in games and tournaments</li>
              <li>Game creation and event history</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Usage and Technical Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Device information (device type, operating system, unique device identifiers)</li>
              <li>IP address and browser type</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Log files and analytics data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Communication Data
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Messages sent through our messaging system</li>
              <li>Discussion forum posts and comments</li>
              <li>Game event communications</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our Service</li>
              <li><strong>User Matching:</strong> To match you with nearby games, players, and events based on your location and preferences</li>
              <li><strong>Communication:</strong> To facilitate messaging between users and send you important updates about games and events</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate your identity, and process your requests</li>
              <li><strong>Personalization:</strong> To personalize your experience and provide content relevant to your interests</li>
              <li><strong>Safety and Security:</strong> To detect, prevent, and address fraud, abuse, and security issues</li>
              <li><strong>Analytics:</strong> To analyze usage patterns and improve our Service</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
              <li><strong>Marketing:</strong> To send you promotional communications (with your consent, where required)</li>
            </ul>
          </section>

          {/* Information Sharing and Disclosure */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Information Sharing and Disclosure
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
              Public Profile Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The following information is visible to other users on the platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Your name and profile picture</li>
              <li>Your sports interests and skill levels</li>
              <li>Your general location (city/region, not exact address)</li>
              <li>Your bio and public profile information</li>
              <li>Games and tournaments you've created or joined</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Service Providers
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may share information with third-party service providers who perform services on our behalf, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Cloud hosting and data storage providers</li>
              <li>Analytics and performance monitoring services</li>
              <li>Email and notification services</li>
              <li>Payment processors (if applicable)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Legal Requirements
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to valid requests by public authorities, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Compliance with legal obligations</li>
              <li>Protection of our rights and property</li>
              <li>Prevention of fraud or security threats</li>
              <li>Protection of user safety</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Business Transfers
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms (OAuth 2.0, JWT tokens)</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure API communications (HTTPS)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct your personal information through your profile settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Opt out of marketing communications and certain data processing activities</li>
              <li><strong>Location Controls:</strong> Control location sharing through device settings or app preferences</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Service is not intended for children under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services, or integrate with third-party services such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Google OAuth:</strong> For authentication services. Google's privacy policy applies to their services.</li>
              <li><strong>Supabase:</strong> For database and backend services. Supabase's privacy policy applies.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              We are not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our Service, you consent to the transfer of your information to these countries. We take appropriate measures to ensure your information receives adequate protection in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We may also notify you via email or through our Service for material changes. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Us */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> privacy@matchgrinder.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Website:</strong> <a href="https://matchgrinder.com" className="text-blue-600 hover:underline">https://matchgrinder.com</a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Support:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a>
              </p>
            </div>
          </section>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

