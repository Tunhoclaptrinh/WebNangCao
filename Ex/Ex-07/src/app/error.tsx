"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="container status-page">
      <span className="status-code">!</span>
      <h1>Chưa thể tải nội dung.</h1>
      <p>Vui lòng thử lại sau một chút.</p>
      <button className="button-primary" onClick={reset}>
        Thử lại
      </button>
    </main>
  );
}
