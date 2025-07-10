'use client'
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import FixedText from '@/components/ui/FixedText'
import { useState, useEffect } from "react";
import { LineChart,  ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from "recharts";
import { Octokit } from '@octokit/rest';

interface WeeklyCommit {
  total: number;
  week: number;
}

interface RepoStat {
  repo: string;
  commits?: WeeklyCommit[];
}

interface MonthlyCommit {
  month: string;
  commits: number;
}



export default function Home() {
  const [progress, setProgress] = useState(0);
  const [monthlyCommits, setMonthlyCommits] = useState<MonthlyCommit[]>([]);
  
  const [totalCommits, setTotalCommits] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      if (scrollPercentage > 5) {
        setProgress(Math.min(scrollPercentage, 100));
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize progress on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchGithubData = async () => {
      // Check if we've already fetched data in this session
      const hasLoaded = localStorage.getItem('githubDataLoaded');
      if (hasLoaded) {
        const cachedMonthly = JSON.parse(localStorage.getItem('monthlyCommits') || '[]');
        const cachedTotal = JSON.parse(localStorage.getItem('totalCommits') || '0');
        setMonthlyCommits(cachedMonthly);
        setTotalCommits(cachedTotal);
        return;
      }

      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
      });

      try {
        // Get user's repositories
        const { data: repos } = await octokit.repos.listForUser({
          username: 'aboussenane',
          per_page: 100
        });

        // Get commit data for each repository
        const repoStats = await Promise.all(
          repos.map(async (repo) => {
            const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
              owner: 'aboussenane',
              repo: repo.name,
              per_page: 1000,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28'
              }
            });
            
            return { 
              repo: repo.name, 
              commits: commits.map(commit => ({
                total: 1,
                week: new Date(commit.commit.author?.date || '').getTime()
              }))
            };
          })
        );

        const monthly = processMonthlyCommits(repoStats as RepoStat[]);
        
        const total = calculateTotalCommits(repoStats as RepoStat[]);
        console.log(monthly)
        
        console.log(total)
        
        // Cache the results
        localStorage.setItem('githubDataLoaded', 'true');
        localStorage.setItem('monthlyCommits', JSON.stringify(monthly));
        localStorage.setItem('totalCommits', JSON.stringify(total));
        
        setMonthlyCommits(monthly);
        setTotalCommits(total);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      }
    };

    fetchGithubData();
  }, []);

  const projects = [
    {
      title: "I H8 PDFs",
      description:
        "A full stack application that allows users to upload a fillable (acroforms) PDF and fill it with AI. I'm currently working on addding static PDF functionality.",
      techStack: ["React", "Typescript", "NodeJS", "Express", "PostgreSQL"  ],
      url: "https://ih8pdfs.com/",
      imageUrl: "/ih8pdfs.PNG",
      alt: "AI PDF Filler",
    },
    {
      title: "Armoury",
      description:
        "A full stack CRUD application that allows users to create, view, and manage inventory, as well as make equipmentreservations.",
      techStack: ["React", "Typescript", "NodeJS", "Express", "PostgreSQL"],
      url: "https://armoury-next.vercel.app/",
      imageUrl: "/equipment.PNG",
      alt: "Asset Management System",
    },

    {
      title: "Webpage to PDF",
      description:
        "A webpage to PDF chrome extension that allows users to convert web pages to PDF documents.",
      techStack: ["React", "Typescript", "WXT"],
      url: "https://github.com/aboussenane/pdf-r",
      imageUrl: "/webpage-to-PDF.png",
      alt: "Chrome extension",
    },
    
    {
      title: "Document Generator",
      description:
        "A nodeJS electron app which accesses data from a CRM app and use it to create folders and autofill documents. Saved hours in collective time by automating simple repetitive tasks.",
      techStack: ["Javascript", "Node.JS"],
      url: "https://github.com/aboussenane/PipedriveDocGenerator",
      imageUrl: "/docGen.PNG",
      alt: "NodeJS Electron App",
    },
 
  ];
  const experience = [
    {
      title: "BKL Consultants",
      duration: "June 2022 - Present",
      description:
        "Created various scripts to perform file management, large data migrations and data reporting. Managed software license, equipment calibration and maintenance schedules. Utilized REST APIs to ease migration of large data sets and automate workflows. Creating comprehensive operating procedures for equipment and softwares. Implemented custom FTP client to transfer noise data from legacy systems. Back engineered montioring equipment to manage via http requests which led to increased uptime and reduced maintenance costs.",
      techStack: ["Python", "Node.JS", "Javascript", "Shell Scripting", "Powershell"],
      imageUrl: "/",
      alt: "IT Coordinator",
    },
    {
      title: "Kiuloper",
      duration: "January 2024 - June 2024",
      description:
        "Implemented business critical features to a food delivery application. Solved problems in an Agile development environment. Solved invoicing database issues when handling orders with multiple vendors, created front end user interface for logging in and registering users, developed functions for precise shipping calculations. Refined address validation to ensure service quality.",
      techStack: ["PHP", "MYSQL", "Javascript", "HTML", "CSS", "JQuery"],
      imageUrl: "/inwitFeedback.PNG",
      alt: "Web Developer Intern",
    },

    {
      title: "Ubineer",
      duration: "September 2023 - May 2024",
      description:
        "Created regex patterns to efficiently capture past and future natural language data. Utilized clean code principles which resulted in robust patterns which were utilized in production and LLM training. Took on a leadership role in which I helped to train the next round of interns.",
      techStack: ["Python", "Regex"],
      imageUrl: "/ubineerFeedback.PNG",
      alt: "NLP/Regex Intern",
    },
  ];
  const testimonial = [
    {
      name: "Mohammad Tahvili - Kiuloper",
      description:
        "Great work with high quality designs that match perfectly with the UX files."
    },
    {
      name: "Andi Kerenxhi - Ubineer",
      description:
        "Did great work expecially picking up the stack.",
    },

  ];
  return (
    <main className="flex flex-col overflow-x-hidden snap-y snap-mandatory overflow-y-scroll">
        <div className="fixed top-[0px] left-0 w-full h-fullflex justify-center z-50">
          <div className="relative w-full flex justify-center">
            <div 
              className="h-[5px] bg-black transition-all duration-500 ease-in-out origin-center"
              style={{ 
                width: `${progress}%`,
                maxWidth: '100%',
                position: 'absolute',
                left: '50%',
                transform: `translateX(-50%) scaleX(${progress / 100})`
              }}
            />
          </div>
          
        </div>
      {/* title */}
      <section className="snap-start mb-10 overflow-x-hidden overflow-y-hidden">
      <div className="absolute top-0 left-0 w-full h-screen bg-black/30 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 h-screen w-screen object-cover z-0 "
          src="/rain-video.mp4"
        />
        <div className="h-screen w-screen flex-col lg:flex-row-reverse flex ">
          {/* <div className="overflow-hidden md:h-2/3 lg:w-1/2 lg:h-[100vh] z-20 ">
            <AspectRatio
              ratio={4/3} 
            >
              <Image
                src="/ab-avatar.JPG"
                alt="me"
                fill
                className="object-cover"
              />
            </AspectRatio>
          </div> */}
          <div className="relative flex-1 w-full  ">
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black/0 md:bg-black/30 lg:bg-black/0 z-30  "></div> */}
            <FixedText>
              <h3 className="text-7xl sm:text-9xl font-extrabold break-words text-white">
                Hi, I&apos;m Adel, a 29 year old software developer
              </h3>
            </FixedText>
          </div>
        </div>
      </section>
      {/* site content */}
      <div className="flex flex-col w-screen h-full snap-y snap-mandatory overflow-x-hidden scrollbar-hide z-50">
        {/* about */}
        <section className=" w-full h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10">
          <div className="flex flex-col gap-2 mb-4">
            <h5 className="text-xl  font-bold break-words max-w-[90vw] md:max-w-[70vw]">
              Myself
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <p className="text-5xl font-bold break-words max-w-[90vw] md:max-w-[70vw]">
              I&apos;m a software developer with a passion for building web applications. I&apos;m currently working as an IT Coordinator at BKL Consultants.
            </p>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <h5 className="text-xl font-bold break-words max-w-[90vw] md:max-w-[70vw]">
              Technologies
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <p className="text-2xl font-regular break-words max-w-[90vw] md:max-w-[70vw] italic">
              Javascript / Typescript / React / NextJS / NodeJS / Python /
              PostgreSQL / SQL / Vercel / Framer-Motion / TailwindCSS / Shadcn /
              ChakraUI / Git / Linux / Powershell / PHP
            </p>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <h5 className="text-xl font-bold break-words max-w-[90vw] md:max-w-[70vw]">
              Contact
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <p className="text-2xl font-regular break-words max-w-[90vw] md:max-w-[70vw]">
              <a href="mailto:aboussenane@gmail.com">aboussenane@gmail.com</a>
            </p>
          </div>
        </section>
        
          {/* projects */}
          <section className="flex flex-col h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10">
            <h5 className="text-xl font-extrabold break-words max-w-[90vw] md:max-w-[70vw]">
              Projects
            </h5>
            <Accordion type="single" collapsible>
              {projects.map((project, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="group relative overflow-hidden text-3xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl font-bold break-words hover:text-white hover:bg-black hover:cursor-pointer transition-all duration-350 ease-in-out">
                    <span className="inline-block transition-transform translate-y-0 duration-300 ease-in-out group-hover:text-black group-hover:opacity-0">
                      {project.title}
                    </span>
                    <span className="absolute text-3xl sm:text-5xl top-full left-0 inline-block transition-transform duration-200 ease-in-out group-hover:-translate-y-[150%] group-hover:-translate-x-[-30px] group-hover:hover:scale-105">
                      {project.alt}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col mt-2 justify-left items-center sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-4">
                      <div className="relative w-[250px] sm:w-[250px] md:w-[250px] lg:w-[250px] xl:w-[250px] h-[250px] sm:h-[250px] md:h-[250px] lg:h-[250px] xl:h-[250px] flex-shrink-0">
                        <Link href={project.url}>
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="border-2 border-black object-cover rounded-md"
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col gap-4">
                        <p className="text-xl font-regular break-words max-w-[90vw] md:max-w-[70vw]">
                          {project.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {project.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 rounded-md text-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          {/* experience */}
          <section className="flex flex-col h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10 ">
            <h5 className="text-xl font-extrabold break-words max-w-[90vw] md:max-w-[70vw]">
              Experience
            </h5>
            <Accordion type="single" collapsible>
              {experience.map((exp, index) => (
                <AccordionItem key={index} value={`exp-${index}`}>
                  <AccordionTrigger className="group relative overflow-hidden text-3xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl font-bold break-words hover:text-white hover:bg-black hover:cursor-pointer transition-all duration-350 ease-in-out">
                    <span className="inline-block transition-transform translate-y-0 duration-300 ease-in-out group-hover:text-black group-hover:opacity-0">
                      {exp.title}
                    </span>
                    <span className="absolute top-full text-3xl sm:text-5xl left-0 inline-block transition-transform duration-200 ease-in-out group-hover:-translate-y-[150%] group-hover:-translate-x-[-30px] group-hover:hover:scale-105">
                      {exp.alt}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col mt-2 justify-left items-center sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-4">
                      
                      <div className="flex flex-col gap-4">
                        <p className="text-xl font-regular break-words max-w-[90vw] md:max-w-[70vw]">
                          {exp.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {exp.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 rounded-md text-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          {/* testimonials */}
          <section className="flex flex-col h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10 ">
            <h5 className="text-xl font-extrabold break-words max-w-[90vw] md:max-w-[70vw]">
              Testimonials
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <div className="flex flex-col gap-4 justify-center items-center mt-10">
              {testimonial.map((testimonial, index) => (
                <div key={index} className="flex flex-col gap-4 mb-4 w-[90vw] md:max-w-[70vw]">
                  <p className="text-xl font-regular break-words max-w-[90vw] md:max-w-[70vw]">
                    &quot;{testimonial.description}&quot;
                  </p>
                  <p className="text-xl font-regular break-words max-w-[90vw] md:max-w-[70vw]">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
          {/* Github */}
          <section className="flex flex-col h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10 ">
            <h5 className="text-xl font-extrabold break-words max-w-[90vw] md:max-w-[70vw]">
              Github Stats
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 place-items-center">
              {/* Monthly Commits Line Chart */}
              <div className="w-full h-[300px] mb-4 justify-left">
                <h6 className="text-lg font-semibold mb-4 text-center">Last Year&apos;s Commits per Month</h6>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyCommits}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="commits" stroke="#000000" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Total Commits Card */}
              <div className="w-[300px] h-[300px] p-6 bg-black text-white rounded-lg flex flex-col items-center justify-center">
                <h6 className="text-lg font-semibold mb-2">Total Commits Last Year</h6>
                <p className="text-4xl font-bold">{totalCommits}</p>
              </div>
            </div>
          </section>
          {/* interests */}
          <section className="flex flex-col h-full snap-start mx-[10px] sm:mx-[20px] md:mx-[2vw] lg:mx-[2vw] xl:mx-[10vw] mb-10 ">
            <h5 className="text-xl font-extrabold break-words max-w-[90vw] md:max-w-[70vw]">
              Interests
            </h5>
            <Separator className="w-[90vw] md:max-w-[70vw]" />
            <div className="flex flex-col gap-4 justify-center items-center">
              <p className="text-xl font-regular break-words max-w-[90vw] md:max-w-[70vw] italic">
                Martial Arts / Music / Travel / Food / Gaming
              </p>
              <Image
                src="https://media.giphy.com/media/DdScANHfXnsM0uoiwV/giphy.gif?cid=ecf05e47itnniw3ea2z5useeyeqg48nz705amo916tg1458n&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Interests gif"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          </section>
        
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center pt-10">
        
        <div>
          <p>© 2025 Adel Boussenane</p>
        </div>
        <div>
          <p>
            <a href="mailto:aboussenane@gmail.com">aboussenane@gmail.com</a>
          </p>
        </div>
        <div>
          <p>
            <a href="https://github.com/aboussenane">GitHub</a>
          </p>
        </div>
        <div>
          <p>
            <a href="https://www.linkedin.com/in/adel-boussenane-28545317a/">
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

const processMonthlyCommits = (repoStats: RepoStat[]) => {
  const months = Array(12).fill(0);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  repoStats.forEach(repo => {
    if (repo.commits && Array.isArray(repo.commits)) {
      repo.commits.forEach((commit: WeeklyCommit) => {
        if (commit && typeof commit.week === 'number') {
          const date = new Date(commit.week);
          const monthIndex = date.getMonth();
          months[monthIndex] += commit.total;
        }
      });
    }
  });

  return monthNames.map((month, index) => ({
    month,
    commits: Math.round(months[index])
  }));
};

const calculateTotalCommits = (repoStats: RepoStat[]) => {
  return repoStats.reduce((total: number, repo: RepoStat) => {
    if (!repo.commits) return total;
    return total + repo.commits.reduce((sum: number, week: WeeklyCommit) => sum + (week.total || 0), 0);
  }, 0);
};
