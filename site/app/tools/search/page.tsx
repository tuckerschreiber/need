import { searchTools } from "@/lib/api";
import { SearchBar } from "@/components/ui/search-bar";
import { ToolCard } from "@/components/ui/tool-card";

export const metadata = {
  title: "Search Results | need",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          <SearchBar />
          <p className="text-muted-foreground">Enter a search query to find CLI tools.</p>
        </div>
      </div>
    );
  }

  const results = await searchTools(q, 20);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center gap-6">
        <SearchBar defaultValue={q} />
        <p className="text-muted-foreground text-sm">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {results.map((tool) => (
          <ToolCard key={tool.id} tool={tool} showSimilarity />
        ))}
        {results.length === 0 && (
          <p className="text-muted-foreground text-center">No tools found. Try a different search.</p>
        )}
      </div>
    </div>
  );
}
