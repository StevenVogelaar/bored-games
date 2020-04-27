import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import CheckersPreview from '../components/checkers-preview'


export default function Checkers(props) {
	return (
		<Container>

			<CheckersPreview/>
			<CheckersPreview/>
			<CheckersPreview/>

		</Container>
	);
}