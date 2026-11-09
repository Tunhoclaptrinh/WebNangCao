export default function Loading() {
  return (
    <main id="main" className="container loading-page" aria-busy="true">
      <span className="eyebrow">DEVWORKSPACE</span>
      <p role="status">Đang tải không gian của bạn…</p>
      <div className="loading-grid">
        {["a", "b", "c", "d"].map((key) => (
          <div className="skeleton" key={key} />
        ))}
      </div>
    </main>
  );
}
