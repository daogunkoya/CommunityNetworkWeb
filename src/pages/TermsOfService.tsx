import React from 'react';
import { MatchGrinderLogo } from '@/components/MatchGrinderLogo';
import { Footer } from '@/components/Footer';
import { FileText, Scale, AlertTriangle, Shield, Users, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
            Terms of Service
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
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Agreement to Terms
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to MatchGrinder. These Terms of Service ("Terms") govern your access to and use of the MatchGrinder mobile application, website, and related services (collectively, the "Service") operated by MatchGrinder ("we," "us," or "our").
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              By creating an account, downloading, installing, or using MatchGrinder, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You must be at least 13 years old (or the minimum age required in your jurisdiction) to use the Service. If you are under 18, you represent that you have your parent's or guardian's permission to use the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Description of Service
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              MatchGrinder is a platform that connects sports enthusiasts to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Find and join local sports games and events</li>
              <li>Create and organize game events and tournaments</li>
              <li>Connect with other players in your area</li>
              <li>Participate in community discussions about sports</li>
              <li>Communicate with other users through messaging</li>
              <li>Discover sports venues and facilities</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              User Accounts
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
              Account Creation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Account Responsibility
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to protect your account information.
            </p>
          </section>

          {/* User Conduct */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User Conduct
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Violate any applicable local, state, national, or international law or regulation</li>
              <li>Harass, abuse, threaten, or harm other users</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
              <li>Upload or transmit viruses, malware, or any other malicious code</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Collect or store personal data about other users without their permission</li>
              <li>Use the Service for any commercial purpose without our express written consent</li>
              <li>Post content that is defamatory, obscene, pornographic, or offensive</li>
              <li>Spam other users or send unsolicited communications</li>
              <li>Violate the intellectual property rights of others</li>
            </ul>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Content and Intellectual Property
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
              Your Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You retain ownership of any content you post, upload, or share on the Service ("Your Content"). By posting Your Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute Your Content for the purpose of operating and promoting the Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You represent and warrant that Your Content does not violate any third-party rights, including intellectual property rights, privacy rights, or publicity rights.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Our Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by MatchGrinder and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
            </p>
          </section>

          {/* Game Events and Tournaments */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Game Events and Tournaments
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-3">
              Creating Events
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you create a game event or tournament, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Provide accurate information about the event (date, time, location, requirements)</li>
              <li>Communicate clearly with participants</li>
              <li>Honor commitments made to participants</li>
              <li>Cancel or update events in a timely manner if circumstances change</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Joining Events
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you join a game event or tournament, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Attend events you commit to joining</li>
              <li>Cancel your participation in advance if you cannot attend</li>
              <li>Respect the organizer's rules and requirements</li>
              <li>Behave respectfully toward other participants</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Liability Disclaimer
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              MatchGrinder is a platform for connecting users. We are not responsible for the conduct of users, the quality or safety of venues, or any injuries or damages that may occur during game events or tournaments. Participation in sports activities involves inherent risks, and you participate at your own risk.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ban className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Prohibited Uses
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You may not use the Service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To exploit, harm, or attempt to exploit or harm minors</li>
              <li>To transmit or procure the sending of spam or unsolicited messages</li>
              <li>To engage in any automated use of the Service (bots, scrapers, etc.) without permission</li>
              <li>To interfere with or circumvent security features of the Service</li>
              <li>For any purpose that is illegal or prohibited by these Terms</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Upon termination, your right to use the Service will cease immediately. You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All provisions of these Terms that by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Disclaimers
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or availability of the Service</li>
              <li>Warranties regarding user-generated content or third-party content</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              We do not warrant that the Service will meet your requirements or that the quality of the Service will meet your expectations.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Limitation of Liability
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MATCHGRINDER, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us, if any, in the twelve (12) months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Indemnification
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to defend, indemnify, and hold harmless MatchGrinder and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any third-party rights.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MatchGrinder operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> legal@matchgrinder.com
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

export default TermsOfService;

