import styles from './header.module.css';
import Button from 'react-bootstrap/Button'
import Thiong from 'react-bootstrap/Navbar'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarToggle from 'react-bootstrap/NavbarToggle'
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import FormControl from 'react-bootstrap/FormControl'

export default function Header(props) {

	return (

		<div>
			<Navbar collapseOnSelect expand="lg">

				<NavbarToggle />

				<NavbarBrand href="/index">
					<img
						src="/images/logo.png"
						className={styles.logoImage}
					/>
				</NavbarBrand>

				<Navbar.Collapse>

					<Nav className>

						<NavItem><NavLink href='checkers'>Checkers</NavLink></NavItem>
				

					</Nav>

				</Navbar.Collapse>

			</Navbar>
		</div>
	);
}