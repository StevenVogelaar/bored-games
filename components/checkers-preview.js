import Head from 'next/head'
import styles from '../styles/index.module.css'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import NewGameButton from '../components/new-game-button';
import Button from 'react-bootstrap/Button'


export default function CheckersPreview(props) {
	return (
		<Container>
			<Head>

				<title>BoredGames</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="center-block" style={{ maxWidth: 500 }}>

				<Image
					src="/images/board_1.svg"
					rounded
					fluid
					style={{ textAlign: "center" }}
				/>

				<Container style={{ textAlign: "center" }}>
					<Row>
						<Col className="center-block"><NewGameButton></NewGameButton></Col>
						<Col className="center-block"><Button size="lg">Join Game</Button></Col>
					</Row>

				</Container>

			</div>



		</Container>
	);
}
