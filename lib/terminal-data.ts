export interface FileSystemNode {
  type: "file" | "directory";
  content?: string;
  children?: Record<string, FileSystemNode>;
}

export const fileSystem: Record<string, FileSystemNode> = {
  about: {
    type: "directory",
    children: {
      "bio.txt": {
        type: "file",
        content: `
Hi.

My name is Philippe des Boscs. I'm based in New York
City and currently work as an Associate Consultant at
Bain & Company.

I grew up across a few places. I was born in Paris,
moved to Houston, Texas at 11, then headed to Pasadena,
California for college, and eventually made my way to
New York.

I attended Caltech, where I studied Computer Science
with a specialization in machine learning, alongside
Business Economics and Management. I also completed a
minor in Information and Data Science.

I'm particularly interested in artificial intelligence
and quantitative problem solving. I enjoy tackling
complex problems across different fields, leading
projects 0 -> 1, and thinking about how data and
models can enhance decision making.
`,
      },
    },
  },
  experience: {
    type: "directory",
    children: {
      "professional.txt": {
        type: "file",
        content: `╭──────────────────────────────────────────────────────────╮
│  PROFESSIONAL EXPERIENCE                                 │
╰──────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────┐
│  Bain & Company                                          │
│  Associate Consultant · New York, NY · 2025 - Present    │
├──────────────────────────────────────────────────────────┤
│  Working on enterprise AI transformation for a F500      │
│  client including mapping AI capabilities, launching     │
│  agentic assistant pilots, defining adoption metrics,    │
│  and supporting company-wide AI-driven workflows.        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Bain & Company                                          │
│  Associate Consultant Intern · New York, NY · 2024       │
├──────────────────────────────────────────────────────────┤
│  Worked in Bain's Private Equity Group on operational    │
│  due diligence and value creation, including market      │
│  analysis, primary research, and synergy models.         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Amazon                                                  │
│  Software Engineer Intern · Austin, TX · 2023            │
├──────────────────────────────────────────────────────────┤
│  Built internal tooling and automated testing for Alexa  │
│  Low Power Mode, including data collection automation    │
│  for power analysis, cutting manual testing time by 60%. │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  NASA Jet Propulsion Laboratory                          │
│  Software Engineer Intern · La Canada, CA · 2022         │
├──────────────────────────────────────────────────────────┤
│  Worked on Synthetic Tracking for detection of           │
│  satellites, debris, and Near-Earth Objects using        │
│  image analysis, including tooling to relay real-time    │
│  telescope data and generate automated analysis reports. │
└──────────────────────────────────────────────────────────┘
`,
      },
      education: {
        type: "directory",
        children: {
          "overview.txt": {
            type: "file",
            content: `╭──────────────────────────────────────────────────────────╮
│  EDUCATION                                               │
╰──────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────┐
│  B.S. Computer Science                                   │
│  California Institute of Technology · 2021 - 2025        │
├──────────────────────────────────────────────────────────┤
│  GPA: 4.14                                               │
│  Specialization: Machine Learning                        │
│  Double Major: Business Economics and Management         │
│  Minor: Information and Data Science                     │
│                                                          │
│  Relevant Coursework: Learning Systems, Deep Learning,   │
│  Large Language and Vision Models, Algorithms, Data      │
│  Structures, Probability & Statistics, Linear Algebra,   │
│  and Econometrics                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  French Baccalaureate                                    │
│  The Awty International School · 2014 - 2021             │
├──────────────────────────────────────────────────────────┤
│  Majors: Mathematics, Physics, Chemistry, Economics      │
│  Final Grade: 19.2/20 · Highest Honors                   │
└──────────────────────────────────────────────────────────┘
`,
          },
          "coursework.txt": {
            type: "file",
            content: `╭──────────────────────────────────────────────────────────╮
│  CALTECH COURSEWORK                                      │
╰──────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────┐
│  Fall 2021                                               │
├──────────────────────────────────────────────────────────┤
│  CS 001     Introduction to Computer Programming         │
│  CS 009     Introduction to Computer Science Research    │
│  Ch 001A    General Chemistry                            │
│  Ma 001A    Calculus and Linear Algebra                  │
│  Ph 001A    Classical Mechanics and Electromagnetism     │
│  Wr 002     Introduction to Academic Writing             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Winter 2022                                             │
├──────────────────────────────────────────────────────────┤
│  CS 002     Introduction to Programming Methods          │
│  CS 021     Decidability and Tractability                │
│  Ch 001B    General Chemistry                            │
│  Ma 001B    Calculus and Linear Algebra                  │
│  Ph 001B    Classical Mechanics and Electromagnetism     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Spring 2022                                             │
├──────────────────────────────────────────────────────────┤
│  Bi 001     Principles of Biology                        │
│  CS 003     Introduction to Software Design              │
│  Hum/H 011  Demography and History of Europe             │
│  ME 110     Special Lab Work in Mechanical Engineering   │
│  Ma 001C    Calculus and Linear Algebra                  │
│  Ph 001C    Classical Mechanics and Electromagnetism     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Fall 2022                                               │
├──────────────────────────────────────────────────────────┤
│  CS 024     Introduction to Computing Systems            │
│  CS 156A    Learning Systems                             │
│  E 100      Special Topics in Engineering                │
│  Ma 002     Differential Equations                       │
│  Ma 006A    Introduction to Discrete Mathematics         │
│  PS 012     Introduction to Political Science            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Winter 2023                                             │
├──────────────────────────────────────────────────────────┤
│  CS 155     Machine Learning & Data Mining               │
│  CS 004     Fundamentals of Computer Programming         │
│  Hum 040    Right and Wrong                              │
│  Ma 003     Introduction to Probability and Statistics   │
│  PE 005     Beginning Running                            │
│  Ph 003     Introductory Physics Laboratory              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Spring 2023                                             │
├──────────────────────────────────────────────────────────┤
│  ACM 011    Intro to Computational Science               │
│  ACM 206    Monte Carlo Methods                          │
│  CS 038     Algorithms                                   │
│  Ch 003X    Experimental Methods in Solar Energy         │
│  EE 001     Science of Data, Signals, and Information    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Fall 2023                                               │
├──────────────────────────────────────────────────────────┤
│  EE 148     Large Language and Vision Models             │
│  ACM 116    Introduction to Probability Models           │
│  ACM 104    Applied Linear Algebra                       │
│  ESE 101    Earth's Atmosphere                           │
│  Ec 011     Introduction to Economics                    │
│  En 180     Contemporary American Fiction                │
│  PE 003     Hiking                                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Winter 2024                                             │
├──────────────────────────────────────────────────────────┤
│  BEM 103    Introduction to Finance                      │
│  CS 144     Networks: Structure & Economics              │
│  CS 081B    Undergraduate Projects in CS                 │
│  CS 121     Relational Databases                         │
│  Ec 109     Frontier in Behavioral Economics             │
│  SA 016B    Cooking Basics                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Spring 2024                                             │
├──────────────────────────────────────────────────────────┤
│  BEM 104    Investments                                  │
│  BEM 114    Hedge Funds                                  │
│  CS 101     Pedagogy in Computer Science                 │
│  CS 132     Web Development                              │
│  IDS 157    Statistical Inference                        │
│  PE 084     Table Tennis                                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Fall 2024                                               │
├──────────────────────────────────────────────────────────┤
│  BEM 102    Introduction to Accounting                   │
│  E 100      Learning How to Learn                        │
│  EE 111     Signal-Processing Systems and Transforms     │
│  Ec 122     Econometrics                                 │
│  H 161      Legal Culture in the Medieval Mediterranean  │
│  SEC 013    Written Communication about Engineering      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Winter 2025                                             │
├──────────────────────────────────────────────────────────┤
│  BEM 115    Business Law                                 │
│  Bi 177     Principles of Modern Microscopy              │
│  Ec 101     Markets, Politics and Growth in China        │
│  Ec 124     Identification Problems in Social Sciences   │
│  ME 133B    Robotics                                     │
│  SEC 010    Technical Seminar Presentations              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Spring 2025                                             │
├──────────────────────────────────────────────────────────┤
│  BEM 119    Environmental Economics                      │
│  BEM 106    Data Science in Economics                    │
│  ME 169     Mobile Robots                                │
│  PS 172     Game Theory                                  │
└──────────────────────────────────────────────────────────┘
`,
          },
        },
      },
      "teaching.txt": {
        type: "file",
        content: `╭──────────────────────────────────────────────────────────╮
│  TEACHING EXPERIENCE                                     │
╰──────────────────────────────────────────────────────────╯

I came into Caltech's Intro to Programming course (CS 1)
with zero prior experience. I was motivated to learn, but
lecture inconsistencies, lack of feedback, and minimal
support made much of my effort feel in vain.

After completing the course, I became a TA and eventually
Head TA for CS 1, hoping to make it the course I wish I had.

┌──────────────────────────────────────────────────────────┐
│  CS 1: Introduction to Computer Programming              │
│  California Institute of Technology                      │
├──────────────────────────────────────────────────────────┤
│  Teaching Assistant        2 terms   FA'22 - SP'23       │
│  Head Teaching Assistant   4 terms   FA'23 - SP'25       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  CS 4: Object Oriented Programming                       │
│  California Institute of Technology                      │
├──────────────────────────────────────────────────────────┤
│  Teaching Assistant        1 term    WI'24               │
│  Head Teaching Assistant   1 term    WI'25               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  CS 101: Pedagogy in Computer Science                    │
│  California Institute of Technology                      │
├──────────────────────────────────────────────────────────┤
│  Head Teaching Assistant   1 term    SP'25               │
└──────────────────────────────────────────────────────────┘


╭──────────────────────────────────────────────────────────╮
│  RESPONSIBILITIES                                        │
╰──────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────┐
│  Instruction                                             │
├──────────────────────────────────────────────────────────┤
│  - Led weekly recitation sessions                        │
│  - Conducted lab sessions for hands-on practice          │
│  - Held regular office hours for student support         │
│  - Answered student questions via email and forums       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Course Administration                                   │
├──────────────────────────────────────────────────────────┤
│  - Managed TA hiring and training process                │
│  - Coordinated grading to ensure consistency             │
│  - Handled course communications and announcements       │
│  - Designed course policies including grading rubrics    │
│  - Processed extension requests and accommodations       │
│  - Managed academic dishonesty cases                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Curriculum Development                                  │
├──────────────────────────────────────────────────────────┤
│  - Created new assignments and problem sets              │
│  - Designed exams and assessments                        │
│  - Developed recitation materials                        │
│  - Built course infrastructure and tooling               │
└──────────────────────────────────────────────────────────┘
`,
      },
      "skills.txt": {
        type: "file",
        content: `╭──────────────────────────────────────────────────────────╮
│  SKILLS                                                  │
╰──────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────┐
│  Languages                                               │
├──────────────────────────────────────────────────────────┤
│  French        Fluent                                    │
│  English       Fluent                                    │
│  German        Limited Working Proficiency               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Programming                                             │
├──────────────────────────────────────────────────────────┤
│  Python · OCaml · Java · C · TypeScript · SQL · LaTeX    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Tools                                                   │
├──────────────────────────────────────────────────────────┤
│  Git · Excel · PowerPoint · Notion · Tableau             │
└──────────────────────────────────────────────────────────┘
`,
      },
    },
  },
  contact: {
    type: "directory",
    children: {
      "links.txt": {
        type: "file",
        content: `╭──────────────────────────────────────────────────────────╮
│  CONTACT                                                 │
╰──────────────────────────────────────────────────────────╯

   Email      →  [email:philippe.desboscs@outlook.com]
   
   LinkedIn   →  [link:https://linkedin.com/in/pdesboscs]
   
   GitHub     →  [link:https://github.com/philippe-dbo]

Feel free to reach out.
`,
      },
    },
  },
  "README.md": {
    type: "file",
    content: `Navigate my personal site using terminal commands.

┌──────────────────────────────────────────────────────────┐
│  Available commands                                      │
├──────────────────────────────────────────────────────────┤
│  ls              List directory contents                 │
│  cd <dir>        Change directory                        │
│  cat <file>      Display file contents                   │
│  clear           Clear the terminal                      │
│  help            Show this help message                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Directory structure                                     │
├──────────────────────────────────────────────────────────┤
│  ~/about/        Who I am                                │
│  ~/experience/   Work history, education & skills        │
│  ~/contact/      How to reach me                         │
└──────────────────────────────────────────────────────────┘
`,
  },
};

export const WELCOME_MESSAGE = "Last login: " + new Date().toLocaleString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}) + "\n\nType 'help' to get started, or use the navigation above.";
