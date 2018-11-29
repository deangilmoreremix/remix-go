import React from 'react';
import { Container } from 'reactstrap';
import PropTypes from '../lib/PropTypes';

const Footer = (props) => {
  const { changelogLink, serviceName, privacyPolicyLink, className } = props;
  return (
    <Container>
      <footer className={`footer ${className}`}>
        <div className="copyright">© {serviceName} | <a
          className="direct-link"
          href={privacyPolicyLink}
        >
          View our terms of service
        </a> | <a className="direct-link" href={changelogLink}>
          Changelog
        </a>
        </div>
      </footer>
    </Container>);
};

Footer.propTypes = {
  className: PropTypes.string,
  serviceName: PropTypes.string.isRequired,
  privacyPolicyLink: PropTypes.string.isRequired,
  changelogLink: PropTypes.string.isRequired,
};

export default Footer;
