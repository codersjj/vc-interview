import type { Result } from "../lib/piston";

interface OutputPanelProps {
  output: Result | null;
}

const OutputPanel = ({ output }: OutputPanelProps) => {
  return (
    <div className="flex flex-col gap-2 h-full bg-base-100">
      <h3 className="px-2 text-lg text-base-content font-semibold bg-base-200 border-b border-base-300">
        Output
      </h3>
      <div className="flex-1 p-4 overflow-auto">
        {output === null ? (
          <p className="text-base-content/80 text-sm">
            Click "Run Code" button to see the output here...
          </p>
        ) : output.success ? (
          <pre className="text-success text-sm font-mono whitespace-pre-wrap">
            {output.output}
          </pre>
        ) : (
          <div className="flex flex-col gap-2">
            {output.output && (
              <pre className="text-base-content/80 text-sm font-mono whitespace-pre-wrap">
                {output.output}
              </pre>
            )}
            <pre className="text-error text-sm font-mono whitespace-pre-wrap">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
