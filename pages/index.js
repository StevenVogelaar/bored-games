import Head from 'next/head'
import styles from '../styles/index.module.css'
import Container from 'react-bootstrap/Container'
import CheckersPreview from '../components/checkers-preview'

export default function Home() {

  const boardClasses = styles.boardImage + ' center-block'

  return (
    <Container>
      <Head>

        <title>BoredGames</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CheckersPreview/>



    </Container>
  )

}
