import Head from 'next/head'
import styles from '../styles/index.module.css'
import Container from 'react-bootstrap/Container'
import CheckersPreview from '../components/checkers-preview'
import Button from 'react-bootstrap/Button';
import ServerTester from '../components/server-tester';
import ServerTesterHTTP from '../components/server-tester-http'


export default function Home() {

  const boardClasses = styles.boardImage + ' center-block'

  return (
    <Container>
      <Head>

        <title>BoredGames</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CheckersPreview/>

      <ServerTester></ServerTester>
      <ServerTesterHTTP></ServerTesterHTTP>

    </Container>
  )

}




