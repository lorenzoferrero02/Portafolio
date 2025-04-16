import "./social.css";

import githubIcon from '../../assets/social_icon/icons8-github-64.png';
import instagramIcon from '../../assets/social_icon/icons8-instagram-64.png';
import emailIcon from '../../assets/social_icon/icons8-apple-mail-64.png';

const SocialIcons = () => {
    return (
        <div className="social-container">
            <a href="mailto:lorenzo.ferrero2002@gmail.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Email">
                <img src={emailIcon} alt="Email Icon" />
            </a>

            <a href="https://instagram.com/lorenzoferreroo" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <img src={instagramIcon} alt="Instagram Icon" />
            </a>

            <a href="https://github.com/lorenzoferrero02" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                <img src={githubIcon} alt="GitHub Icon" />
            </a>
        </div>
    );
};

export default SocialIcons;
