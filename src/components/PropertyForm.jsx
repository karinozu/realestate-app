import { useState } from 'react'
import styles from './PropertyForm.module.css'

// 物件の新規登録・編集フォーム（モーダル）
// initialData が null なら新規登録モード、値があれば編集モード
function PropertyForm({ initialData, onSubmit, onClose }) {
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    name:       initialData?.name       ?? '',
    rent:       initialData?.rent       ?? '',
    area:       initialData?.area       ?? '',
    floor_plan: initialData?.floor_plan ?? '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 家賃は正の整数のみ許容
    if (Number(formData.rent) <= 0) {
      setError('家賃は1円以上で入力してください')
      return
    }

    setLoading(true)
    const errorMessage = await onSubmit(formData)
    if (errorMessage) {
      setError(errorMessage)
    }
    setLoading(false)
  }

  return (
    // オーバーレイクリックでモーダルを閉じる
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEdit ? '物件を編集' : '物件を新規登録'}
          </h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="閉じる">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>物件名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：グランドメゾン渋谷"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>家賃（円）</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：120000"
              min={1}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>エリア名</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：東京都渋谷区"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>間取り</label>
            <select
              name="floor_plan"
              value={formData.floor_plan}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">選択してください</option>
              <option value="1R">1R</option>
              <option value="1K">1K</option>
              <option value="1DK">1DK</option>
              <option value="1LDK">1LDK</option>
              <option value="2K">2K</option>
              <option value="2DK">2DK</option>
              <option value="2LDK">2LDK</option>
              <option value="3LDK">3LDK</option>
              <option value="4LDK以上">4LDK以上</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm
