import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { getGitHubRepositoryProjects } from '@/data/githubRepositories';

export default async function Home() {
  const projects = await getGitHubRepositoryProjects();

  return (
    <main className="min-h-screen flex flex-col pt-20">
      <div className="flex-grow">
        <Hero projects={projects} />
      </div>
      <Footer />
    </main>
  );
}
