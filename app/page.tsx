"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Users, Trophy, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [triviaDone, setTriviaDone] = useState(false);

  useEffect(() => {
    const hasCompletedTrivia = localStorage.getItem("hasCompletedTrivia");
    if (hasCompletedTrivia) {
      setTriviaDone(true);
    }
  }, []);

  console.log(gender);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
      try {
        // Store email in localStorage for now
        localStorage.setItem("triviaUserEmail", email);
        localStorage.setItem("triviaUserGender", gender);
        await router.push("/trivia");
      } catch (error) {
        console.error("Navigation error:", error);
        setIsLoading(false);
      }
    }
  };

  const rules = [
    {
      icon: Clock,
      title: "Time Challenge",
      description:
        "You have exactly 2 minutes to answer all questions. Think fast!",
    },
    {
      icon: Users,
      title: "Multiple Choice",
      description:
        "Each question has 4 possible answers. Choose the one you think is correct.",
    },
    {
      icon: Zap,
      title: "No Going Back",
      description:
        "Once you select an answer, you cannot change it. Make your choice count!",
    },
    {
      icon: Trophy,
      title: "Submit to Win",
      description:
        "Answer all questions and submit before time runs out to see your score.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-black text-5xl md:text-6xl text-primary mb-4">
            Beginner Bytes Trivia
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with our exciting trivia game. Test your
            knowledge, race against time, and see how much you really know!
          </p>
        </div>

        {/* Email Signup Section */}
        <Card className="max-w-md mx-auto border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl text-primary">
              Ready to Play?
            </CardTitle>
            <CardDescription className="font-body">
              Enter your email to get started with the trivia challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            {triviaDone ? (
              <div className=" items-center text-center space-y-2">
                <h1 className=" font-bold text-2xl text-primary">
                  You have Completed your Trivia Challenge!
                </h1>
                <p className=" text-sm">
                  Please wait for the final scores to be processed and the
                  winner announced :).
                </p>
              </div>
            ) : (
              <form onSubmit={handleGetStarted} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="font-body text-base h-12 border-border focus:border-primary focus:ring-primary/20"
                />
                <Select onValueChange={setGender}>
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className=" w-full">
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 font-heading font-semibold text-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Starting Quiz...
                    </div>
                  ) : (
                    "Start Quiz Challenge"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <br />

        {/* Rules Section */}
        <div className="mb-12">
          <h2 className="font-heading font-bold text-3xl text-center mb-8 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rules.map((rule, index) => (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/30 transition-colors duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <rule.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {rule.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-body text-base leading-relaxed">
                    {rule.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/30 w-[60%] mx-auto">
          <p className="font-body text-base text-muted-foreground">
            © 2025 Beginnre Bytes Quiz. Built by{" "}
            <span className=" ">
              <a
                href="https://www.codafri.com"
                className=" text-blue-400 font-medium"
              >
                Codafri
              </a>
            </span>
            !
          </p>
        </footer>
      </div>
    </div>
  );
}
