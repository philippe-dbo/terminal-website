"use client";

import React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  fileSystem,
  WELCOME_MESSAGE,
  type FileSystemNode,
} from "@/lib/terminal-data";

interface HistoryEntry {
  command: string;
  output: string;
  path: string[];
  isError?: boolean;
  isAnimating?: boolean;
}

// Parse text and render clickable links
function parseLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Match [email:...] and [link:...]
  const regex = /\[(email|link):([^\]]+)\]/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    const type = match[1];
    const value = match[2];
    
    if (type === "email") {
      parts.push(
        <a
          key={match.index}
          href={`mailto:${value}`}
          className="text-[color:var(--terminal-prompt)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      );
    } else if (type === "link") {
      // Display without https://
      const displayUrl = value.replace(/^https?:\/\//, "");
      parts.push(
        <a
          key={match.index}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--terminal-prompt)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {displayUrl}
        </a>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
}

// Intro screen component with dive-in transition
function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isDiving, setIsDiving] = useState(false);

  const introLine1 = "Welcome to my personal website";
  const introLine2 = "Navigate like a terminal";
  const introLine3 = "Type 'help' to see available commands";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;
    let currentLine = 1;

    const typeCharacter = () => {
      if (currentLine === 1) {
        if (charIndex < introLine1.length) {
          setLine1(introLine1.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeCharacter, 40);
        } else {
          charIndex = 0;
          currentLine = 2;
          timeout = setTimeout(typeCharacter, 300);
        }
      } else if (currentLine === 2) {
        if (charIndex < introLine2.length) {
          setLine2(introLine2.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeCharacter, 40);
        } else {
          charIndex = 0;
          currentLine = 3;
          timeout = setTimeout(typeCharacter, 300);
        }
      } else if (currentLine === 3) {
        if (charIndex < introLine3.length) {
          setLine3(introLine3.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeCharacter, 40);
        } else {
          // Typing complete, wait then dive
          timeout = setTimeout(() => {
            setShowCursor(false);
            setIsDiving(true);
            setTimeout(onComplete, 800);
          }, 1000);
        }
      }
    };

    timeout = setTimeout(typeCharacter, 500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-all duration-700 ease-in-out ${
        isDiving ? "scale-150 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="font-mono text-center space-y-3 md:space-y-4 px-4 md:px-6">
        <div className="text-xl sm:text-2xl md:text-4xl text-[color:var(--terminal-prompt)] font-bold">
          {line1}
          {line1.length < introLine1.length && showCursor && (
            <span className="animate-blink">_</span>
          )}
        </div>
        <div className="text-base sm:text-lg md:text-2xl text-foreground/80">
          {line2}
          {line1.length === introLine1.length &&
            line2.length < introLine2.length &&
            showCursor && <span className="animate-blink">_</span>}
        </div>
        <div className="text-sm sm:text-base md:text-xl text-muted-foreground">
          {line3}
          {line2.length === introLine2.length && showCursor && (
            <span className="animate-blink">_</span>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 md:bottom-8 text-muted-foreground/50 font-mono text-xs md:text-sm animate-pulse">
        {line3.length === introLine3.length && "Entering terminal..."}
      </div>
    </div>
  );
}

// Split text into boxes and non-box segments
function splitIntoBoxes(text: string): string[] {
  const segments: string[] = [];
  const lines = text.split('\n');
  let currentSegment: string[] = [];
  let inBox = false;
  
  for (const line of lines) {
    const isBoxStart = line.includes('╭') || line.includes('┌');
    const isBoxEnd = line.includes('╯') || line.includes('┘');
    
    if (isBoxStart && !inBox) {
      // Save any preceding non-box content
      if (currentSegment.length > 0) {
        const content = currentSegment.join('\n');
        if (content.trim()) {
          segments.push(content);
        }
        currentSegment = [];
      }
      inBox = true;
    }
    
    currentSegment.push(line);
    
    if (isBoxEnd && inBox) {
      segments.push(currentSegment.join('\n'));
      currentSegment = [];
      inBox = false;
    }
  }
  
  // Don't forget remaining content
  if (currentSegment.length > 0) {
    const content = currentSegment.join('\n');
    if (content.trim()) {
      segments.push(content);
    }
  }
  
  return segments;
}

// Box-by-box animated text component
function BoxByBoxText({
  text,
  onComplete,
  isError,
}: {
  text: string;
  onComplete: () => void;
  isError?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const segments = splitIntoBoxes(text);
  
  useEffect(() => {
    if (!text || segments.length === 0) {
      onComplete();
      return;
    }
    
    // Show first segment immediately
    setVisibleCount(1);
    
    if (segments.length === 1) {
      setTimeout(onComplete, 150);
      return;
    }
    
    // Show remaining segments with 500ms delay
    let count = 1;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      
      if (count >= segments.length) {
        clearInterval(interval);
        setTimeout(onComplete, 150);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [text, segments.length, onComplete]);
  
  return (
    <pre
      className={`terminal-text whitespace-pre mt-1 md:mt-2 text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto hide-scrollbar ${
        isError ? "text-[color:var(--terminal-error)]" : "text-foreground/90"
      }`}
    >
      {segments.slice(0, visibleCount).map((segment, index) => (
        <span
          key={index}
          className="box-fade-in block"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {parseLinks(segment)}
          {index < visibleCount - 1 ? '\n' : ''}
        </span>
      ))}
    </pre>
  );
}

// Typewriter component for animated text output (used for short/non-box content)
function TypewriterText({
  text,
  onComplete,
  isError,
}: {
  text: string;
  onComplete: () => void;
  isError?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  // Check if text contains boxes
  const hasBoxes = text.includes('╭') || text.includes('┌');

  useEffect(() => {
    if (!text) {
      setIsComplete(true);
      onComplete();
      return;
    }
    
    // If has boxes, skip typewriter (BoxByBoxText will be used instead)
    if (hasBoxes) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let index = 0;
    const speed = Math.max(1, 50 / text.length); // 3x faster - min 1ms

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, onComplete, hasBoxes]);
  
  // Use BoxByBoxText for content with boxes
  if (hasBoxes) {
    return (
      <BoxByBoxText
        text={text}
        onComplete={onComplete}
        isError={isError}
      />
    );
  }

  return (
    <pre
      className={`terminal-text whitespace-pre mt-1 md:mt-2 text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto hide-scrollbar ${
        isError ? "text-[color:var(--terminal-error)]" : "text-foreground/90"
      }`}
    >
      {parseLinks(displayedText)}
      {!isComplete && <span className="animate-blink">_</span>}
    </pre>
  );
}

export function Terminal() {
  const [showIntro, setShowIntro] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [welcomeDisplayed, setWelcomeDisplayed] = useState("");
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    // Focus input after intro animation completes
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Animate welcome message on mount
  useEffect(() => {
    let index = 0;
    const speed = Math.max(3, 400 / WELCOME_MESSAGE.length);

    const interval = setInterval(() => {
      if (index < WELCOME_MESSAGE.length) {
        setWelcomeDisplayed(WELCOME_MESSAGE.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setWelcomeComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  const getPrompt = useCallback((path: string[]) => {
    const pathStr = path.length === 0 ? "~" : `~/${path.join("/")}`;
    return { user: "guest", host: "philippe-dbo", path: pathStr };
  }, []);

  const getCurrentDirectory = useCallback(():
    | Record<string, FileSystemNode>
    | null => {
    if (currentPath.length === 0) return fileSystem;

    let current: FileSystemNode | Record<string, FileSystemNode> = fileSystem;
    for (const segment of currentPath) {
      if (typeof current === "object" && "children" in current && current.children) {
        current = current.children;
      }
      if (typeof current === "object" && segment in current) {
        const node: FileSystemNode = (current as Record<string, FileSystemNode>)[segment];
        if (node.type === "directory" && node.children) {
          current = node.children;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    return current as Record<string, FileSystemNode>;
  }, [currentPath]);

  const executeCommand = useCallback(
    (input: string): { output: string; isError?: boolean } => {
      const trimmed = input.trim();
      if (!trimmed) return { output: "" };

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case "help":
        case "?": {
          const helpNode = fileSystem["README.md"];
          return { output: helpNode?.content || "Help not available" };
        }

        case "ls": {
          const dir = getCurrentDirectory();
          if (!dir) return { output: "ls: cannot access directory", isError: true };

          const items = Object.entries(dir).map(([name, node]) => {
            if (node.type === "directory") {
              return `${name}/`;
            }
            return name;
          });
          return { output: items.join("    ") };
        }

        case "cd": {
          if (args.length === 0 || args[0] === "~") {
            setCurrentPath([]);
            return { output: "" };
          }

          const target = args[0];

          if (target === "..") {
            if (currentPath.length > 0) {
              setCurrentPath((prev) => prev.slice(0, -1));
            }
            return { output: "" };
          }

          if (target === ".") {
            return { output: "" };
          }

          if (target.startsWith("~/")) {
            const pathParts = target.slice(2).split("/").filter(Boolean);
            let current: Record<string, FileSystemNode> | null = fileSystem;

            for (const part of pathParts) {
              if (!current || !(part in current)) {
                return { output: `cd: ${target}: No such directory`, isError: true };
              }
              const node: FileSystemNode = current[part];
              if (node.type !== "directory") {
                return { output: `cd: ${target}: Not a directory`, isError: true };
              }
              current = node.children || null;
            }

            setCurrentPath(pathParts);
            return { output: "" };
          }

          const dir = getCurrentDirectory();
          if (!dir || !(target in dir)) {
            return { output: `cd: ${target}: No such directory`, isError: true };
          }

          const node = dir[target];
          if (node.type !== "directory") {
            return { output: `cd: ${target}: Not a directory`, isError: true };
          }

          setCurrentPath((prev) => [...prev, target]);
          return { output: "" };
        }

        case "cat": {
          if (args.length === 0) {
            return { output: "cat: missing file operand", isError: true };
          }

          const filename = args[0];

          if (filename.startsWith("~/")) {
            const pathParts = filename.slice(2).split("/");
            const file = pathParts.pop();
            let current: Record<string, FileSystemNode> | null = fileSystem;

            for (const part of pathParts) {
              if (!current || !(part in current)) {
                return { output: `cat: ${filename}: No such file`, isError: true };
              }
              const node: FileSystemNode = current[part];
              if (node.type !== "directory" || !node.children) {
                return { output: `cat: ${filename}: No such file`, isError: true };
              }
              current = node.children;
            }

            if (!current || !file || !(file in current)) {
              return { output: `cat: ${filename}: No such file`, isError: true };
            }

            const node: FileSystemNode = current[file];
            if (node.type !== "file") {
              return { output: `cat: ${filename}: Is a directory`, isError: true };
            }

            return { output: node.content || "" };
          }

          const dir = getCurrentDirectory();
          if (!dir || !(filename in dir)) {
            return { output: `cat: ${filename}: No such file`, isError: true };
          }

          const node: FileSystemNode = dir[filename];
          if (node.type !== "file") {
            return { output: `cat: ${filename}: Is a directory`, isError: true };
          }

          return { output: node.content || "" };
        }

        case "pwd": {
          const path =
            currentPath.length === 0
              ? "/home/guest"
              : `/home/guest/${currentPath.join("/")}`;
          return { output: path };
        }

        case "clear": {
          setHistory([]);
          return { output: "__CLEAR__" };
        }

        case "whoami": {
          return { output: "guest" };
        }

        case "echo": {
          return { output: args.join(" ") };
        }

        case "date": {
          return { output: new Date().toString() };
        }



        case "tree": {
          const buildTree = (
            nodes: Record<string, FileSystemNode>,
            prefix: string = ""
          ): string => {
            const entries = Object.entries(nodes);
            return entries
              .map(([name, node], index) => {
                const isLast = index === entries.length - 1;
                const connector = isLast ? "└── " : "├── ";
                const childPrefix = isLast ? "    " : "│   ";

                if (node.type === "directory" && node.children) {
                  return `${prefix}${connector}${name}/\n${buildTree(node.children, prefix + childPrefix)}`;
                }
                return `${prefix}${connector}${name}`;
              })
              .join("\n");
          };

          const dir = getCurrentDirectory();
          if (!dir) return { output: ".", isError: false };
          return { output: ".\n" + buildTree(dir) };
        }

        default: {
          return {
            output: `command not found: ${cmd}\nType 'help' for available commands.`,
            isError: true,
          };
        }
      }
    },
    [currentPath, getCurrentDirectory]
  );

  const handleAnimationComplete = useCallback((index: number) => {
    setHistory((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, isAnimating: false } : entry
      )
    );
    setIsAnimating(false);
    // Re-focus input after animation completes
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, []);

  // Run a command from the navigation bar
  const runNavCommand = useCallback(
    (command: string) => {
      if (isAnimating) return;
      
      // Clear history and run the command
      setHistory([]);
      
      const { output, isError } = executeCommand(command);
      
      if (output !== "__CLEAR__") {
        const shouldAnimate = output.length > 0;
        setHistory([
          {
            command,
            output,
            path: [...currentPath],
            isError,
            isAnimating: shouldAnimate,
          },
        ]);
        if (shouldAnimate) {
          setIsAnimating(true);
        }
      }
      
      setCommandHistory((prev) => [...prev, command]);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    },
    [currentPath, executeCommand, isAnimating]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (isAnimating) return; // Don't allow new commands while animating

      const { output, isError } = executeCommand(currentInput);

      if (output !== "__CLEAR__") {
        const shouldAnimate = output.length > 0;
        setHistory((prev) => [
          ...prev,
          {
            command: currentInput,
            output,
            path: [...currentPath],
            isError,
            isAnimating: shouldAnimate,
          },
        ]);
        if (shouldAnimate) {
          setIsAnimating(true);
        }
      }

      if (currentInput.trim()) {
        setCommandHistory((prev) => [...prev, currentInput]);
      }

      setCurrentInput("");
      setHistoryIndex(-1);
      setCursorPosition(0);
      
      // Keep focus on input after command execution
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    },
    [currentInput, currentPath, executeCommand, isAnimating]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          const cmd = commandHistory[newIndex];
          setCurrentInput(cmd);
          setCursorPosition(cmd.length);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput("");
            setCursorPosition(0);
          } else {
            setHistoryIndex(newIndex);
            const cmd = commandHistory[newIndex];
            setCurrentInput(cmd);
            setCursorPosition(cmd.length);
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const dir = getCurrentDirectory();
        if (dir && currentInput) {
          const parts = currentInput.split(/\s+/);
          const lastPart = parts[parts.length - 1];
          const matches = Object.keys(dir).filter((name) =>
            name.toLowerCase().startsWith(lastPart.toLowerCase())
          );
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            const newInput = parts.join(" ");
            setCurrentInput(newInput);
            setCursorPosition(newInput.length);
          }
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCursorPosition((prev) => Math.max(0, prev - 1));
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(
              cursorPosition - 1,
              cursorPosition - 1
            );
          }
        }, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCursorPosition((prev) => Math.min(currentInput.length, prev + 1));
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(
              cursorPosition + 1,
              cursorPosition + 1
            );
          }
        }, 0);
      }
    },
    [
      commandHistory,
      historyIndex,
      currentInput,
      getCurrentDirectory,
      cursorPosition,
    ]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const newPosition = e.target.selectionStart ?? newValue.length;
      setCurrentInput(newValue);
      setCursorPosition(newPosition);
    },
    []
  );

  const handleInputClick = useCallback(() => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart ?? currentInput.length);
    }
  }, [currentInput.length]);

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, welcomeDisplayed]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const prompt = getPrompt(currentPath);

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      <div
        className={`h-screen w-full bg-background flex flex-col cursor-text transition-opacity duration-500 ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleTerminalClick}
      >
        {/* Navigation bar */}
        <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 border-b border-border/30 shrink-0">
          <span className="text-muted-foreground font-mono text-xs md:text-sm tracking-wide hidden sm:block">
            Philippe des Boscs
          </span>
          <nav className="flex items-center gap-1 sm:gap-4 font-mono text-xs md:text-sm w-full sm:w-auto justify-center sm:justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runNavCommand("cat ~/about/bio.txt");
              }}
              className="px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded transition-colors"
            >
              About
            </button>
            
            {/* Career dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded transition-colors flex items-center gap-1"
              >
                Career
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-background border border-border/50 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 min-w-[160px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    runNavCommand("cat ~/experience/professional.txt");
                  }}
                  className="block w-full text-left px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    runNavCommand("cat ~/experience/teaching.txt");
                  }}
                  className="block w-full text-left px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                >
                  Teaching
                </button>
              </div>
            </div>
            
            {/* Education dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded transition-colors flex items-center gap-1"
              >
                Education
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-background border border-border/50 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 min-w-[160px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    runNavCommand("cat ~/experience/education/overview.txt");
                  }}
                  className="block w-full text-left px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    runNavCommand("cat ~/experience/education/coursework.txt");
                  }}
                  className="block w-full text-left px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                >
                  Coursework
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runNavCommand("cat ~/experience/skills.txt");
              }}
              className="px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded transition-colors"
            >
              Skills
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runNavCommand("cat ~/contact/links.txt");
              }}
              className="px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Scrollable content - input at top, pushed down by history */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-6 font-mono hide-scrollbar">
          {/* Welcome message with typewriter effect */}
          <pre className="text-muted-foreground whitespace-pre-wrap mb-4 md:mb-6 font-mono text-xs sm:text-sm md:text-base leading-relaxed">
            {welcomeDisplayed}
            {!welcomeComplete && <span className="animate-blink">_</span>}
          </pre>

          {/* Command history */}
          {history.map((entry, index) => {
            const historyPrompt = getPrompt(entry.path);
            return (
              <div key={index} className="mb-3 md:mb-4">
                <div className="flex items-start gap-0 flex-wrap font-mono text-xs sm:text-sm md:text-base">
                  <span className="text-[color:var(--terminal-prompt)] font-semibold hidden sm:inline">
                    {historyPrompt.user}@{historyPrompt.host}
                  </span>
                  <span className="text-[color:var(--terminal-prompt)] font-semibold sm:hidden">
                    ~
                  </span>
                  <span className="text-foreground font-semibold hidden sm:inline">:</span>
                  <span className="text-[color:var(--terminal-path)] font-semibold hidden sm:inline">
                    {historyPrompt.path}
                  </span>
                  <span className="text-foreground font-semibold">$ </span>
                  <span className="text-foreground break-all">{entry.command}</span>
                </div>
                {entry.output &&
                  (entry.isAnimating ? (
                    <TypewriterText
                      text={entry.output}
                      isError={entry.isError}
                      onComplete={() => handleAnimationComplete(index)}
                    />
                  ) : (
                    <pre
                      className={`terminal-text whitespace-pre mt-1 md:mt-2 text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto hide-scrollbar ${
                        entry.isError
                          ? "text-[color:var(--terminal-error)]"
                          : "text-foreground/90"
                      }`}
                    >
                      {parseLinks(entry.output)}
                    </pre>
                  ))}
              </div>
            );
          })}

          {/* Current input line */}
          <form
            onSubmit={handleSubmit}
            className="flex items-start gap-0 flex-wrap font-mono text-xs sm:text-sm md:text-base"
          >
            <span className="text-[color:var(--terminal-prompt)] font-semibold hidden sm:inline">
              {prompt.user}@{prompt.host}
            </span>
            <span className="text-[color:var(--terminal-prompt)] font-semibold sm:hidden">
              ~
            </span>
            <span className="text-foreground font-semibold hidden sm:inline">:</span>
            <span className="text-[color:var(--terminal-path)] font-semibold hidden sm:inline">
              {prompt.path}
            </span>
            <span className="text-foreground font-semibold">$ </span>
            <div className="relative flex-1 min-w-[100px] sm:min-w-[200px]">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                disabled={isAnimating}
                className="w-full bg-transparent outline-none text-transparent caret-transparent selection:bg-foreground/30 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
              {/* Text with block cursor overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center whitespace-pre">
                <span className="text-foreground">
                  {currentInput.slice(0, cursorPosition).replace(/ /g, "\u00A0")}
                </span>
                <span className="bg-foreground text-background animate-blink inline-block min-w-[0.5em] sm:min-w-[0.6em]">
                  {currentInput[cursorPosition] === " " ? "\u00A0" : (currentInput[cursorPosition] || "\u00A0")}
                </span>
                <span className="text-foreground">
                  {currentInput.slice(cursorPosition + 1).replace(/ /g, "\u00A0")}
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
