import {
  BrainCircuitIcon,
  GithubIcon,
  SearchIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";

import FAQ from "../components/sections/faq/default";
import Footer from "../components/sections/footer/default";
import Items from "../components/sections/items/default";
import Navbar from "../components/sections/navbar/default";
import { DotPattern } from "../components/ui/dot-pattern";
import { InstallCommand } from "../components/ui/install-command";
import { LayoutLines } from "../components/ui/layout-lines";
import { Section } from "../components/ui/section";
import { Terminal } from "../components/ui/terminal";

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />

      {/* Navbar */}
      <Navbar
        name="need"
        logo={null}
        showNavigation={false}
        mobileLinks={[{ text: "Browse Tools", href: "/tools" }]}
        actions={[
          {
            text: "Browse Tools",
            href: "/tools",
            isButton: true,
            variant: "ghost",
          },
          {
            text: "GitHub",
            href: "https://github.com/tuckerschreiber/need",
            isButton: true,
            variant: "ghost",
            icon: <GithubIcon className="mr-2 size-4" />,
          },
        ]}
      />

      {/* Hero */}
      <Section className="relative overflow-hidden">
        <DotPattern className="fade-bottom" />
        <div className="relative mx-auto max-w-[760px] flex flex-col pt-2 sm:pt-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="animate-appear text-muted-foreground text-xs tracking-wide font-medium">
              Open Source  ·  No API Keys  ·  MCP Native  ·  Any Agent
            </p>
            <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent sm:text-6xl sm:leading-tight">
              Find the right CLI tool in plain English
            </h1>
            <p className="animate-appear text-muted-foreground relative z-10 max-w-[540px] text-base font-medium text-balance opacity-0 delay-100">
              <code className="font-mono">need</code> searches thousands of tools using semantic similarity. Works from your terminal or as an MCP server for AI coding agents.
            </p>
            <div className="flex flex-col items-center gap-3">
              <InstallCommand command={`npx @needtools/need "compress png images"`} />
              <a
                href="https://github.com/tuckerschreiber/need"
                className="text-muted-foreground hover:text-foreground animate-appear inline-flex items-center gap-1.5 text-sm opacity-0 delay-500 transition-colors"
              >
                <GithubIcon className="size-3.5" />
                View source on GitHub
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section>
        <div className="mx-auto max-w-[860px] flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-2xl font-semibold sm:text-4xl">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-[540px] text-sm text-balance">
              Search engines match keywords. LLMs hallucinate package names. <code className="font-mono">need</code> matches intent.
            </p>
          </div>
          <div className="grid w-full gap-10">
            {/* Step 1: Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
              <div className="flex flex-col gap-1.5 md:w-1/3 md:pt-3">
                <span className="text-brand text-sm font-semibold">1. Search</span>
                <p className="text-muted-foreground text-sm">
                  Describe what you need. Get ranked results by semantic similarity.
                </p>
              </div>
              <Terminal title="~" className="flex-1">
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-foreground">need compress png images without losing quality</span>
                {"\n\n"}
                <span className="text-muted-foreground">{"  "}1.</span>{" "}
                <span className="text-foreground">pngquant</span>
                {"       "}
                <span className="text-muted-foreground">brew install pngquant</span>
                {"     "}
                <span className="text-brand">92%</span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}2.</span>{" "}
                <span className="text-foreground">optipng</span>
                {"        "}
                <span className="text-muted-foreground">brew install optipng</span>
                {"       "}
                <span className="text-brand">87%</span>
                {"\n"}
                <span className="text-muted-foreground">{"  "}3.</span>{" "}
                <span className="text-foreground">imagemagick</span>
                {"    "}
                <span className="text-muted-foreground">brew install imagemagick</span>
                {"   "}
                <span className="text-brand">94%</span>
              </Terminal>
            </div>

            {/* Step 2: Install */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
              <div className="flex flex-col gap-1.5 md:w-1/3 md:pt-3">
                <span className="text-brand text-sm font-semibold">2. Install</span>
                <p className="text-muted-foreground text-sm">
                  Pick a tool and install it directly.
                </p>
              </div>
              <Terminal title="~" className="flex-1">
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-foreground">need install &quot;convert video to gif&quot;</span>
                {"\n"}
                {"  "}Install which tool? [1-5/n]{" "}
                <span className="text-foreground">1</span>
                {"\n"}
                {"  "}Running:{" "}
                <span className="text-muted-foreground">brew install ffmpeg</span>
                {"\n"}
                {"  "}
                <span className="text-brand">✓</span> Installed ffmpeg successfully.
              </Terminal>
            </div>

            {/* Step 3: Report */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
              <div className="flex flex-col gap-1.5 md:w-1/3 md:pt-3">
                <span className="text-brand text-sm font-semibold">3. Report</span>
                <p className="text-muted-foreground text-sm">
                  Tell us if it worked. Every signal improves results.
                </p>
              </div>
              <Terminal title="~" className="flex-1">
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-foreground">need report pngquant --success</span>
                {"\n"}
                {"  "}
                <span className="text-brand">✓</span> Reported success for &quot;pngquant&quot;.
              </Terminal>
            </div>
            {/* Step 4: Connect */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
              <div className="flex flex-col gap-1.5 md:w-1/3 md:pt-3">
                <span className="text-brand text-sm font-semibold">4. Connect</span>
                <p className="text-muted-foreground text-sm">
                  One command adds <code className="font-mono">need</code> as an MCP server for your AI agent.
                </p>
              </div>
              <Terminal title="~" className="flex-1">
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-foreground">need setup</span>
                {"\n"}
                {"  "}
                <span className="text-brand">✓</span> Claude Code — configured
                {"\n"}
                {"  "}
                <span className="text-brand">✓</span> Cursor — configured
              </Terminal>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Items
        title="Everything you need. Nothing you don't."
        items={[
          {
            title: "Semantic search",
            description: "Describe what you need in plain English. No exact package names required.",
            icon: <SearchIcon className="size-5 stroke-1" />,
          },
          {
            title: "MCP native",
            description: "Built as a Model Context Protocol server from day one.",
            icon: <BrainCircuitIcon className="size-5 stroke-1" />,
          },
          {
            title: "Security allowlist",
            description: "install_tool only runs safe package manager commands. No arbitrary code execution.",
            icon: <ShieldCheckIcon className="size-5 stroke-1" />,
          },
          {
            title: "Zero config",
            description: "No API keys, no accounts, no setup. Just npx and go.",
            icon: <ZapIcon className="size-5 stroke-1" />,
          },
        ]}
      />

      {/* FAQ */}
      <FAQ
        title="Questions & Answers"
        items={[
          {
            question: "Can't I just Google this?",
            answer: (
              <p className="text-muted-foreground max-w-[600px]">
                You can. You&apos;ll get a Stack Overflow answer from 2019, three Medium articles behind
                paywalls, and a GitHub repo with 2 stars last updated in 2021. need gives you ranked,
                current results with install commands and success rates.
              </p>
            ),
          },
          {
            question: "Can't AI agents just know which tools exist?",
            answer: (
              <p className="text-muted-foreground max-w-[600px]">
                They can&apos;t. LLMs have a training cutoff and frequently hallucinate package names.
                need gives them a real-time, verified index to search against.
              </p>
            ),
          },
          {
            question: "What if I don't use AI agents?",
            answer: (
              <p className="text-muted-foreground max-w-[600px]">
                need works great as a standalone CLI. Think of it as tldr meets brew search with
                semantic understanding. The MCP integration is a bonus, not a requirement.
              </p>
            ),
          },
          {
            question: "How is this different from package manager search?",
            answer: (
              <p className="text-muted-foreground max-w-[600px]">
                brew search and apt search match keywords. need understands intent. Search &quot;make
                images smaller&quot; and you&apos;ll get pngquant, optipng, and jpegoptim — not just
                packages with &quot;image&quot; in the name.
              </p>
            ),
          },
          {
            question: "Is it safe to let AI agents install things?",
            answer: (
              <p className="text-muted-foreground max-w-[600px]">
                The MCP install_tool only allows commands from a strict allowlist: brew install, apt
                install, npm install -g, pip install, cargo install. Shell metacharacters are rejected.
                No arbitrary code execution.
              </p>
            ),
          },
        ]}
      />

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-[520px] flex flex-col items-center gap-5 text-center">
          <h2 className="text-2xl font-semibold sm:text-4xl">
            Try it now
          </h2>
          <InstallCommand command={`npx @needtools/need "convert pdf to png"`} />
          <p className="text-muted-foreground text-sm">
            Then run <code className="font-mono">need setup</code> to connect your AI agent.
          </p>
          <div className="mt-2 flex items-center gap-6">
            <a href="https://github.com/tuckerschreiber/need" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@needtools/need" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              npm
            </a>
            <span className="text-muted-foreground text-sm">MIT License</span>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Footer
        logo={null}
        name="need"
        columns={[]}
        copyright="© 2026 Tucker Schreiber"
        policies={[]}
        showModeToggle={false}
      />
    </main>
  );
}
