import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PropertyCard from '../components/PropertyCard.jsx'
import PropertyForm from '../components/PropertyForm.jsx'
import styles from './Properties.module.css'

function Properties() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件（nullなら新規登録モード）
  const [editingProperty, setEditingProperty] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email)
    })
    fetchProperties()
  }, [])

  // Supabaseから自分の物件一覧を取得（RLSにより自分のデータのみ返る）
  const fetchProperties = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 新規登録または更新を処理する
  const handleSubmit = async (formData) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (editingProperty) {
      // 既存物件の更新（UPDATE）
      const { error } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          rent: Number(formData.rent),
          area: formData.area,
          floor_plan: formData.floor_plan,
        })
        .eq('id', editingProperty.id)

      if (error) {
        return '更新に失敗しました: ' + error.message
      }
    } else {
      // 新規物件の登録（INSERT）
      const { error } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          name: formData.name,
          rent: Number(formData.rent),
          area: formData.area,
          floor_plan: formData.floor_plan,
        })

      if (error) {
        return '登録に失敗しました: ' + error.message
      }
    }

    // 成功したら一覧を再取得してフォームを閉じる
    await fetchProperties()
    closeForm()
    return null
  }

  // 物件を削除する（DELETE）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // 削除成功後はローカルのstateからも除去して即時反映
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const openCreateForm = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const openEditForm = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

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
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && (
              <p className={styles.count}>{properties.length}件の物件</p>
            )}
          </div>
          <button onClick={openCreateForm} className={styles.addButton}>
            ＋ 物件を登録
          </button>
        </div>

        {/* エラー表示 */}
        {error && <p className={styles.error}>{error}</p>}

        {/* ローディング中 */}
        {loading && <p className={styles.loading}>読み込み中...</p>}

        {/* 物件が0件のとき */}
        {!loading && properties.length === 0 && !error && (
          <div className={styles.empty}>
            <p>まだ物件が登録されていません。</p>
            <button onClick={openCreateForm} className={styles.addButton}>
              最初の物件を登録する
            </button>
          </div>
        )}

        {/* 物件カード一覧 */}
        <div className={styles.grid}>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={() => openEditForm(property)}
              onDelete={() => handleDelete(property.id)}
            />
          ))}
        </div>
      </main>

      {/* 新規登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

export default Properties
