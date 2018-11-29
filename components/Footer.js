import React from 'react';
import { Container } from 'reactstrap';
import PropTypes from '../lib/PropTypes';

const Footer = (props) => {
  const { domain, serviceName, privacyPolicyLink, className } = props;
  return (
    <Container>
      <footer className={`footer ${className}`}>
        <div className="copyright">© {serviceName} | <a
          className="direct-link"
          href={privacyPolicyLink}
        >
          View our terms of service
        </a> | <a className="direct-link" href={`//projects.${domain}/changelog?scope=go`}>
          Changelog
        </a>
        </div>
      </footer>
    </Container>);
};

Footer.propTypes = {
  className: PropTypes.string,
  serviceName: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  privacyPolicyLink: PropTypes.string.isRequired,
};

export default Footer;
