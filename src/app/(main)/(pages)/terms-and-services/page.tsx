import React from 'react';
import Navbar from '@/components/Navbar';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-center mb-6 mt-4">
              Terms and Conditions
            </h1>
            <p className="text-gray-700 mb-4">
              <strong>Last Updated:</strong> 21st October 2024
            </p>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p className="text-gray-700">
                Welcome to InstaLive! These Terms and Conditions
                (&quot;Terms&quot;) govern your access to and use of the
                InstaLive platform and services. Please read them carefully
                before using the platform. By accessing or using InstaLive, you
                agree to be bound by these Terms. If you do not agree with these
                Terms, please do not use InstaLive.
                <br />
                <div className="mt-4 text-black font-semibold">
                  InstaLive is a personal project, not intended for commercial
                  purposes. It is a platform designed to enable users to stream
                  content and interact with viewers in real time. While we aim
                  to provide a seamless streaming experience, InstaLive is not a
                  professional service, and the functionalities are limited to
                  core features.
                </div>
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                2. User Accounts and Registration
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Account Creation:</strong> You must use a Google
                  account to register on InstaLive. By doing so, you agree to
                  provide accurate and current information.
                </li>
                <li>
                  <strong>Responsibility for Account:</strong> You are solely
                  responsible for maintaining the confidentiality of your login
                  credentials and all activities under your account.
                </li>
                <li>
                  <strong>Account Termination:</strong> We reserve the right to
                  suspend or terminate your account if we believe you have
                  violated any of these Terms or engaged in unauthorized
                  activities.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                3. Usage of Services
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Personal Use:</strong> InstaLive is intended for
                  personal use only. You may not use the platform for any
                  commercial or unlawful activities.
                </li>
                <li>
                  <strong>Livestream Content:</strong> You are responsible for
                  the content you stream on InstaLive. You must comply with all
                  applicable laws and regulations, and your content must not
                  contain any material that is illegal, harmful, or infringing
                  on others&apos; rights.
                </li>
                <li>
                  <strong>Interaction with Viewers:</strong> Users are expected
                  to maintain respectful communication with viewers and other
                  users during livestreams. Abuse, harassment, or inappropriate
                  behavior may result in account suspension.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                4. Data Handling and Privacy
              </h2>

              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Personal Data:</strong> For information on how we
                  collect, process, and use your data, please refer to our{' '}
                  <a
                    href="https://instalive.vercel.app/privacy"
                    className="text-blue-500 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Google OAuth:</strong> By using InstaLive, you grant
                  us access to your Google account information for
                  authentication purposes.
                </li>
                <li>
                  <strong>Temporary Data Storage:</strong> Certain data, such as
                  live chat metadata and ban information, is stored temporarily
                  during active livestreams and is deleted once the stream ends.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                5. Third-Party Services
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>YouTube Data:</strong> With your consent, InstaLive
                  can access and manage your YouTube livestreams via the YouTube
                  Data API v3. This includes starting, stopping, and monitoring
                  your livestream sessions.
                </li>
                <li>
                  <strong>Cloudinary:</strong> InstaLive uses Cloudinary to
                  store and manage overlay images for livestreams.
                  Cloudinary&apos;s Privacy Policy governs the storage and
                  processing of these files.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                6. Limitation of Liability
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>No Warranty:</strong> InstaLive is provided &quot;as
                  is&quot; without any warranties, express or implied. We do not
                  guarantee the availability, functionality, or accuracy of the
                  platform.
                </li>
                <li>
                  <strong>Limited Liability:</strong> To the extent permitted by
                  law, InstaLive and its creator will not be liable for any
                  direct, indirect, incidental, or consequential damages arising
                  from the use or inability to use the platform, including but
                  not limited to data loss or unauthorized access to your
                  account.
                </li>
                <li>
                  <strong>User Responsibility:</strong> You agree that you use
                  InstaLive at your own risk, and that you are solely
                  responsible for any consequences of your use of the platform.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                7. Modifications to the Service and Terms
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Changes to the Platform:</strong> As a personal
                  project, InstaLive may undergo changes or be discontinued at
                  any time without prior notice. We are not liable for any
                  interruptions or loss of access.
                </li>
                <li>
                  <strong>Changes to Terms:</strong> We may update these Terms
                  from time to time to reflect changes in our services or legal
                  requirements. Your continued use of the platform after changes
                  constitutes acceptance of the new Terms.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by and construed in accordance with the
                laws of India. Any disputes arising from or relating to these
                Terms or the use of InstaLive shall be subject to the exclusive
                jurisdiction of the courts in Bhilwara, Rajasthan.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions, concerns, or feedback regarding these
                Terms or the InstaLive platform, please reach out to us at:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Email:</strong> mohitforwork2002@gmail.com
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
