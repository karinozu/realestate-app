import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Properties from './pages/Properties.jsx'
import AuthGuard from './components/AuthGuard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン・会員登録は誰でもアクセス可 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 物件一覧はログイン必須 */}
        <Route
          path="/properties"
          element={
            <AuthGuard>
              <Properties />
            </AuthGuard>
          }
        />

        {/* ルートはログイン画面へリダイレクト */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
