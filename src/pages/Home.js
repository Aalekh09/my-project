import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EnquiryModal from '../components/EnquiryModal';

const Home = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Students in classroom"
            className="hero-bg-image"
          />
        </div>

        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">🎓 Admissions Open 2025-27</span>
            </div>

            <h1 className="hero-title">
              Transform Your Career with
              <br />
              <span className="highlight-text">Premium Education</span>
            </h1>

            <p className="hero-subtitle">
              Join thousands of successful professionals who chose Saha Institute for their career transformation.
              Government-approved programs with 100% placement support.
            </p>

            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Graduates</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Placement</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">30+</div>
                <div className="stat-label">Years Experience</div>
              </div>
            </div>

            <div className="hero-actions">
              <button
                className="btn-primary-hero"
                onClick={() => setShowEnquiry(true)}
              >
                <i className="fas fa-rocket"></i>
                Start Your Journey
              </button>
              <button
                className="btn-secondary-hero"
                onClick={() => scrollToSection('programs')}
              >
                <i className="fas fa-play-circle"></i>
                Explore Programs
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Programs Section */}
      <section id="programs" className="programs-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <div className="section-badge">Our Programs</div>
            <h2 className="section-title">Choose Your Path to Success</h2>
            <p className="section-description">
              Discover our comprehensive range of professional programs designed to transform your career
            </p>
          </div>

          <Row className="g-4">
            {/* B.Ed Program */}
            <Col lg={6} xl={3}>
              <div className="program-card h-100">
                <div className="program-header">
                  <div className="program-icon">
                    <i className="fas fa-chalkboard-teacher"></i>
                  </div>
                  <div className="program-badge urgent">Limited Seats</div>
                </div>
                <div className="program-content">
                  <h3 className="program-title">Bachelor of Education (B.Ed)</h3>
                  <p className="program-description">
                    Transform into an inspiring educator with our comprehensive teaching program
                  </p>

                  <div className="program-highlights">
                    <div className="highlight-item">
                      <i className="fas fa-clock"></i>
                      <span>2 Years Duration</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-certificate"></i>
                      <span>UGC & NCTE Approved</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-users"></i>
                      <span>5000+ Alumni</span>
                    </div>
                  </div>

                  <div className="program-features">
                    <ul>
                      <li><i className="fas fa-check"></i> Teaching Excellence Training</li>
                      <li><i className="fas fa-check"></i> Practical Teaching Experience</li>
                      <li><i className="fas fa-check"></i> Government Job Preparation</li>
                      <li><i className="fas fa-check"></i> 100% Placement Support</li>
                    </ul>
                  </div>
                </div>
                <div className="program-footer">
                  <button
                    className="btn-program-apply"
                    onClick={() => setShowEnquiry(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </Col>

            {/* M.Ed Program */}
            <Col lg={6} xl={3}>
              <div className="program-card h-100">
                <div className="program-header">
                  <div className="program-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <div className="program-badge available">Open Now</div>
                </div>
                <div className="program-content">
                  <h3 className="program-title">Master of Education (M.Ed)</h3>
                  <p className="program-description">
                    Advanced degree for educational leadership and specialized teaching roles
                  </p>

                  <div className="program-highlights">
                    <div className="highlight-item">
                      <i className="fas fa-clock"></i>
                      <span>2 Years Duration</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-university"></i>
                      <span>University Affiliated</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-crown"></i>
                      <span>Advanced Degree</span>
                    </div>
                  </div>

                  <div className="program-features">
                    <ul>
                      <li><i className="fas fa-check"></i> Educational Leadership</li>
                      <li><i className="fas fa-check"></i> Research Methodology</li>
                      <li><i className="fas fa-check"></i> Curriculum Development</li>
                      <li><i className="fas fa-check"></i> Administrative Roles</li>
                    </ul>
                  </div>
                </div>
                <div className="program-footer">
                  <button
                    className="btn-program-apply"
                    onClick={() => setShowEnquiry(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </Col>

            {/* LLB Program */}
            <Col lg={6} xl={3}>
              <div className="program-card featured h-100">
                <div className="featured-badge">Most Popular</div>
                <div className="program-header">
                  <div className="program-icon">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <div className="program-badge available">Open Now</div>
                </div>
                <div className="program-content">
                  <h3 className="program-title">Bachelor of Laws (LLB)</h3>
                  <p className="program-description">
                    Build a prestigious legal career with our comprehensive law program
                  </p>

                  <div className="program-highlights">
                    <div className="highlight-item">
                      <i className="fas fa-clock"></i>
                      <span>3 Years Duration</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-university"></i>
                      <span>Dr. Ambedkar University</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-briefcase"></i>
                      <span>High Demand Career</span>
                    </div>
                  </div>

                  <div className="program-features">
                    <ul>
                      <li><i className="fas fa-check"></i> Constitutional Law</li>
                      <li><i className="fas fa-check"></i> Criminal & Civil Procedures</li>
                      <li><i className="fas fa-check"></i> Corporate Law Specialization</li>
                      <li><i className="fas fa-check"></i> Court Practice Training</li>
                    </ul>
                  </div>
                </div>
                <div className="program-footer">
                  <button
                    className="btn-program-apply"
                    onClick={() => setShowEnquiry(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </Col>

            {/* MBA Program */}
            <Col lg={6} xl={3}>
              <div className="program-card h-100">
                <div className="program-header">
                  <div className="program-icon">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="program-badge available">Open Now</div>
                </div>
                <div className="program-content">
                  <h3 className="program-title">Master of Business Administration (MBA)</h3>
                  <p className="program-description">
                    Accelerate your business career with advanced management skills
                  </p>

                  <div className="program-highlights">
                    <div className="highlight-item">
                      <i className="fas fa-clock"></i>
                      <span>2 Years Duration</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-university"></i>
                      <span>MDU Rohtak</span>
                    </div>
                    <div className="highlight-item">
                      <i className="fas fa-chart-line"></i>
                      <span>Career Growth</span>
                    </div>
                  </div>

                  <div className="program-features">
                    <ul>
                      <li><i className="fas fa-check"></i> Strategic Management</li>
                      <li><i className="fas fa-check"></i> Financial Analysis</li>
                      <li><i className="fas fa-check"></i> Marketing & Operations</li>
                      <li><i className="fas fa-check"></i> Leadership Development</li>
                    </ul>
                  </div>
                </div>
                <div className="program-footer">
                  <button
                    className="btn-program-apply"
                    onClick={() => setShowEnquiry(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section py-5 bg-light">
        <Container>
          <Row>
            <Col lg={6}>
              <div className="contact-info">
                <div className="section-badge">Get in Touch</div>
                <h2 className="section-title">Ready to Start Your Journey?</h2>
                <p className="section-description">
                  Our admission counselors are here to guide you through the application process
                </p>

                <div className="contact-methods">
                  <div className="contact-method" onClick={() => window.open('tel:+919871261719')}>
                    <div className="method-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="method-content">
                      <h4>Call Us</h4>
                      <p>
                        <a href="tel:+919871261719">+91 9871261719</a><br />
                        <a href="tel:+911294055280">0129-4055280</a>
                      </p>
                    </div>
                  </div>

                  <div className="contact-method" onClick={() => window.open('mailto:sahaedu@gmail.com')}>
                    <div className="method-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="method-content">
                      <h4>Email Us</h4>
                      <p>
                        <a href="mailto:sahaedu@gmail.com">sahaedu@gmail.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="contact-method" onClick={() => window.open('https://maps.google.com/?q=H.No+2219+sector+3+faridabad+Near+pani+tanki+Haryana', '_blank')}>
                    <div className="method-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="method-content">
                      <h4>Visit Us</h4>
                      <p>H.No 2219 sector 3 faridabad<br />Near pani tanki, Haryana</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="contact-form-wrapper">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  onClick={() => setShowEnquiry(true)}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Quick Inquiry Form
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <EnquiryModal
        show={showEnquiry}
        onHide={() => setShowEnquiry(false)}
      />
    </>
  );
};

export default Home;