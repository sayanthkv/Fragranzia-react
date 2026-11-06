import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import pic1 from "./../../assets/login.jpg"
import pic2 from "./../../assets/signup.jpg"

const About = () => {
  return (
<>
    <div className="container my-5">
      <div className="row align-items-center g-4">
        <div className="col-12 col-md-7">
          <h3 style={{ color: '#043948' }}>
            <b>About Fragranzia</b>
          </h3>
          <nav aria-label="breadcrumb">
            <span className="text-muted">Home &gt; About</span>
          </nav>
          <p
            className="mt-3"
            style={{ color: '#333', fontSize: '1.1rem', lineHeight: '1.6' }}
          >
            At Fragranzia, we believe that a perfume is more than just a scent—it's
            a story, an art, and a science combined to create memories that
            linger. Our journey began with a vision to craft exquisite fragrances
            that capture the essence of individuality and elevate every moment into
            something timeless.
            <br />
            <br />
            Guided by passion and precision, we source the finest ingredients from
            around the world to create perfumes that resonate with authenticity
            and luxury. Each bottle is a masterpiece, meticulously crafted to
            deliver an unparalleled sensory experience.
            <br />
            <br />
            Our commitment goes beyond creating fragrances. We aim to inspire
            confidence, evoke emotions, and celebrate uniqueness through every
            drop we produce. Fragranzia isn’t just a brand—it’s a celebration of
            you, your style, and your moments.
            <br />
            <br />
            With a legacy built on quality, artistry, and innovation, we invite
            you to explore our collection and find a scent that speaks your
            story.
          </p>
        </div>

        <div className="col-12 col-md-5 text-center imgmain">
          <div className="d-flex flex-column align-items-center">
            <img
              src={pic1}
              alt="Fragrance Image 1"
              className="img-fluid img1"
            />
            <img
              src={pic2}
              alt="Fragrance Image 2"
              className="img-fluid img2 "
            />
          </div>
        </div>
      </div>
    </div>

</>
  );
};

export default About;