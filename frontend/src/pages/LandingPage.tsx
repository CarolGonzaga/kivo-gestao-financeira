import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  PieChart,
  TrendingUp,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: PieChart,
    title: "Visão clara dos gastos",
    description:
      "Entenda para onde vai seu dinheiro com gráficos simples e intuitivos",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe sua evolução",
    description: "Veja seu progresso financeiro ao longo do tempo",
  },
  {
    icon: Wallet,
    title: "Controle total do saldo",
    description:
      "Saiba exatamente quanto você tem disponível a qualquer momento",
  },
];

const features = [
  "Sincronize suas transações automaticamente",
  "Categorize gastos de forma inteligente",
  "Receba alertas de gastos excessivos",
  "Exporte relatórios mensais",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in">
              Controle financeiro{" "}
              <span className="text-primary">claro e simples</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl animate-fade-in-up">
              Transforme suas transações em informações que fazem sentido. Tome
              decisões melhores sobre seu dinheiro.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Começar agora
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient orb */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-success/10 blur-3xl" />
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Tudo que você precisa para organizar suas finanças
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative rounded-2xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8 md:text-3xl">
              Recursos que simplificam sua vida
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Pronto para ter controle das suas finanças?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Comece gratuitamente e veja a diferença que a clareza financeira
              pode fazer.
            </p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Criar minha conta grátis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Kivo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
