import confetti from "canvas-confetti";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { PROBLEMS, type Problem } from "../data/problems";
import { executeCode, LANGUAGE, type Result } from "../lib/piston";

const useCodeRunning = (problem: Problem | null | undefined) => {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState<LANGUAGE>(
    LANGUAGE.JavaScript
  );
  const initialCode = problem?.starterCode[selectedLanguage] || "";
  const [code, setCode] = useState<string | undefined>(initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<Result | null>(null);

  const [prevProblem, setPrevProblem] = useState(problem);

  // 在渲染期间检测 problem 变化并同步 code
  if (problem !== prevProblem) {
    setPrevProblem(problem);
    setCode(problem?.starterCode[selectedLanguage] || "");
  }

  const handleProblemChange = (newProblemId: string) => {
    const newProblem = PROBLEMS[newProblemId as keyof typeof PROBLEMS];
    if (!newProblem) {
      console.error(`Problem ${newProblemId} not found`);
      return;
    }
    navigate(`/problem/${newProblemId}`);
    setCode(newProblem.starterCode[selectedLanguage]);
    setOutput(null);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LANGUAGE;
    setSelectedLanguage(newLang);
    setCode(problem?.starterCode[newLang] || "");
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
          // normalize array element quotes (only at array boundaries, not inside content)
          .replace(/\['/g, '["') // opening: [' -> ["
          .replace(/'\]/g, '"]') // closing: '] -> "]
          .replace(/', '/g, '", "') // separator: ', ' -> ", "
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

  return {
    selectedLanguage,
    code,
    isRunning,
    output,
    setCode,
    handleProblemChange,
    handleLanguageChange,
    handleRunCode,
  };
};

export default useCodeRunning;
