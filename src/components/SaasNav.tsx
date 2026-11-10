import { Link } from 'react-router-dom';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';
export function SaasNav() {
  return <header className="border-b border-border bg-background"><div className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between gap-4"><Link to="/" className="flex items-center gap-2 text-2xl font-bold"><CalendarDays className="h-7 w-7 text-primary"/>agenda<span className="text-primary">.</span></Link><nav className="hidden md:flex gap-8 text-sm text-muted-foreground"><a href="/#demonstracoes">Demonstrações</a><a href="/#planos">Planos</a><a href="/#perguntas">Dúvidas</a></nav><div className="flex gap-2"><Button variant="ghost" asChild><Link to="/entrar">Entrar</Link></Button><Button asChild className="hidden sm:inline-flex"><Link to="/cadastro">Começar grátis <ArrowUpRight className="ml-2 h-4 w-4"/></Link></Button></div></div></header>;
}