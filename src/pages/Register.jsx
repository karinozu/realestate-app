import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import styles from './Auth.module.css'

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      // 確認メール送信後にログイン画面へ誘導
      setMessage('確認メールを送信しました。メールを確認後、ログインしてください。')
      setTimeout(() => navigate('/login'), 3000)
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>会員登録</h1>
        <p className={styles.subtitle}>不動産管理システム</p>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="パスワードを入力"
              minLength={6}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className={styles.link}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
