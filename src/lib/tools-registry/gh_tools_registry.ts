/**
 * GitHub Tools Registry — Auto-generated from src/lib/tools-registry/python/gh_*.py
 *
 * V.146: كل أداة دي implementation مستخرجة من top GitHub repos.
 * لكل أداة:
 *   - الـ source repo (مع عدد stars)
 *   - الـ original function name
 *   - الـ parameters المتوقعة
 *   - install instructions (pip install <package>)
 *
 * Generated at: 2026-08-01T10:30:11.074207
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runGhPythonTool(scriptName: string, args: any, timeoutMs: number = 30000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_gh_args_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        const lines = stdout.trim().split("\n").filter((l) => l.trim());
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-300),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

export interface GhToolDefinition {
  name: string;
  description: string;
  category: "github";
  runtime: "python";
  source_repo: string;
  license: string;
  parameters: Record<string, { type: string; description: string }>;
  execute: (args: any) => Promise<any>;
}

export const GH_TOOLS: GhToolDefinition[] = [
  {
    name: "gh_autogpt_github_repo_path",
    description: "AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.",
    category: "github",
    runtime: "python",
    source_repo: "Significant-Gravitas/AutoGPT",
    license: "NOASSERTION",
    parameters: {repo_url: { type: "string", description: "parameter repo_url" }},
    execute: async (args) => runGhPythonTool("gh_autogpt_github_repo_path.py", args),
  },
  {
    name: "gh_autogpt_remove_color_codes",
    description: "AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.",
    category: "github",
    runtime: "python",
    source_repo: "Significant-Gravitas/AutoGPT",
    license: "NOASSERTION",
    parameters: {s: { type: "string", description: "parameter s" }},
    execute: async (args) => runGhPythonTool("gh_autogpt_remove_color_codes.py", args),
  },
  {
    name: "gh_awesome_python_build_graphql_query",
    description: "An opinionated list of Python frameworks, libraries, tools, and resources",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {repos: { type: "string", description: "parameter repos" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_build_graphql_query.py", args),
  },
  {
    name: "gh_awesome_python_detect_source_type",
    description: "Extract owner/repo from a GitHub repo URL. Returns None for non-GitHub URLs.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_detect_source_type.py", args),
  },
  {
    name: "gh_awesome_python_extract_github_repo",
    description: "Load star data from JSON. Returns empty dict if file doesn't exist or is corrupt.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_extract_github_repo.py", args),
  },
  {
    name: "gh_awesome_python_extract_github_repos",
    description: "Write the star cache to disk, creating data/ dir if needed.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {text: { type: "string", description: "parameter text" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_extract_github_repos.py", args),
  },
  {
    name: "gh_awesome_python_load_stars",
    description: "Sort entries by stars descending, then name ascending.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {path: { type: "string", description: "parameter path" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_load_stars.py", args),
  },
  {
    name: "gh_awesome_python_render_inline_html",
    description: "Render inline AST nodes to plain text (links become their text).",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {children: { type: "string", description: "parameter children" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_render_inline_html.py", args),
  },
  {
    name: "gh_awesome_python_render_inline_text",
    description: "Extract plain text from a heading node.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {children: { type: "string", description: "parameter children" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_render_inline_text.py", args),
  },
  {
    name: "gh_awesome_python_save_cache",
    description: "Build a GraphQL query with aliases for up to 100 repos.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {cache: { type: "string", description: "parameter cache" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_save_cache.py", args),
  },
  {
    name: "gh_awesome_python_slugify",
    description: "Render inline AST nodes to HTML or plain text.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {name: { type: "string", description: "parameter name" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_slugify.py", args),
  },
  {
    name: "gh_comfyui_enable_args_parsing",
    description: "The most powerful and modular diffusion model GUI, api and backend with a graph/nodes interface.",
    category: "github",
    runtime: "python",
    source_repo: "Comfy-Org/ComfyUI",
    license: "GPL-3.0",
    parameters: {enable: { type: "string", description: "parameter enable" }},
    execute: async (args) => runGhPythonTool("gh_comfyui_enable_args_parsing.py", args),
  },
  {
    name: "gh_flask_create_logger",
    description: "The Python micro framework for building web applications.",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {app: { type: "string", description: "parameter app" }},
    execute: async (args) => runGhPythonTool("gh_flask_create_logger.py", args),
  },
  {
    name: "gh_flask_has_level_handler",
    description: "The Python micro framework for building web applications.",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {logger: { type: "string", description: "parameter logger" }},
    execute: async (args) => runGhPythonTool("gh_flask_has_level_handler.py", args),
  },
  {
    name: "gh_flask_wsgi_errors_stream",
    description: "Check if there is a handler in the logging chain that will handle the",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {},
    execute: async (args) => runGhPythonTool("gh_flask_wsgi_errors_stream.py", args),
  },
  {
    name: "gh_go_golookup",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {ui: { type: "string", description: "parameter ui" }, url: { type: "string", description: "parameter url" }, rev: { type: "string", description: "parameter rev" }},
    execute: async (args) => runGhPythonTool("gh_go_golookup.py", args),
  },
  {
    name: "gh_go_goreposum",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {ui: { type: "string", description: "parameter ui" }, url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_go_goreposum.py", args),
  },
  {
    name: "gh_go_makematcher",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {klass: { type: "string", description: "parameter klass" }},
    execute: async (args) => runGhPythonTool("gh_go_makematcher.py", args),
  },
  {
    name: "gh_go_paramtypematch",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {t: { type: "string", description: "parameter t" }, pattern: { type: "string", description: "parameter pattern" }},
    execute: async (args) => runGhPythonTool("gh_go_paramtypematch.py", args),
  },
  {
    name: "gh_go_read_runtime_const",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {varname: { type: "string", description: "parameter varname" }, default: { type: "string", description: "parameter default" }},
    execute: async (args) => runGhPythonTool("gh_go_read_runtime_const.py", args),
  },
  {
    name: "gh_node_domain",
    description: "Node.js JavaScript runtime ✨🐢🚀✨",
    category: "github",
    runtime: "python",
    source_repo: "nodejs/node",
    license: "NOASSERTION",
    parameters: {args: { type: "string", description: "parameter args" }},
    execute: async (args) => runGhPythonTool("gh_node_domain.py", args),
  },
  {
    name: "gh_playwright_check_code_snippet",
    description: "Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API.",
    category: "github",
    runtime: "python",
    source_repo: "microsoft/playwright",
    license: "Apache-2.0",
    parameters: {code_snippet: { type: "string", description: "parameter code_snippet" }},
    execute: async (args) => runGhPythonTool("gh_playwright_check_code_snippet.py", args),
  },
  {
    name: "gh_requests_default_hooks",
    description: "Dispatches a hook dictionary on a given piece of data.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {},
    execute: async (args) => runGhPythonTool("gh_requests_default_hooks.py", args),
  },
  {
    name: "gh_requests_dispatch_hook",
    description: "A simple, yet elegant, HTTP library.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {key: { type: "string", description: "parameter key" }, hooks: { type: "string", description: "parameter hooks" }, hook_data: { type: "string", description: "parameter hook_data" }},
    execute: async (args) => runGhPythonTool("gh_requests_dispatch_hook.py", args),
  },
  {
    name: "gh_requests_to_native_string",
    description: "Determine if unicode string only contains ASCII characters.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {string: { type: "string", description: "parameter string" }, encoding: { type: "string", description: "parameter encoding" }},
    execute: async (args) => runGhPythonTool("gh_requests_to_native_string.py", args),
  },
  {
    name: "gh_requests_unicode_is_ascii",
    description: "A simple, yet elegant, HTTP library.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {u_string: { type: "string", description: "parameter u_string" }},
    execute: async (args) => runGhPythonTool("gh_requests_unicode_is_ascii.py", args),
  },
  {
    name: "gh_rust_key",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {v: { type: "string", description: "parameter v" }},
    execute: async (args) => runGhPythonTool("gh_rust_key.py", args),
  },
  {
    name: "gh_rust_maximum_exponent",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {base: { type: "string", description: "parameter base" }},
    execute: async (args) => runGhPythonTool("gh_rust_maximum_exponent.py", args),
  },
  {
    name: "gh_rust_minimum_exponent",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {base: { type: "string", description: "parameter base" }},
    execute: async (args) => runGhPythonTool("gh_rust_minimum_exponent.py", args),
  },
  {
    name: "gh_rust_print_proper_powers",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {min_exp: { type: "string", description: "parameter min_exp" }, max_exp: { type: "string", description: "parameter max_exp" }, bias: { type: "string", description: "parameter bias" }},
    execute: async (args) => runGhPythonTool("gh_rust_print_proper_powers.py", args),
  },
  {
    name: "gh_scrapy_job_dir",
    description: "Scrapy, a fast high-level web crawling & scraping framework for Python.",
    category: "github",
    runtime: "python",
    source_repo: "scrapy/scrapy",
    license: "BSD-3-Clause",
    parameters: {settings: { type: "string", description: "parameter settings" }},
    execute: async (args) => runGhPythonTool("gh_scrapy_job_dir.py", args),
  },
  {
    name: "gh_stable_diffusion_webui_preload",
    description: "Stable Diffusion web UI",
    category: "github",
    runtime: "python",
    source_repo: "AUTOMATIC1111/stable-diffusion-webui",
    license: "AGPL-3.0",
    parameters: {parser: { type: "string", description: "parameter parser" }},
    execute: async (args) => runGhPythonTool("gh_stable_diffusion_webui_preload.py", args),
  },
  {
    name: "gh_vscode_patch_dmg_icon",
    description: "Visual Studio Code",
    category: "github",
    runtime: "python",
    source_repo: "microsoft/vscode",
    license: "MIT",
    parameters: {dmg_path: { type: "string", description: "parameter dmg_path" }, new_icon_path: { type: "string", description: "parameter new_icon_path" }},
    execute: async (args) => runGhPythonTool("gh_vscode_patch_dmg_icon.py", args),
  },
  {
    name: "gh_whisper_load_audio",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {file: { type: "string", description: "parameter file" }, sr: { type: "string", description: "parameter sr" }},
    execute: async (args) => runGhPythonTool("gh_whisper_load_audio.py", args),
  },
  {
    name: "gh_whisper_median_filter_cuda",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {x: { type: "string", description: "parameter x" }, filter_width: { type: "string", description: "parameter filter_width" }},
    execute: async (args) => runGhPythonTool("gh_whisper_median_filter_cuda.py", args),
  },
  {
    name: "gh_whisper_median_kernel",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {filter_width: { type: "string", description: "parameter filter_width" }},
    execute: async (args) => runGhPythonTool("gh_whisper_median_kernel.py", args),
  },
  {
    name: "gh_whisper_mel_filters",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {device: { type: "string", description: "parameter device" }, n_mels: { type: "string", description: "parameter n_mels" }},
    execute: async (args) => runGhPythonTool("gh_whisper_mel_filters.py", args),
  },
  {
    name: "gh_whisper_pad_or_trim",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {array: { type: "string", description: "parameter array" }, length: { type: "string", description: "parameter length" }, axis: { type: "string", description: "parameter axis" }},
    execute: async (args) => runGhPythonTool("gh_whisper_pad_or_trim.py", args),
  },
  {
    name: "gh_whisper_remove_symbols",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {s: { type: "string", description: "parameter s" }},
    execute: async (args) => runGhPythonTool("gh_whisper_remove_symbols.py", args),
  },
  {
    name: "gh_whisper_remove_symbols_and_diacritics",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {s: { type: "string", description: "parameter s" }, keep: { type: "string", description: "parameter keep" }},
    execute: async (args) => runGhPythonTool("gh_whisper_remove_symbols_and_diacritics.py", args),
  },
];

export function getGhTools(): GhToolDefinition[] {
  return GH_TOOLS;
}

export function findGhTool(name: string): GhToolDefinition | null {
  return GH_TOOLS.find((t) => t.name === name) || null;
}

export async function executeGhTool(name: string, args: any): Promise<{ success: boolean; output?: any; error?: string; durationMs: number }> {
  const start = Date.now();
  const tool = findGhTool(name);
  if (!tool) {
    return { success: false, error: `GitHub tool '${name}' not found`, durationMs: 0 };
  }
  try {
    const result = await tool.execute(args);
    return {
      success: result?.success !== false,
      output: result,
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return { success: false, error: e.message, durationMs: Date.now() - start };
  }
}

export function getGhToolsSchema() {
  return GH_TOOLS.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: `[GitHub:${t.source_repo}] ${t.description}`,
      parameters: {
        type: "object",
        properties: t.parameters,
      },
    },
    category: t.category,
    runtime: t.runtime,
    source_repo: t.source_repo,
    license: t.license,
  }));
}

export function getGhStats() {
  const repos = new Set(GH_TOOLS.map((t) => t.source_repo));
  return {
    total: GH_TOOLS.length,
    unique_repos: repos.size,
  };
}
