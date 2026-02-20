import React from 'react';
import { MatchGrinderLogo } from '@/components/MatchGrinderLogo';
import { Footer } from '@/components/Footer';
import { FileText, Shield, AlertTriangle, Scale, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Eula = () => {
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
                        End User License Agreement (EULA)
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
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            This End User License Agreement ("EULA") is a legal agreement between you and MatchGrinder ("we," "us," or "our") regarding your use of the MatchGrinder application (the "App") and related services.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold mb-4">
                            PLEASE READ THIS EULA CAREFULLY BEFORE DOWNLOADING OR USING THE APP. BY DOWNLOADING, INSTALLING, OR USING THE APP, YOU ARE AGREEING TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS EULA.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you do not agree to the terms of this EULA, do not download, install, or use the App.
                        </p>
                    </section>

                    {/* License Grant */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                License Grant
                            </h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Subject to your compliance with the terms of this EULA, MatchGrinder grants you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the App solely for your personal, non-commercial purposes on mobile devices that you own or control.
                        </p>
                    </section>

                    {/* Zero Tolerance Policy */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Ban className="h-6 w-6 text-red-600" />
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Zero Tolerance for Objectionable Content and Abusive Users
                            </h2>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                                MatchGrinder maintains a ZERO TOLERANCE policy regarding objectionable content and abusive users.
                            </p>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            You agree that you will not use the App to post, upload, transmit, or share any Objectionable Content. "Objectionable Content" includes, but is not limited to, content that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                            <li>Is defamatory, discriminatory, or mean-spirited.</li>
                            <li>Is offensive, threatening, abusive, or promotes violence or harm against individuals or groups.</li>
                            <li>Contains nudity, sexually explicit material, or pornography.</li>
                            <li>Harvests or collects personal data about others without their consent.</li>
                            <li>Violates any intellectual property rights or trade secrets of third parties.</li>
                            <li>Is unlawful or promotes illegal activities.</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            <strong>Enforcement:</strong> MatchGrinder employs both automated systems and manual reviews to moderate content. Furthermore, MatchGrinder provides features enabling users to flag/report Objectionable Content and block abusive users. We will act on these reports within 24 hours by removing the content and ejecting the user who provided the offending content. There is no appeal process for violations of our zero-tolerance policy.
                        </p>
                    </section>

                    {/* User Restrictions */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                License Restrictions
                            </h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            You agree that you will not, and will not permit others to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>License, sell, rent, lease, assign, distribute, host, or otherwise commercially exploit the App.</li>
                            <li>Modify, make derivative works of, disassemble, decrypt, reverse compile, or reverse engineer any part of the App.</li>
                            <li>Access the App in order to build a similar or competitive service.</li>
                            <li>Remove, alter, or obscure any proprietary notice (including any notice of copyright or trademark) of MatchGrinder or its affiliates.</li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Intellectual Property Rights
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            MatchGrinder and its licensors own all title, intellectual property, and proprietary rights in and to the App and all related services, features, and content. The App is licensed, not sold, to you under this EULA.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Termination
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            This EULA is effective until terminated by you or MatchGrinder. Your rights under this EULA will terminate automatically without notice if you fail to comply with any of its terms, particularly the Zero Tolerance Policy.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Upon termination, you must cease all use of the App and delete all copies of the App from your mobile devices.
                        </p>
                    </section>

                    {/* Warranty Disclaimer */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Disclaimer of Warranties
                            </h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. MATCHGRINDER EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE APP, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
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
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MATCHGRINDER BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE APP, WHETHER OR NOT MATCHGRINDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="border-t pt-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Contact Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            If you have any questions or concerns regarding this EULA, please contact us at:
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Email:</strong> legal@matchgrinder.com
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Website:</strong> <a href="https://matchgrinder.com" className="text-blue-600 hover:underline">https://matchgrinder.com</a>
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

export default Eula;
