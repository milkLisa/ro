export default function BossIcon({ isMVP }) {
  return (
    <span className="boss-icon">
      <img src={ `/static/icons/${ isMVP ? "mvp" : "mini" }.png` }/>
    </span>
  )
}