import styles from './PropertyCard.module.css'

// 物件情報を表示するカードコンポーネント（編集・削除ボタン付き）
function PropertyCard({ property, onEdit, onDelete }) {
  const { name, rent, area, floor_plan } = property

  return (
    <div className={styles.card}>
      <div className={styles.badge}>{floor_plan}</div>
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>エリア</span>
          <span className={styles.rowValue}>{area}</span>
        </div>
      </div>
      <div className={styles.rent}>
        <span className={styles.rentAmount}>{rent.toLocaleString()}</span>
        <span className={styles.rentUnit}>円/月</span>
      </div>

      {/* 編集・削除ボタン */}
      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.editButton}>
          編集
        </button>
        <button onClick={onDelete} className={styles.deleteButton}>
          削除
        </button>
      </div>
    </div>
  )
}

export default PropertyCard
