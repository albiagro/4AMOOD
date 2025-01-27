import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const PrivacyBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    // Check if user has already closed the message
    const bannerDismissed = localStorage.getItem("privacyBannerDismissed");
    if (!bannerDismissed) {
      setIsBannerVisible(true);
    }
  }, []);

  const handleClose = () => {
    // Save the information about the user has closed the message
    localStorage.setItem("privacyBannerDismissed", "true");
    setIsBannerVisible(false);
  };

  return (
    isBannerVisible ? (
      <div className="fixed-bottom mb-4 mx-4">
        <Card className="p-3 shadow-lg">
          <Card.Body>
            <p className="text-sm mb-3">
                This site uses LocalStorage to enhance the user experience by storing only the information strictly necessary for login. No personal data is tracked.
            </p>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    ) : <div></div>
  );
};

export default PrivacyBanner;
