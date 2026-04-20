import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

// 未ログインの場合はログイン画面へリダイレクトするガードコンポーネント
function AuthGuard({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // セッション変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // セッション確認中はローディング表示
  if (session === undefined) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>読み込み中...</div>
  }

  // 未ログインならログイン画面へ
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AuthGuard
