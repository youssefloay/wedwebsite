import { Navigation } from './Navigation';
import { Heart, Globe, Home as HomeIcon, CreditCard } from 'lucide-react';

export function GiftsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="label-uppercase">Wedding Registry</span>
          <h1 className="title-hero">Gifts</h1>
          <p className="text-xl font-serif italic text-secondary-text">
            Your presence is our greatest gift
          </p>
          <div className="w-16 h-px mx-auto mt-12 bg-border" />
        </div>
      </section>

      {/* MAIN MESSAGE */}
      <section className="section-container pt-0">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="wedding-card bg-accent-beige/5 border-accent-beige/20 text-center py-12 px-8">
            <Heart className="mx-auto mb-6 text-accent-terracotta" size={32} />
            <p className="text-2xl font-serif text-primary-text leading-relaxed italic">
              "The most important thing for us is to have you there, celebrating our new beginning together."
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-lg text-secondary-text max-w-xl mx-auto">
              However, if you wish to honor us with a gift, we would be deeply grateful for a contribution towards our future home.
            </p>
            <div className="flex justify-center items-center gap-4 py-8">
              <div className="w-12 h-px bg-border" />
              <HomeIcon className="text-accent-beige" size={20} />
              <div className="w-12 h-px bg-border" />
            </div>
          </div>

          {/* BANK DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Worldwide */}
            <div className="wedding-card flex flex-col items-center text-center group hover:border-accent-terracotta transition-colors">
              <div className="p-4 bg-background rounded-full mb-6 text-accent-beige group-hover:text-accent-terracotta transition-colors">
                <Globe size={24} />
              </div>
              <span className="label-uppercase text-xs mb-4">Worldwide</span>
              <h3 className="font-serif text-xl text-primary-text mb-6">Revolut</h3>
              <div className="space-y-4 text-sm text-secondary-text w-full">
                <div className="flex flex-col border-b border-border/30 pb-3">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Holder</span>
                  <span className="text-primary-text font-medium">Lama & Alvaro</span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Link</span>
                  <a href="https://revolut.me/lamaalvaro" target="_blank" rel="noreferrer" className="text-accent-terracotta font-serif text-lg hover:underline mt-1">
                    revolut.me/lamaalvaro
                  </a>
                </div>
              </div>
            </div>

            {/* France */}
            <div className="wedding-card flex flex-col items-center text-center group hover:border-accent-terracotta transition-colors">
              <div className="p-4 bg-background rounded-full mb-6 text-accent-beige group-hover:text-accent-terracotta transition-colors">
                <CreditCard size={24} />
              </div>
              <span className="label-uppercase text-xs mb-4">France</span>
              <h3 className="font-serif text-xl text-primary-text mb-6">Boursorama</h3>
              <div className="space-y-4 text-sm text-secondary-text w-full">
                <div className="flex flex-col border-b border-border/30 pb-3">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Holder</span>
                  <span className="text-primary-text font-medium">Lama ******</span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">IBAN</span>
                  <span className="text-primary-text break-all font-mono text-[10px] mt-2">
                    FR76 1234 5678 9012 3456 7890 123
                  </span>
                </div>
              </div>
            </div>

            {/* Switzerland */}
            <div className="wedding-card flex flex-col items-center text-center group hover:border-accent-terracotta transition-colors">
              <div className="p-4 bg-background rounded-full mb-6 text-accent-beige group-hover:text-accent-terracotta transition-colors">
                <CreditCard size={24} />
              </div>
              <span className="label-uppercase text-xs mb-4">Switzerland</span>
              <h3 className="font-serif text-xl text-primary-text mb-6">UBS</h3>
              <div className="space-y-4 text-sm text-secondary-text w-full">
                <div className="flex flex-col border-b border-border/30 pb-3">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Holder</span>
                  <span className="text-primary-text font-medium">Lama ******</span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">IBAN</span>
                  <span className="text-primary-text break-all font-mono text-[10px] mt-2">
                    CH93 0076 2011 6238 5295 7
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Cash box notice */}
          <div className="text-center py-12 px-6 border-t border-border mt-12">
            <p className="text-secondary-text italic text-sm">
              For your convenience, a collection box will also be available at the venue terrace for those who prefer to share their wishes in person.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-border bg-background">
        <p className="label-uppercase mb-0">Lama & Álvaro · 2027</p>
      </footer>
    </div>
  );
}