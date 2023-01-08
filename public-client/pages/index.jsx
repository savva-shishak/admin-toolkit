import Head from 'next/head'
import styles from '../styles/Shop.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Магазин телефонов</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.head}>
        Шапка
      </div>

      <div className={styles.main}>
        Основная часть
      </div>
    </div>
  )
}
