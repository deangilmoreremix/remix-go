import React from 'react';
import { Container } from 'reactstrap';

export default () => (
  <Container>
    <footer className="footer">
      <div className="copyright">© VideoRemix | <a className="direct-link" href="http://dashboard.vidcloud.io/terms-of-service/">
          View our terms of service
        </a> | <a className="direct-link" href="//projects.videoremix.io/changelog?scope=go">
          Changelog
        </a>
      </div>
    </footer>
  </Container>
);
