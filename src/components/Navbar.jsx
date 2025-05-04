import React, { useEffect, useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to add shadow when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img 
            src="https://daffodilvarsity.edu.bd/template/images/diulogoside.png" 
            alt="DIU Logo" 
            className="navbar-logo"
          />
          <span>DIU Result Lookup</span>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <FaGraduationCap />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://discord.gg/bzSfxFuBe5" target="_blank" rel="noopener noreferrer">Discord</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://joynalbokhsho.me" target="_blank" rel="noopener noreferrer">Portfolio</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;