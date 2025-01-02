import React from 'react';
import Navbar from '@/components/landing/navbar';

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8 ">
                    <div className="dark:bg-black bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-4xl font-bold text-center mb-6 mt-4">
                            Privacy Policy
                        </h1>

                        <section className="mb-6">
                            <h2 className="text-xl font-medium mb-2">
                                1. Purpose of this privacy policy
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                This Privacy Policy gives you information about
                                how InstaLive collects and processes your
                                personal data when you use our services,
                                including any personal data you may provide
                                through the Instalive platform.
                            </p>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                This privacy policy applies to users of
                                InstaLive which operates through{' '}
                                <a
                                    href="https://instalive.vercel.app/"
                                    className="text-blue-500 hover:underline"
                                >
                                    InstaLive
                                </a>
                            </p>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                When we refer to a “stream” in this Privacy
                                Policy, this might mean a live stream.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                2. The Personal Data We Collect About You
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                We may collect and process different kinds of
                                personal data about you which we have grouped
                                together as follows:
                            </p>
                            <ul className="dark:text-gray-400 list-disc list-inside space-y-2">
                                <li>
                                    <strong>Google Login Information:</strong>{' '}
                                    We use Google OAuth for authentication,
                                    which allows us to access your Google
                                    account information. We store your original
                                    name, email address, and profile image link
                                    in our PostgreSQL database for account
                                    management purposes.
                                </li>
                                <li>
                                    <strong>
                                        Broadcast and Livestream Data:
                                    </strong>{' '}
                                    We store information related to past
                                    livestreams and broadcasts, including
                                    identifiers, user information, titles,
                                    descriptions, and timestamps for management
                                    and reference purposes.
                                </li>
                                <li>
                                    <strong>LiveChat Metadata:</strong> During a
                                    livestream, we temporarily store metadata
                                    about live chat messages in Redis, which is
                                    deleted as soon as the stream is completed.
                                </li>
                                <li>
                                    <strong>Ban Data:</strong> During a
                                    livestream, if a user is banned from
                                    participating in live chat, we temporarily
                                    store the banId in Redis. This data is
                                    deleted once the stream ends.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                3. How We Use Your Data?
                            </h2>
                            <ul className="dark:text-gray-400 list-disc list-inside space-y-2">
                                <li>
                                    <strong>
                                        To Provide and Manage Services:
                                    </strong>{' '}
                                    We use your data, including your name, email
                                    address, and profile image, to create and
                                    manage your account and provide access to
                                    the livestreaming services. This includes
                                    authenticating your access via Google and
                                    managing your user profile on our platform.
                                </li>
                                <li>
                                    <strong>
                                        To Access and Manage Your YouTube
                                        Livestreams:
                                    </strong>{' '}
                                    With the permissions you grant related to{' '}
                                    <strong>Youtube Data API v3</strong>, we are
                                    able to manage your YouTube livestream
                                    sessions directly from our platform. This
                                    includes starting, stopping, and monitoring
                                    your livestreams as per your instructions.
                                </li>
                                <li>
                                    <strong>
                                        To Access Your YouTube Data:
                                    </strong>{' '}
                                    We can read data related to your YouTube
                                    content and livestreams, such as viewing
                                    existing streams, retrieving livestream
                                    details, and accessing live chat data to
                                    facilitate real-time chat features during
                                    your broadcasts.
                                </li>
                                <li>
                                    <strong>
                                        To Manage User Restrictions:
                                    </strong>{' '}
                                    If a user is banned from participating in
                                    live chat, we temporarily store their ban
                                    information to restrict their access during
                                    the active livestream. This data is also
                                    deleted once the stream is complete.
                                </li>
                                <li>
                                    <strong>To Communicate with You:</strong> We
                                    may use your email address to send updates,
                                    notifications about your livestream status,
                                    and responses to support requests.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                4. Cookies
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                We do not use cookies or similar tracking
                                technologies on our platform. We do not track
                                your activities across websites, nor do we
                                collect any data through cookies for analytics,
                                personalization, or advertising purposes.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                5. Third-Party Services
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                <strong>Cloudinary:</strong>We use Cloudinary as
                                a third-party service to store and manage
                                overlay images including both default overlays
                                provided by our platform and those uploaded by
                                users. When you upload an overlay for use during
                                a livestream, the file is stored securely on
                                Cloudinary servers. Cloudinary may process these
                                files as part of its hosting and delivery
                                services. For more information on how Cloudinary
                                handles your data, you can refer to their{' '}
                                <a
                                    href="https://cloudinary.com/privacy"
                                    className="text-blue-500 hover:underline"
                                >
                                    Privacy Policy
                                </a>
                                .
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                6. Data Security
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                We have implemented basic technical and
                                organizational security measures to help protect
                                your personal data from unauthorized access,
                                use, alteration, or disclosure. Your data is
                                stored in a cloud-based PostgreSQL database,
                                which is protected by standard security
                                practices.
                                <br />
                                However, as this project is a personal
                                initiative and not intended for commercial use,
                                our security measures are more limited than
                                those of a professional or enterprise-level
                                service. While we strive to protect your data,
                                please be aware that no method of electronic
                                transmission or storage is 100% secure, and we
                                cannot guarantee absolute security.
                                Additionally, we do not use your data for
                                advertising or any commercial purposes. Access
                                to your data is strictly limited to what is
                                necessary to provide the core functionalities of
                                the platform.
                            </p>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                This project is a personal initiative, and the
                                security measures are limited to what is
                                necessary for its core functionalities.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                7. Contacting Us
                            </h2>
                            <p className="dark:text-gray-400 text-gray-700 mb-4">
                                If you have any questions or concerns, feel free
                                to reach out at{' '}
                                <a
                                    href="mailto:mohitforwork2002@gmail.com"
                                    className="text-blue-500 hover:underline"
                                >
                                    mohitforwork2002@gmail.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
