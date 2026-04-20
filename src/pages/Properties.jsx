import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PropertyCard from '../components/PropertyCard.jsx'
import styles from './Properties.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドメゾン渋谷', rent: 180000, area: '東京都渋谷区', type: '1LDK', floor: '5F' },
  { id: 2, name: 'パークハイツ新宿', rent: 120000, area: '東京都新宿区', type: '1K', floor: '3F' },
  { id: 3, name: 'サンライズ横浜', rent: 95000, area: '神奈川県横浜市', type: '1K', floor: '2F' },
  { id: 4, name: 'ブルームガーデン大阪', rent: 85000, area: '大阪府大阪市中央区', type: '1R', floor: '4F' },
  { id: 5, name: 'リバーサイド品川', rent: 210000, area: '東京都品川区', type: '2LDK', floor: '8F' },
  { id: 6, name: 'エトワール池袋', rent: 75000, area: '東京都豊島区', type: '1R', floor: '1F' },
]

function Properties() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // ログイン中のユーザー情報を取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>不動産管理システム</h1>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{userEmail}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>物件一覧</h2>
        <p className={styles.count}>{DUMMY_PROPERTIES.length}件の物件</p>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Properties
