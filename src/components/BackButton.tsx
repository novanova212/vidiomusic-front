import { useNavigate } from 'react-router-dom'

export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const navigate = useNavigate()

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate(fallback)
  }

  return (
    <button type="button" className="btn-back" onClick={goBack}>
      ← Kembali
    </button>
  )
}
