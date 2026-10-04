import { Hero } from '@/components/home/Hero';
import { ServiceStrip } from '@/components/home/ServiceStrip';
import { ProblemSolution } from '@/components/home/ProblemSolution';
import { AboutPreview } from '@/components/home/AboutPreview';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { HowWeWork } from '@/components/home/HowWeWork';
import { TeamPreview } from '@/components/home/TeamPreview';
import { TestimonialsPreview } from '@/components/home/TestimonialsPreview';
import { BlogPreview } from '@/components/home/BlogPreview';
import { FinalCta } from '@/components/home/FinalCta';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {FeaturedServiceHighlight} from '@/components/home/FeaturedServiceHighlight';
import { GrowthMetrics } from '@/components/home/GrowthMetrics';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceStrip />
      <ProblemSolution />
      <FeaturedServiceHighlight />
      <AboutPreview />
      <FeaturedServices />
      <HowWeWork />
      <GrowthMetrics />
      <TeamPreview />
      <TestimonialsPreview />
      <BlogPreview />
      <FinalCta />

      
    </>
  );
}
