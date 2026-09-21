import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/">CYBERELAY</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/computers">Browse</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link className="button button-small button-outline" href="/computers">Find a computer</Link>
      </div>
    </header>
  );
}
