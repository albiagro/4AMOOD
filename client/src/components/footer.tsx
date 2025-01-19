import { Col, Container, Nav, Row, Stack } from "react-bootstrap"
import { NavLink } from "react-router-dom"

export const Footer = () => {
    return (
        <footer id="footerNav">
            <Container fluid >
                <Row className="bg-primary text-white" id="footerNav">
                    <Col>
                        <Stack>
                            <h5 className="title-footer">4AMOOD</h5>
                            <p className="text-footer">All rights reserved.</p>
                        </Stack>
                    </Col>
                    <Col>
                        <Nav className="flex-column fs-5" >
                            <NavLink to="/home" className="text-footer">Home</NavLink>
                            <NavLink to="/home" className="text-footer">About</NavLink>
                            <NavLink to="/home" className="text-footer">Get support</NavLink>
                        </Nav>
                    </Col>
                    <Col>
                        <h5 className="title-footer">Contact us!</h5>
                        <p className="text-footer">For any enquiry or suggestion, contact us here</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}