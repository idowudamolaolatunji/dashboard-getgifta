import React, { useEffect } from 'react';
import Header from './Components/Header';
import { useNavigate } from 'react-router-dom';

function TermsOfUse() {
    const navigate = useNavigate();


    useEffect(function() {
		document.title = 'Gifta | My Orders';

        window.scrollTo(0, 0)
	}, [])

    return (
        <>

            <Header />

            <section className='section wallet__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    
                    <div className="terms--container">
                        <h3 className="terms--heading">Terms Of Use.</h3>
                        {/* <p>Welcome to Gifta! These Terms of Use outline the terms and conditions governing your use of the Gifta platform. By accessing or using Gifta, you agree to abide by these terms. If you do not agree with these terms, please refrain from using Gifta.</p> */}
                        <span className='modal--info'>Welcome to Gifta! These Terms of Use outline the terms and conditions governing your use of the Gifta platform. By accessing or using Gifta, you agree to abide by these terms. If you do not agree with these terms, please refrain from using Gifta.</span>

                        <div className="terms--top">
                            <span>Acceptance of Terms:</span>
                            <p>By using Gifta, you acknowledge and agree to these Terms of Use. These terms constitute a legally binding agreement between you and Gifta. If you do not accept these terms, please do not use our platform.</p>
                        </div>

                        <div className="terms--content">
                            <span className='terms--items'>
                                <span>User Conduct:</span>
                                <p>When using Gifta, you agree to conduct yourself in a manner consistent with applicable laws, regulations, and the rights of others. You are solely responsible for your actions on the platform and any consequences that may arise.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Intellectual Property:</span>
                                <p>All content and materials on Gifta, including logos, trademarks, designs, and text, are the intellectual property of Gifta or its licensors. You may not reproduce, distribute, or modify these materials without written consent from Gifta.</p>
                            </span>
                            <span className='terms--items'>
                                <span>User Accounts:</span>
                                <p>To access certain features of Gifta, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account information and agree to notify Gifta immediately of any unauthorized use of your account.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Transactions:</span>
                                <p>Gifta facilitates transactions between users and vendors. By making a purchase on Gifta, you agree to provide accurate payment information and comply with vendor terms and conditions. Gifta is not responsible for the quality or delivery of products from vendors.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Termination:</span>
                                <p>Gifta reserves the right to terminate or suspend user accounts for violations of these Terms of Use. We may do so without prior notice, at our discretion. Users may also terminate their accounts at any time by contacting Gifta.</p>
                            </span>
                            <span className='terms--items'>
                                <span>User Content:</span>
                                <p>Gifta may allow users to submit content, including wishlists, reviews, and comments. By submitting content, you grant Gifta a non-exclusive, royalty-free license to use, reproduce, and display that content on the platform.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Disclaimer of Warranty:</span>
                                <p>Gifta provides the platform "as is" and makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of content on the platform. Your use of Gifta is at your own risk.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Limitation of Liability:</span>
                                <p>Gifta is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. In no event shall our total liability exceed the amount paid by you to Gifta..</p>
                            </span>
                            <span className='terms--items'>
                                <span>Governing Law:</span>
                                <p>These Terms of Use are governed by the laws of [Jurisdiction]. Any disputes shall be resolved through arbitration in accordance with the [Arbitration Rules].</p>
                            </span>
                            <span className='terms--items'>
                                <span>Modification of Terms:</span>
                                <p>Gifta reserves the right to modify these Terms of Use at any time. Any changes will be effective immediately upon posting on the platform. Your continued use of Gifta constitutes acceptance of the revised terms.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Severability:</span>
                                <p>If any provision of these Terms of Use is found to be unenforceable or invalid, the remaining provisions shall remain in full force and effect.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Entire Agreement:</span>
                                <p>These Terms of Use constitute the entire agreement between you and Gifta, superseding any prior agreements or understandings.</p>
                            </span>
                            <span className='terms--items'>
                                <span>Contact Us:</span>
                                <p>If you have questions or concerns about these Terms of Use, please contact us at legal@gifta.com.</p>
                                <p>These Terms of Use were last updated on 25th Jan 2024.</p>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TermsOfUse
