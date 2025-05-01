import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-bottom text-center py-3">
          <div className="copyright">
            &copy; {currentYear} DIU Result Lookup. All Rights Reserved.<br />
            <small>This is an unofficial application and is not affiliated with Daffodil International University.</small><br />
            <small className="mt-2">Developed by <a href="https://joynalbokhsho.me" target="_blank" rel="noopener noreferrer" className="dev-link">Joynal Bokhsho</a></small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;