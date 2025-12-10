import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import NavBar from "../components/NavBar";
import ProblemDescription from "../components/ProblemDescription";
import { executeCode, LANGUAGE, type Result } from "../lib/piston";
import { PROBLEMS } from "../data/problems";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";

const ProblemPage = () => {
  const { id: problemId } = useParams();
  const navigate = useNavigate();

  const allProblems = Object.values(PROBLEMS);
  const problem = problemId
    ? PROBLEMS[problemId as keyof typeof PROBLEMS]
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState<LANGUAGE>(
    LANGUAGE.JavaScript
  );
  const initialCode = problem?.starterCode[selectedLanguage];
  const [code, setCode] = useState<string | undefined>(initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<Result | null>(null);

  // update problem when URL params changes
  // useEffect(() => {
  //   if (id && problem) {
  //     setCode(problem?.starterCode[selectedLanguage]);
  //     setOutput(null);
  //   }
  // }, [id, problem, selectedLanguage]);

  const handleProblemChange = (newProblemId: string) => {
    navigate(`/problem/${newProblemId}`);
    setCode(
      PROBLEMS[newProblemId as keyof typeof PROBLEMS].starterCode[
        selectedLanguage
      ]
    );
    setOutput(null);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LANGUAGE;
    setSelectedLanguage(newLang);
    setCode(problem?.starterCode[newLang]);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const res = await executeCode(selectedLanguage, code ?? "");

    setOutput(res);
    setIsRunning(false);

    // check if code executed successfully and matches the expected output
    if (res.success) {
      const expectedOutput = problem?.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(
        res.output ?? "",
        expectedOutput ?? ""
      );

      if (testsPassed) {
        toast.success("All tests passed! Great job!");
        triggerConfetti();
      } else {
        toast.error("Tests failed. Check your output.");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  const checkIfTestsPassed = (
    actualOutput: string,
    expectedOutput: string
  ): boolean => {
    return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
  };

  const normalizeOutput = (output: string) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ or before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ", ")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: {
        x: 0.2,
        y: 0.4,
      },
    });
    confetti({
      particleCount: 80,
      spread: 250,
      origin: {
        x: 0.8,
        y: 0.4,
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-base-300">
      <NavBar />

      {!problem && (
        <div className="flex-1 flex justify-center items-center text-error">
          Problem not found
        </div>
      )}
      {problemId && problem && (
        <div className="flex-1 h-full overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* left panel - problem desc */}
            <Panel
              defaultSize={40}
              minSize={30}
              className="bg-base-100 rounded-2xl"
            >
              <ProblemDescription
                allProblems={allProblems}
                problemId={problemId}
                problem={problem}
                onProblemChange={handleProblemChange}
              />
            </Panel>
            <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize! transition-colors duration-250 hover:bg-primary/50" />
            {/* right panel - code editor & output */}
            <Panel
              defaultSize={60}
              minSize={30}
              className="bg-base-100 rounded-2xl"
            >
              <PanelGroup direction="vertical">
                {/* top panel - code editor */}
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditor
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>
                <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize! transition-colors duration-250 hover:bg-primary/50" />
                {/* bottom panel - output panel */}
                <Panel defaultSize={30} minSize={30}>
                  <OutputPanel output={output} />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
