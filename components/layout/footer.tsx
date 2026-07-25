import "./footer.scss";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__disclaimer">
          本サイトは個人が運営する非公式のファンサイトです。日本サッカー協会（JFA）および日本代表とは一切関係ありません。
        </p>
        <p className="footer__copyright">© {new Date().getFullYear()} BlueScout</p>
      </div>
    </footer>
  );
}
