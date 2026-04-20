import styles from './PropertyCard.module.css'

// 物件情報を表示するカードコンポーネント
function PropertyCard({ property }) {
  const { name, rent, area, type, floor } = property

  return (
    <div className={styles.card}>
      <div className={styles.badge}>{type}</div>
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>エリア</span>
          <span className={styles.rowValue}>{area}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>フロア</span>
          <span className={styles.rowValue}>{floor}</span>
        </div>
      </div>
      <div className={styles.rent}>
        <span className={styles.rentAmount}>{rent.toLocaleString()}</span>
        <span className={styles.rentUnit}>円/月</span>
      </div>
    </div>
  )
}

export default PropertyCard
