import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "react-router";
import CodeEditor from "../components/CodeEditor";
import NavBar from "../components/NavBar";
import OutputPanel from "../components/OutputPanel";
import ProblemDescription from "../components/ProblemDescription";
import { PROBLEMS } from "../data/problems";
import useCodeRunning from "../hooks/useCodeRunning";

const ProblemPage = () => {
  const { id: problemId } = useParams();

  const allProblems = Object.values(PROBLEMS);
  const problem = problemId
    ? PROBLEMS[problemId as keyof typeof PROBLEMS]
    : null;

  // update problem when URL params changes
  // useEffect(() => {
  //   if (id && problem) {
  //     setCode(problem?.starterCode[selectedLanguage]);
  //     setOutput(null);
  //   }
  // }, [id, problem, selectedLanguage]);

  const {
    selectedLanguage,
    code,
    isRunning,
    output,
    setCode,
    handleProblemChange,
    handleLanguageChange,
    handleRunCode,
  } = useCodeRunning(problem);

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
