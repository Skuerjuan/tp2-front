import Link from "next/link";

export default function Navbar({ active }) {
    return(
        <nav id="nav">
        <Link href="/" className={active === "home" ? "active" : ""}>
            Home
        </Link>
        <Link href="/leidos" className={active === "leidos" ? "active" : ""}>
            Libros leídos
        </Link>
        <Link href="/libros" className={active === "libros" ? "active" : ""}>
            Libros
        </Link>
        <Link href="/buscar" className={active === "buscar" ? "active" : ""}>
            Buscar
        </Link>
        <Link href="/cuenta" className={active === "cuenta" ? "active" : ""}>
            Mi cuenta
        </Link>
        </nav>
    )
}