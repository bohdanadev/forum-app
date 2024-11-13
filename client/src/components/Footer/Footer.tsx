import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #6c757d;
  background-color: #edede9; /* Semi-transparent background */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  bottom: 0;
  font-size: 0.9em;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      © {currentYear} Forum. All rights reserved.
    </FooterContainer>
  );
};

export default Footer;
