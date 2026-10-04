import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Search, FileText, Link2, BarChart3 } from 'lucide-react';

const ITEMS = [
  {
    icon: Search,
    problem: 'Low search visibility',
    solution: 'Technical and on-page SEO to help search engines understand and rank your site.',
  },
  {
    icon: FileText,
    problem: 'Weak content strategy',
    solution: 'Content planned around real search intent, not guesswork.',
  },
  {
    icon: Link2,
    problem: 'Limited quality backlinks',
    solution: 'Relevant, outreach-based link building and guest posting.',
  },
  {
    icon: BarChart3,
    problem: 'Unclear campaign performance',
    solution: 'Clear, honest reporting so you know what is actually working.',
  },
];

export function ProblemSolution() {
  return (
    <section className="py-20 md:py-28 bg-surface-cream">
      <div className="max-w-container mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="Common challenges"
          title="If this sounds familiar, you're not alone"
          description="These are the challenges we hear most often from businesses before they start working with us — and the type of work we do to address them."
          className="mb-14"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(({ icon: Icon, problem, solution }) => (
            <Card key={problem}>
              <div className="w-11 h-11 rounded-xl bg-brand-orange-light flex items-center justify-center mb-5">
                <Icon size={20} className="text-brand-orange" />
              </div>
              <h3 className="font-display font-bold text-ink mb-2">{problem}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{solution}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
