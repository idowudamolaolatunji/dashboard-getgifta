import React, { useEffect } from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
    const navigate = useNavigate();

    useEffect(function() {
		document.title = 'Gifta | Privacy Ploicy';

        window.scrollTo(0, 0)
	}, [])

    return (
        <>
            <Header />

            <section className='section wallet__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>


                    <div className="terms--container">
                        <h3 className="terms--heading">Privacy Policy</h3>
                        {/* <p>Welcome to Gifta's Privacy Policy. Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how Gifta collects, uses, and safeguards your data when you use our platform. By using Gifta, you agree to the terms outlined in this policy.</p> */}
                        <span className='modal--info'>Welcome to Gifta's Privacy Policy. Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how Gifta collects, uses, and safeguards your data when you use our platform. By using Gifta, you agree to the terms outlined in this policy.</span>

                        <div className="terms--top">
                            <span>Information We Collect:</span>
                            <p>By using Gifta, you acknowledge and agree to these Terms of Use. These terms constitute a legally binding agreement between you and Gifta. If you do not accept these terms, please do not use our platform.</p>
                        </div>


                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Personal Information:</span>
                                <p>When you register on Gifta, we collect personal information such as your name, email address, and date of birth. This information is crucial for creating and managing your account.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Wishlists and Preferences:</span>
                                <p>Gifta allows users to create wishlists and set preferences. We collect and store this data to provide personalized gift recommendations and reminders for special occasions.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Transaction Data:</span>
                                <p>When you make purchases on Gifta, we collect transaction data, including payment information. We use secure payment gateways to process transactions, and we do not store your credit card information on our servers.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Usage Information:</span>
                                <p>We gather information about how you interact with the Gifta platform, including your browsing history, search queries, and the pages you visit. This data helps us improve the user experience and tailor our services to your preferences.</p>
                            </span>

                        </div>

                        <div className="terms--top">
                            <span>How We Use Your Information:</span>
                        </div>


                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Personalization:</span>
                                <p>We use the information collected to personalize your Gifta experience. This includes recommending gifts based on your preferences, sending timely reminders for special occasions, and optimizing the platform to suit your needs.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Transaction Processing:</span>
                                <p>Your transaction data is used to process purchases made on Gifta. This includes verifying payment details, facilitating transactions with vendors, and ensuring the successful delivery of gifts.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Communication:</span>
                                <p>We use your contact information to communicate with you regarding your account, transactions, and important updates. You may also receive promotional emails and newsletters, and you can opt-out at any time.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Platform Improvement:</span>
                                <p>Data on user behavior and interactions helps us identify areas for improvement on the Gifta platform. We use this information to enhance features, fix bugs, and optimize the overall performance of the platform.</p>
                            </span>
                        </div>

                        <div className="terms--top">
                            <span>Data Security:</span>
                        </div>


                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Encryption and Secure Storage:</span>
                                <p>Gifta employs industry-standard encryption protocols to secure your data during transmission and storage. We utilize secure servers and regularly update our security measures to protect against unauthorized access.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Access Controls:</span>
                                <p>Access to your personal information is restricted to authorized personnel who require this data for specific purposes, such as customer support or technical maintenance.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Third-Party Security:</span>
                                <p>When working with third-party vendors or partners, we ensure they adhere to stringent security standards to safeguard your data.</p>
                            </span>
                        </div>


                        <div className="terms--top">
                            <span>Sharing with Third Parties:</span>
                        </div>

                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Trusted Partners:</span>
                                <p>To enhance your experience on Gifta, we may share necessary information with trusted third-party vendors and partners. This includes vendors involved in gift delivery and marketing collaborations.</p>
                            </span>
                            <span className='terms--items'>
                                <span>No Selling of Personal Information:</span>
                                <p>Gifta does not sell your personal information to third parties. We are committed to maintaining the confidentiality of your data.</p>
                            </span>
                        </div>



                        <div className="terms--top">
                            <span>Cookies and Tracking:</span>
                        </div>

                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Cookie Usage:</span>
                                <p>Gifta uses cookies and similar technologies to enhance your browsing experience. Cookies help us remember your preferences and improve the functionality of the platform.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Cookie Management:</span>
                                <p>You can manage your cookie preferences through your browser settings. However, disabling cookies may impact certain features of Gifta.</p>
                            </span>
                        </div>

                        <div className="terms--top">
                            <span>Children's Privacy:</span>
                        </div>

                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Age Restriction:</span>
                                <p>Gifta is not intended for users under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with information, please contact us.</p>
                            </span>
                        </div>


                        <div className="terms--top">
                            <span>Changes to Privacy Policy:</span>
                        </div>


                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>Notification of Changes:</span>
                                <p>Gifta reserves the right to update this Privacy Policy to reflect changes in our practices. Users will be notified of any material changes through the platform.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Acceptance of Changes:</span>
                                <p>Your continued use of Gifta after changes to the Privacy Policy constitutes acceptance of the revised terms. We encourage users to review this policy regularly.</p>
                                <p>If you have questions or concerns about this Privacy Policy, please contact our Privacy Team at privacy@gifta.com.</p>
                                <p>This Privacy Policy was last updated on 25th Jan 2024.</p>
                            </span>
                        </div>
                        
                        

                    </div>
                </div>
            </section>
        </>
    )
}

export default PrivacyPolicy;