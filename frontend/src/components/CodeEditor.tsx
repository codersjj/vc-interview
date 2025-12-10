import { Editor } from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import type { LANGUAGE } from "../lib/piston";
import { LANGUAGE_CONFIG } from "../data/problems";

interface CodeEditorProps {
  selectedLanguage: LANGUAGE;
  code?: string;
  isRunning: boolean;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCodeChange: (code: string | undefined) => void;
  onRunCode: () => void;
}

const CodeEditor = ({
  selectedLanguage,
  code = "",
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}: CodeEditorProps) => {
  // Safely get the language config with fallback to JavaScript
  const safeConfig = LANGUAGE_CONFIG[selectedLanguage] !== undefined
    ? LANGUAGE_CONFIG[selectedLanguage]
    : LANGUAGE_CONFIG.javascript;

  return (
    <div className="flex flex-col h-full bg-base-300">
      <div className="flex justify-between items-center px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={safeConfig.icon}
            alt={safeConfig.name}
            className="size-6"
          />
          <select
            className="select select-sm"
            value={selectedLanguage}
            onChange={onLanguageChange}
            aria-label="Select programming language"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-primary btn-sm disabled:pointer-events-auto disabled:cursor-not-allowed!"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" /> Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" /> Run Code
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height={"100%"}
          language={safeConfig.monacoLang}
          value={code}
          theme="vs-dark"
          onChange={onCodeChange}
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
