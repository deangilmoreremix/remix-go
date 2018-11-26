import React from 'react';
import { Container } from 'reactstrap';
import PropTypes from '../lib/PropTypes';

const Footer = (props) => {
  const { whiteLabel } = props;
  return (
    <Container>
      <footer className="footer">
        <div className="copyright">© {whiteLabel.name} | <a
          className="direct-link"
          href={whiteLabel.privacyPolicyLink}
        >
          View our terms of service
        </a> | <a className="direct-link" href={`//projects.${whiteLabel.domain}/changelog?scope=go`}>
          Changelog
        </a>
        </div>
      </footer>
    </Container>);
};

Footer.propTypes = {
  whiteLabel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    privacyPolicyLink: PropTypes.string.isRequired,
  }),
};

export default Footer;
