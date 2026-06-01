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
        <Link href="/resenas" className={active === "resenas" ? "active" : ""}>
            Reseñas
        </Link>
        <Link href="/buscar" className={active === "buscar" ? "active" : ""}>
            Buscar
        </Link>
        </nav>
    )
}