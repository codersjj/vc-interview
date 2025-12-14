// Piston API is a service for code execution

// see: https://github.com/engineer-man/piston?tab=readme-ov-file#public-api
const PISTON_API = "https://emkc.org/api/v2/piston";

export const LANGUAGE = {
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
} as const;

export type LANGUAGE = (typeof LANGUAGE)[keyof typeof LANGUAGE];

const EXTENSION = {
  [LANGUAGE.JavaScript]: "js",
  [LANGUAGE.Python]: "py",
  [LANGUAGE.Java]: "java",
} as const;

type EXTENSION = (typeof EXTENSION)[keyof typeof EXTENSION];

interface LanguageVersion {
  language: LANGUAGE;
  version: string;
}

const LANGUAGE_VERSIONS: Record<LANGUAGE, LanguageVersion> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

export interface Result {
  success: boolean;
  output?: string;
  error?: string;
}

/**
 *
 * @param language programming language
 * @param code source code to executed
 */
export const executeCode = async (
  language: LANGUAGE,
  code: string
): Promise<Result> => {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return Promise.resolve({
        success: false,
        error: `Unsupported language ${language}`,
      });
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(languageConfig.language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return Promise.resolve({
        success: false,
        error: `HTTP error! Status: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data.run) {
      return {
        success: false,
        error: data.message || "Unexpected API response structure",
      };
    }

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return Promise.resolve({
        success: false,
        output: output,
        error: stderr,
      });
    }

    return Promise.resolve({
      success: true,
      output: output || "No output",
    });
  } catch (error) {
    return Promise.resolve({
      success: false,
      error: `Failed to execute code: ${
        error instanceof Error ? error.message : error
      }`,
    });
  }
};

const getFileExtension = (language: LANGUAGE): EXTENSION | string =>
  EXTENSION[language] || "";
