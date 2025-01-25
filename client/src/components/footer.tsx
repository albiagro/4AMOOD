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
                            <NavLink to="/about" className="text-footer">About</NavLink>
                            <NavLink to="/support" className="text-footer">Get support</NavLink>
                        </Nav>
                    </Col>
                    <Col>
                        <p className="text-footer">Any issue or suggestion? Contact us <NavLink to="/support" className="text-footer">here</NavLink></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}