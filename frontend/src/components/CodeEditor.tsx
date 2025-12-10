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
  return (
    <div className="flex flex-col h-full bg-base-300">
      <div className="flex justify-between items-center px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select
            className="select select-sm"
            value={selectedLanguage}
            onChange={onLanguageChange}
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
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
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
