import styles from './footer.module.css'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand'

export default function Footer(props){

	return(

        <div className={styles.footer + ' fixed-bottom'}>  
            <Navbar color="dark" dark>
                <Container>
                 	<NavbarBrand>BoredGames</NavbarBrand>
                </Container>
            </Navbar>
        </div>
    )
}